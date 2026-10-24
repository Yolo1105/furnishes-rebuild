/**
 * The showcase flat: a 5-room HDB, as the playground lays it out
 * (personal_local/furnishes-playground, room-store.ts `showcaseFlat`).
 *
 * Sheet coordinates in millimetres: x runs east, y runs south from the
 * flat's north edge, so the plan reads with north at the top. Rooms sit
 * 300 mm apart, as the playground spaces them; `floorOf` gives a room's
 * clear floor, which reaches into that gap so the wall left between two
 * rooms is a partition's thickness.
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

/** Wall height, and thickness round the outside and between rooms, mm. */
export const CEILING = 2600;
export const OUTER_WALL = 100;
export const PARTITION = 75;
const GAP = 300; // between neighbouring rooms in ROOMS

type Side = {
  axis: "x" | "y"; // the wall runs across this axis: its line is an x (or y) value
  edge: number; // the room's edge on this side, mm
  out: -1 | 1; // which way is outward
  range: [number, number]; // the side's extent along the wall, mm
  inner: [number, number][]; // stretches with another room across the gap, merged over junctions
};

/** A room's four sides, and where along each another room lies across the gap. */
export function sidesOf(r: Room): Side[] {
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
 * A room's clear floor, as a rectangle, mm: on each side where another room
 * lies across the gap, it reaches halfway to the partition's face. (The
 * walls themselves follow each side stretch by stretch: see `wallBoxes`.)
 */
export function floorOf(r: Room) {
  const grow = (GAP - PARTITION) / 2;
  const [w, e, n, s] = sidesOf(r).map((side) => (side.inner.length ? grow : 0));
  return { x0: r.x - w!, x1: r.x + r.w + e!, y0: r.y - n!, y1: r.y + r.d + s! };
}

/** A box on the sheet, [x0, y0, x1, y1] mm. */
export type Box = [number, number, number, number];

/**
 * The walls as boxes to fill and boxes to clear, mm. Every room, grown by
 * half the gap, fills its share of the walls round it; then each room's
 * floor is cleared, reaching into the gap wherever another room lies across
 * it (leaving a partition); `trim` cuts the outside walls, and the slab
 * under them, to their thickness everywhere else.
 */
export function wallBoxes() {
  const half = GAP / 2;
  const grow = (GAP - PARTITION) / 2;
  const add: Box[] = ROOMS.map((r) => [r.x - half, r.y - half, r.x + r.w + half, r.y + r.d + half]);
  const clear: Box[] = ROOMS.map((r) => [r.x, r.y, r.x + r.w, r.y + r.d]);
  const trim: Box[] = [];
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
      // the rest of the side is outside: trim the wall to OUTER_WALL there. At
      // the room's corner the trim runs on round it; where it meets another
      // room's wall it stops at that wall's outer face.
      let at = side.range[0];
      for (const [a0, a1] of [...side.inner, [side.range[1], side.range[1]] as [number, number]]) {
        if (a0 > at) {
          const lo = at === side.range[0] ? at - half : at + OUTER_WALL;
          const hi = a0 === side.range[1] ? a0 + half : a0 - OUTER_WALL;
          if (hi > lo) trim.push(strip(side, OUTER_WALL, half + 1, lo, hi));
        }
        at = Math.max(at, a1);
      }
    }
  }
  return { add, clear, trim };
}
/** A door's head, and a window's sill and head, mm. */
export const DOOR_HEAD = 2100;
export const WINDOW = { sill: 900, head: 2400 } as const;

/**
 * An opening through a wall: `at` is its centre along the wall (x for a
 * wall running east-west, y for one running north-south), `across` is the
 * wall's line, `width` its width; all mm.
 */
export type Opening = {
  run: "ew" | "ns";
  at: number;
  across: number;
  width: number;
  bottom: number;
  top: number;
  /**
   * A hinged door's swing, for the plan's arc: which jamb it hangs on (the
   * one at the lower or higher end along the wall), which side of the wall
   * it opens into (-1 north or west, 1 south or east), and the wall's
   * thickness, mm.
   */
  swing?: { hinge: "low" | "high"; side: -1 | 1; wall: number };
};

/** The household shelter's steel door, opening out into the hall. */
export const SHELTER_DOOR: Opening = {
  run: "ew",
  at: 8500,
  across: 4950,
  width: 700,
  bottom: 0,
  top: DOOR_HEAD,
  swing: { hinge: "high", side: -1, wall: PARTITION },
};

