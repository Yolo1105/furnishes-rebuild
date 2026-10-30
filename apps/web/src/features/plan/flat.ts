/**
 * The showcase flat: a 5-room HDB, as the playground lays it out (the
 * landing-page branch's features/plan/flat.ts, cut down to what a 2D plan
 * needs).
 *
 * Millimetres throughout: x runs east, y runs south from the flat's north
 * edge, so the plan reads with north at the top. Rooms sit GAP apart, and
 * the wall left between two rooms is a partition's thickness.
 */

export type Room = { key: string; name: string; x: number; y: number; w: number; d: number };

export const ROOMS: readonly Room[] = [
  { key: "living", name: "Living & dining", x: 9600, y: 0, w: 5700, d: 6300 },
  { key: "kitchen", name: "Kitchen", x: 7700, y: 6600, w: 5000, d: 2400 },
  { key: "master", name: "Master bedroom", x: 0, y: 2000, w: 3000, d: 3800 },
  { key: "bedroom2", name: "Bedroom 2", x: 6600, y: 0, w: 2700, d: 3400 },
  { key: "bedroom3", name: "Bedroom 3", x: 3300, y: 0, w: 3000, d: 3400 },
  { key: "bathroom", name: "Bathroom", x: 3300, y: 5100, w: 2300, d: 1700 },
  { key: "ensuite", name: "Master bath", x: 0, y: 0, w: 3000, d: 1700 },
  { key: "hall", name: "Hall", x: 3300, y: 3700, w: 6000, d: 1100 },
  { key: "shelter", name: "Shelter", x: 7700, y: 5100, w: 1600, d: 1200 },
  { key: "yard", name: "Yard", x: 5900, y: 5100, w: 1500, d: 3900 },
];

/** Where each room's name sits, where its furniture leaves the floor free; the room's middle if not listed. */
export const NAME_AT: Record<string, [number, number]> = {
  living: [14050, 1000],
  kitchen: [10400, 7550],
  master: [1250, 4880],
  ensuite: [1580, 1250],
  bathroom: [5200, 5500],
  bedroom2: [7950, 2850],
  bedroom3: [5600, 1600],
  shelter: [8500, 5950],
};

/** Wall thickness round the outside and between rooms; every wall is one width. */
export const WALL = 100;
const GAP = 300; // between neighbouring rooms in ROOMS

/** A box on the plan, [x0, y0, x1, y1]. */
export type Box = readonly [number, number, number, number];

type Side = {
  axis: "x" | "y"; // the wall runs across this axis: its line is an x (or y) value
  edge: number; // the room's edge on this side
  out: -1 | 1; // which way is outward
  range: [number, number]; // the side's extent along the wall
  inner: [number, number][]; // stretches with another room across the gap, merged over junctions
};

/** A room's four sides, and where along each another room lies across the gap. */
function sidesOf(r: Room): Side[] {
  const all: Omit<Side, "inner">[] = [
    { axis: "x", edge: r.x, out: -1, range: [r.y, r.y + r.d] },
    { axis: "x", edge: r.x + r.w, out: 1, range: [r.y, r.y + r.d] },
    { axis: "y", edge: r.y, out: -1, range: [r.x, r.x + r.w] },
    { axis: "y", edge: r.y + r.d, out: 1, range: [r.x, r.x + r.w] },
  ];
  return all.map((side) => {
    const spans = ROOMS.flatMap((o): [number, number][] => {
      if (o === r) return [];
      const far = side.axis === "x" ? (side.out > 0 ? o.x : o.x + o.w) : side.out > 0 ? o.y : o.y + o.d;
      if (Math.abs(far - (side.edge + side.out * GAP)) > 1) return [];
      const [b0, b1] = side.axis === "x" ? [o.y, o.y + o.d] : [o.x, o.x + o.w];
      const [a0, a1] = [Math.max(b0, side.range[0]), Math.min(b1, side.range[1])];
      return a1 > a0 ? [[a0, a1]] : [];
    }).sort((p, q) => p[0] - q[0]);
    // a gap no wider than a wall between two such stretches is a junction, not outside
    const inner: [number, number][] = [];
    for (const [a0, a1] of spans) {
      const last = inner[inner.length - 1];
      if (last && a0 - last[1] <= GAP + 1) last[1] = Math.max(last[1], a1);
      else inner.push([a0, a1]);
    }
    return { ...side, inner };
  });
}

/**
 * The walls as boxes to fill and boxes to clear: every room, grown by half
 * the gap, fills its share of the walls round it; each room's floor is then
 * cleared, reaching into the gap wherever another room lies across it
 * (leaving a partition), and the outside walls are trimmed to their
 * thickness.
 */
