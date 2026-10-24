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
export const OUTER_WALL = 200;
export const PARTITION = 150;
const GAP = 300; // between neighbouring rooms in ROOMS

/**
 * A room's clear floor, mm: on each side where another room lies across the
 * gap, it reaches halfway to the partition's face.
 */
export function floorOf(r: Room) {
  const grow = (GAP - PARTITION) / 2;
  const near = (a: number, b: number) => Math.abs(a - b) < 1;
  const overlaps = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1;
  const across = (test: (o: Room) => boolean) => (ROOMS.some((o) => o !== r && test(o)) ? grow : 0);
  return {
    x0: r.x - across((o) => near(o.x + o.w, r.x - GAP) && overlaps(o.y, o.y + o.d, r.y, r.y + r.d)),
    x1: r.x + r.w + across((o) => near(o.x, r.x + r.w + GAP) && overlaps(o.y, o.y + o.d, r.y, r.y + r.d)),
    y0: r.y - across((o) => near(o.y + o.d, r.y - GAP) && overlaps(o.x, o.x + o.w, r.x, r.x + r.w)),
    y1: r.y + r.d + across((o) => near(o.y, r.y + r.d + GAP) && overlaps(o.x, o.x + o.w, r.x, r.x + r.w)),
  };
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

/** The doorways between rooms (as the playground places them) and the front door. */
export const DOORS: readonly Opening[] = [
  { run: "ns", at: 4250, across: 9450, width: 1000, bottom: 0, top: DOOR_HEAD }, // living to hall
  { run: "ew", at: 10900, across: 6450, width: 1800, bottom: 0, top: DOOR_HEAD }, // living to kitchen
  { run: "ns", at: 4200, across: 3150, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // master
  { run: "ew", at: 8700, across: 3550, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // bedroom 2
  { run: "ew", at: 5500, across: 3550, width: 750, bottom: 0, top: DOOR_HEAD, swing: { hinge: "low", side: -1, wall: PARTITION } }, // bedroom 3
  { run: "ew", at: 4000, across: 4950, width: 650, bottom: 0, top: DOOR_HEAD, swing: { hinge: "low", side: 1, wall: PARTITION } }, // bathroom
  { run: "ew", at: 2550, across: 1850, width: 650, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // master bath
  { run: "ew", at: 8500, across: 4950, width: 700, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: 1, wall: PARTITION } }, // shelter
  { run: "ns", at: 8000, across: 7550, width: 700, bottom: 0, top: DOOR_HEAD, swing: { hinge: "high", side: -1, wall: PARTITION } }, // yard
];

/** The front door: the living room's south wall, near its east end. */
export const FRONT_DOOR: Opening = {
  run: "ew",
  at: 14050,
  across: 6400,
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
  win("ew", 12450, -100, 3000), // living, north
  win("ns", 2200, 15400, 1500), // living, east
  win("ew", 12000, 9100, 1000), // kitchen, south
  win("ns", 3900, -100, 1500), // master, west
  win("ew", 7950, -100, 1200), // bedroom 2, north
  win("ew", 4800, -100, 1500), // bedroom 3, north
  win("ew", 5150, 6900, 600, 1500, 2100), // bathroom, south
  win("ns", 450, -100, 600, 1500, 2100), // master bath, west
  win("ew", 6650, 9100, 1200), // yard, south
];

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