/** The doorways between rooms (as the playground places them) and the front door. */
export const DOORS: readonly Opening[] = [
  { run: "ns", at: 4250, across: 9450, width: 1000, bottom: 0, top: DOOR_HEAD }, // living to hall
  { run: "ew", at: 10900, across: 6450, width: 1800, bottom: 0, top: DOOR_HEAD }, // living to kitchen
  { run: "ns", at: 4200, across: 3150, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // master
  { run: "ew", at: 8700, across: 3550, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // bedroom 2
  { run: "ew", at: 5500, across: 3550, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "low", side: -1, wall: PARTITION } }, // bedroom 3
  { run: "ew", at: 4000, across: 4950, width: 650, bottom: 0, top: DOOR_HEAD, swing: { hinge: "low", side: 1, wall: PARTITION } }, // bathroom
  { run: "ew", at: 2550, across: 1850, width: 650, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // master bath
  SHELTER_DOOR,
  { run: "ns", at: 8000, across: 7550, width: 700, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // yard
];

/** The front door: the living room's south wall, near its east end. */
export const FRONT_DOOR: Opening = {
  run: "ew",
  at: 14050,
  across: 6350,
  width: 850,
  bottom: 0,
  top: DOOR_HEAD,
  swing: { hinge: "high", side: -1, wall: OUTER_WALL },
};

const win = (run: Opening["run"], at: number, across: number, width: number, sill: number = WINDOW.sill, head: number = WINDOW.head): Opening => ({
  run,
  at,
  across,
  width,
  bottom: sill,
  top: head,
});

/** Windows in the outside walls. */
export const WINDOWS: readonly Opening[] = [
  win("ew", 12450, -50, 3000), // living, north
  win("ns", 2200, 15350, 1500), // living, east
  win("ew", 12000, 9050, 1000), // kitchen, south
  win("ns", 3900, -50, 1500), // master, west
  win("ew", 5150, 6850, 600, 1500, 2100), // bathroom, south
  win("ns", 450, -50, 600, 1500, 2100), // master bath, west
  win("ew", 6650, 9050, 1200), // yard, south
];

// ---- what makes it an HDB flat ----------------------------------------------

/**
 * Reinforced-concrete columns, [x0, y0, x1, y1] mm: 300 square, flush with
 * the outside face at the corners, centred on the wall where main walls meet.
 */
export const COLUMNS: readonly [number, number, number, number][] = [
  [-100, -100, 200, 200], // north-west corner
  [3000, -100, 3300, 200], // north wall, at the master bath and bedroom 3
  [6300, -100, 6600, 200], // north wall, at bedrooms 3 and 2
  [9300, -100, 9600, 200], // north wall, at bedroom 2 and the living room
  [15100, -100, 15400, 200], // north-east corner
  [15100, 6100, 15400, 6400], // south-east corner, by the front door
  [9300, 3400, 9600, 3700], // the hall's end, at the living room
  [9300, 6300, 9600, 6600], // where the living room, shelter and kitchen meet
  [12500, 6400, 12800, 6700], // the kitchen's north-east corner
];

/** The household shelter's walls are reinforced concrete: this much thicker, inwards, mm. */
export const SHELTER_WALL = 200;

/**
 * Bay windows on the north wall, mm: the wall is open from sill to head
 * between x0 and x1, and a box of `depth` stands out beyond it, a seat
 * ledge below and glazing all across its outer face.
 */
export const BAYS: readonly { x0: number; x1: number; sill: number; head: number; depth: number }[] = [
  { x0: 4700, x1: 6000, sill: 500, head: 2300, depth: 500 }, // bedroom 3, over its desk
  { x0: 7950, x1: 8750, sill: 500, head: 2300, depth: 500 }, // bedroom 2
];

/**
 * The air-conditioner ledge outside the living room's east wall, mm: a
 * slab at floor level, walled by a parapet `parapet` high.
 */
export const AC_LEDGE = { x0: 15400, y0: 300, x1: 16000, y1: 1300, parapet: 1000, wall: 100 } as const;

/** The flat's bounds on the sheet, outer walls included, mm. */
export const BOUNDS = (() => {
  const xs = ROOMS.flatMap((r) => [r.x, r.x + r.w]);
  const ys = ROOMS.flatMap((r) => [r.y, r.y + r.d]);
  return {
    x0: Math.min(...xs) - OUTER_WALL,
    x1: Math.max(...xs) + OUTER_WALL,
    y0: Math.min(...ys) - OUTER_WALL,
    y1: Math.max(...ys) + OUTER_WALL,
  };
})();