export function wallBoxes() {
  const half = GAP / 2;
  const grow = (GAP - WALL) / 2;
  const fill: Box[] = ROOMS.map((r) => [r.x - half, r.y - half, r.x + r.w + half, r.y + r.d + half]);
  const clear: Box[] = ROOMS.map((r) => [r.x, r.y, r.x + r.w, r.y + r.d]);
  /** A strip `from` to `to` out from a side's edge, over `a0` to `a1` along it. */
  const strip = (side: Side, from: number, to: number, a0: number, a1: number): Box => {
    const [c0, c1] = [side.edge + side.out * from, side.edge + side.out * to].sort((p, q) => p - q) as [number, number];
    return side.axis === "x" ? [c0, a0, c1, a1] : [a0, c0, a1, c1];
  };
  for (const r of ROOMS) {
    const sides = sidesOf(r);
    /** Whether the side across the corner at `at` along `side` also has a room beyond it there. */
    const turnsInside = (side: Side, at: number) =>
      sides.some(
        (o) => o.axis !== side.axis && o.edge === at && o.inner.some(([a0, a1]) => a0 - 1 <= side.edge && side.edge <= a1 + 1),
      );
    for (const side of sides) {
      for (const [a0, a1] of side.inner) {
        // at a corner where both sides are partitions, run on to meet the other one's face
        const lo = a0 === side.range[0] && turnsInside(side, a0) ? a0 - grow : a0;
        const hi = a1 === side.range[1] && turnsInside(side, a1) ? a1 + grow : a1;
        clear.push(strip(side, 0, grow, lo, hi));
      }
      // the rest of the side is outside: cut the wall back to its thickness
      // there, running on round the room's corner, and stopping at another
      // room's wall where it meets one
      let at = side.range[0];
      for (const [a0, a1] of [...side.inner, [side.range[1], side.range[1]] as [number, number]]) {
        if (a0 > at) {
          const lo = at === side.range[0] ? at - half : at + WALL;
          const hi = a0 === side.range[1] ? a0 + half : a0 - WALL;
          if (hi > lo) clear.push(strip(side, WALL, half + 1, lo, hi));
        }
        at = Math.max(at, a1);
      }
    }
  }
  return { fill, clear };
}

/**
 * An opening through a wall: `run` is the wall's direction, `at` the
 * opening's centre along it, `across` the wall's centre line, `width` its
 * width. A hinged door has a `swing`: the jamb it hangs on (at the lower or
 * higher end along the wall) and the side it opens into (-1 north or west,
 * 1 south or east).
 */
export type Opening = {
  run: "ew" | "ns";
  at: number;
  across: number;
  width: number;
  swing?: { hinge: "low" | "high"; side: -1 | 1 };
};

/** The doorways between rooms and the front door. */
export const DOORS: readonly Opening[] = [
  { run: "ns", at: 4250, across: 9450, width: 1000 }, // living to hall
  { run: "ew", at: 10900, across: 6450, width: 1800 }, // living to kitchen
  { run: "ns", at: 4200, across: 3150, width: 750, swing: { hinge: "high", side: -1 } }, // master
  { run: "ew", at: 8700, across: 3550, width: 750, swing: { hinge: "high", side: -1 } }, // bedroom 2
  { run: "ew", at: 5500, across: 3550, width: 750, swing: { hinge: "low", side: -1 } }, // bedroom 3
  { run: "ew", at: 4000, across: 4950, width: 650, swing: { hinge: "low", side: 1 } }, // bathroom
  { run: "ew", at: 2550, across: 1850, width: 650, swing: { hinge: "high", side: -1 } }, // master bath
  { run: "ew", at: 8500, across: 4950, width: 700, swing: { hinge: "high", side: -1 } }, // shelter
  { run: "ns", at: 8000, across: 7550, width: 700, swing: { hinge: "high", side: -1 } }, // yard
  { run: "ew", at: 14050, across: 6350, width: 850, swing: { hinge: "high", side: -1 } }, // front door
];

/** Windows in the outside walls. */
export const WINDOWS: readonly Opening[] = [
  { run: "ew", at: 12450, across: -50, width: 3000 }, // living, north
  { run: "ns", at: 2200, across: 15350, width: 1500 }, // living, east
  { run: "ew", at: 12000, across: 9050, width: 1000 }, // kitchen, south
  { run: "ns", at: 3900, across: -50, width: 1500 }, // master, west
  { run: "ew", at: 5150, across: 6850, width: 600 }, // bathroom, south
  { run: "ns", at: 450, across: -50, width: 600 }, // master bath, west
  { run: "ew", at: 6650, across: 9050, width: 1200 }, // yard, south
];

/** Concrete columns, 300 square: at the corners, and where main walls meet. */
export const COLUMNS: readonly Box[] = [
  [-100, -100, 200, 200],
  [3000, -100, 3300, 200],
  [6300, -100, 6600, 200],
  [9300, -100, 9600, 200],
  [15100, -100, 15400, 200],
  [15100, 6100, 15400, 6400],
  [9300, 3400, 9600, 3700],
  [9300, 6300, 9600, 6600],
  [12500, 6400, 12800, 6700],
];

/** Bay windows standing `depth` out from the north wall, between x0 and x1. */
export const BAYS: readonly { x0: number; x1: number; depth: number }[] = [
  { x0: 4700, x1: 6000, depth: 500 }, // bedroom 3
  { x0: 7950, x1: 8750, depth: 500 }, // bedroom 2
];

/** The air-conditioner ledge outside the living room's east wall, behind a parapet `wall` thick. */
export const AC_LEDGE = { x0: 15400, y0: 300, x1: 16000, y1: 1300, wall: 100 } as const;

/** All that is drawn: the flat, the bays to the north and the A/C ledge to the east. */
export const DRAWN: Box = [-WALL, -WALL - Math.max(...BAYS.map((b) => b.depth)), AC_LEDGE.x1, 9000 + WALL];

/** The flat's floor area, m²: every room's floor, walls not counted. */
export const FLOOR_AREA = Math.round(ROOMS.reduce((sum, r) => sum + r.w * r.d, 0) / 1e6);

/** How the flat is named and summed up over its plan. */
export const FLAT = {
  name: "5-room HDB",
  rooms: "3 bedrooms · 2 bathrooms",
  household: "2 adults · 2 children", // the master's double bed and the two singles
} as const;
