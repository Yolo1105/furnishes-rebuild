import { BOUNDS, CEILING, FRONT_DOOR } from "./flat";

/**
 * The camera as a function of scroll progress s, 0 to 1. One camera does it
 * all: on the sheet it hangs far above the flat behind a half-degree lens,
 * which flattens perspective until the model is a true plan; then the cut
 * rises (the walls grow), the camera tips and comes down, the lens opens and
 * the distance shrinks together so there is never a cut, and it walks in
 * through the front door at eye height and turns to the living room.
 */

export const STOPS = { sheet: 0.08, lifted: 0.42, landed: 0.66 };

const smooth = (t: number) => t * t * (3 - 2 * t);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const rad = Math.PI / 180;

type Ease = (t: number) => number;
/** A value through keys [s, value, ease into this key]. */
function track(keys: [number, number, Ease?][]) {
  return (s: number) => {
    if (s <= keys[0]![0]) return keys[0]![1];
    for (let i = 1; i < keys.length; i++) {
      const [s1, v1, ease] = keys[i]!;
      const [s0, v0] = keys[i - 1]!;
      if (s <= s1) return v0 + (v1 - v0) * (ease ?? ((t: number) => t))((s - s0) / (s1 - s0));
    }
    return keys[keys.length - 1]![1];
  };
}

export type Shot = {
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
  fov: number;
  near: number;
  far: number;
  /** height of the cut plane, m */
  cut: number;
};

export function makeRig(aspect: number) {
  const portrait = aspect < 0.9;
  const fovWalk = portrait ? 70 : aspect < 1.5 ? 58 : 52;
  const cx = (BOUNDS.x0 + BOUNDS.x1) / 2000;
  const cz = (BOUNDS.y0 + BOUNDS.y1) / 2000;
  // the sheet frames the whole flat, with a margin
  const flatW = (BOUNDS.x1 - BOUNDS.x0) / 1000 + 9.5;
  const flatD = (BOUNDS.y1 - BOUNDS.y0) / 1000 + 8;
  const frame0 = Math.max(flatD, flatW / aspect);

  const door = { x: FRONT_DOOR.at / 1000, z: FRONT_DOOR.across / 1000 };
  const EYE = 1.55;
  const OUTSIDE = 3.0; // where the camera lands: this far outside the door, m
  const landFrame = 2 * OUTSIDE * Math.tan((fovWalk * rad) / 2);
  const { sheet: s1, lifted: s2, landed: s3 } = STOPS;
  const L = Math.log;
  const T = (deg: number) => Math.tan((deg * rad) / 2);

  // ---- from above: tip early, so the walls are seen rising, not just risen
  const early: Ease = (t) => 0.5 * smooth(t) + 0.5 * (1 - (1 - t) * (1 - t));
  const elev = track([[0, 90], [s1, 90], [s2, 36, early], [s3, 0, smooth]]);
  const SHEET_LENS = 0.5; // degrees
  const lens = track([[0, L(T(SHEET_LENS))], [s1, L(T(SHEET_LENS))], [s2, L(T(9)), smooth], [s3, L(T(fovWalk)), smoother]]);
  const frame = track([[0, L(frame0)], [s1, L(frame0)], [s2, L(portrait ? 18 : 14), smooth], [s3, L(landFrame), smoother]]);
  // the sheet sits a little high, so the flat overlaps the title behind it
  const sheetX = cx;
  const sheetZ = cz + 0.3;
  const tx = track([[0, sheetX], [s1, sheetX], [s2, 12.6, smooth], [s3, door.x, smooth]]);
  const ty = track([[0, 0], [s1, 0], [s2, 0.8, smooth], [s3, EYE, smooth]]);
  const tz = track([[0, sheetZ], [s1, sheetZ], [s2, 4.2, smooth], [s3, door.z, smooth]]);
  // walls first: the cut climbs to just over them, then clears everything
  const cut = track([[0, 1.2], [s1 + 0.01, 1.2], [s2, CEILING / 1000 + 0.05, smooth], [s3, 6, smooth]]);

  // ---- on foot: through the door, then a turn towards the room
  const walkZ = track([[s3, door.z + OUTSIDE], [0.86, door.z - 1.2, smooth], [1, door.z - 1.5, smooth]]);
  const walkX = track([[s3, door.x], [0.86, door.x - 0.05], [1, door.x - 0.15, smooth]]);
  const turn = track([[0.8, 0], [1, 40, smooth]]);
  const lookDown = track([[s3, 0], [1, -7, smooth]]);

  return (sIn: number): Shot => {
    const s = clamp01(sIn);
    const c = cut(s);
    if (s <= s3) {
      const e = elev(s) * rad;
      const tanHalf = Math.exp(lens(s));
      const dist = Math.exp(frame(s)) / (2 * tanHalf);
      const y = ty(s) + dist * Math.sin(e);
      return {
        x: tx(s),
        y,
        z: tz(s) + dist * Math.cos(e),
        pitch: -e,
        yaw: 0,
        fov: (2 * Math.atan(tanHalf)) / rad,
        // keep depth tight: from far above, everything is a thin slab
        near: Math.max(0.05, (y - 8) * 0.6),
        far: y > 60 ? y * 1.5 + 200 : 400,
        cut: c,
      };
    }
    return {
      x: walkX(s),
      y: EYE,
      z: walkZ(s),
      pitch: lookDown(s) * rad,
      yaw: turn(s) * rad,
      fov: fovWalk,
      near: 0.05,
      far: 200,
      cut: c,
    };
  };
}
