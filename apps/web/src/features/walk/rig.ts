import { smooth, smoother } from "./ease";
import { BOUNDS_M, CEILING, FRONT_DOOR } from "./flat";

/**
 * The camera as a function of scroll progress s, 0 to 1. One camera does it
 * all: on the sheet it hangs far above the flat behind a half-degree lens,
 * which flattens perspective until the model is a true plan; then the cut
 * rises (the walls grow), the camera tips and comes down, the lens opens and
 * the distance shrinks together so there is never a cut, and it walks in
 * through the front door at eye height and turns to the living room. That
 * is the first half of the scroll. In the second it watches the room come
 * to life: close on the bookcase while it is built, back in the corner while
 * the materials sweep in, then up over the walls while the furniture moves
 * to its second layout, and up and away at the end. Past that (1 to 2) a
 * piece is ordered for it: the camera comes down on the wall it will stand
 * by while it is picked, made yours and ordered, rises over the flat while
 * it is on its way, and comes back down to it once it is home.
 */

/** How much of the scroll the walk in takes; the room comes to life in the rest. */
const WALK = 0.5;
/** The walk's own stops, as shares of the walk. */
const W = { sheet: 0.16, lifted: 0.46, landed: 0.68 };

/** Where each stage ends, as shares of the whole scroll. */
export const STOPS = {
  sheet: W.sheet * WALK, // the plan: empty, then furnished as it is drawn in
  lifted: W.lifted * WALK, // the walls up, seen from above
  landed: W.landed * WALK, // at the front door
  walked: WALK, // inside, turned to the living room
  built: 0.66, // the bookcase built again
  finished: 0.8, // the materials swept in
  laid: 0.92, // the furniture in its second layout
  away: 1, // up and away over the flat
  picked: 1.22, // a piece drawn in where it would go
  made: 1.42, // its finish chosen
  ordered: 1.58, // in the cart and ordered
  sent: 1.8, // on its way
  home: 2, // put together where it was drawn in
};

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

/**
 * `sheetFrame`: how many metres the canvas's height spans on the sheet, if
 * the sheet should match a drawing already on the page; else the flat fits
 * with a margin.
 */
export function makeRig(aspect: number, sheetFrame?: number) {
  const portrait = aspect < 1; // as the side panel: below square it rises from the foot (WalkPanel.module.css)
  const fovWalk = portrait ? 70 : aspect < 1.5 ? 58 : 52;
  const cx = (BOUNDS_M.x0 + BOUNDS_M.x1) / 2;
  const cz = (BOUNDS_M.y0 + BOUNDS_M.y1) / 2;
  // the sheet frames the whole flat, with a margin
  const flatW = BOUNDS_M.x1 - BOUNDS_M.x0 + 6;
  const flatD = BOUNDS_M.y1 - BOUNDS_M.y0 + 5;
  const frame0 = sheetFrame ?? Math.max(flatD, flatW / aspect);

  const door = { x: FRONT_DOOR.at / 1000, z: FRONT_DOOR.across / 1000 };
  const EYE = 1.55;
  const OUTSIDE = 3.0; // where the camera lands: this far outside the door, m
  const landFrame = 2 * OUTSIDE * Math.tan((fovWalk * rad) / 2);
  const { sheet: s1, lifted: s2, landed: s3 } = W;
  const L = Math.log;
  const T = (deg: number) => Math.tan((deg * rad) / 2);

  // ---- from above: tip early, so the walls are seen rising, not just risen
  const early: Ease = (t) => 0.5 * smooth(t) + 0.5 * (1 - (1 - t) * (1 - t));
  const elev = track([[0, 90], [s1, 90], [s2, 36, early], [s3, 0, smooth]]);
  const SHEET_LENS = 0.5; // degrees
  const lens = track([[0, L(T(SHEET_LENS))], [s1, L(T(SHEET_LENS))], [s2, L(T(9)), smooth], [s3, L(T(fovWalk)), smoother]]);
  const frame = track([[0, L(frame0)], [s1, L(frame0)], [s2, L(portrait ? 18 : 14), smooth], [s3, L(landFrame), smoother]]);
  // the sheet is centred on the screen
  const sheetX = cx;
  const sheetZ = cz;
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

  // ---- the room come to life: hold each view while its stage plays out
  type View = { x: number; y: number; z: number; yaw: number; pitch: number };
  const walkedIn: View = { x: door.x - 0.15, y: EYE, z: door.z - 1.5, yaw: 40, pitch: -7 };
  // each view looks a little right of what it shows, so it sits in the open
  // part of the screen left of the side panel
  const atBookcase: View = { x: 13.2, y: 1.5, z: 4.4, yaw: 43, pitch: -8 };
  const inCorner: View = { x: 14.9, y: 2.2, z: 5.0, yaw: 42, pitch: -22 };
  const overWalls: View = { x: 14.4, y: 4.6, z: 7.4, yaw: 30, pitch: -45 };
  const away: View = { x: 13.8, y: 8.0, z: 10.5, yaw: 24, pitch: -52 };
  // the ordered piece, from over the living room, looking down past the dining chairs
  const atOrder: View = { x: 11.7, y: 3.3, z: 3.9, yaw: 122, pitch: -48 };
  const { walked, built, finished, laid, picked, ordered, sent, home } = STOPS;
  const views: [number, View][] = [
    [walked, walkedIn],
    [walked + 0.06, atBookcase],
    [built, atBookcase],
    [built + 0.04, inCorner],
    [finished, inCorner],
    [finished + 0.04, overWalls],
    [laid, overWalls],
    [1, away],
    [picked - 0.06, atOrder],
    [ordered, atOrder],
    [ordered + 0.06, away],
    [sent, away],
    [sent + 0.08, atOrder],
    [home, atOrder],
  ];
  const viewTrack = (key: keyof View) => track(views.map(([s, v], i) => [s, v[key], i ? smoother : undefined]));
  const later = { x: viewTrack("x"), y: viewTrack("y"), z: viewTrack("z"), yaw: viewTrack("yaw"), pitch: viewTrack("pitch") };

  return (sIn: number): Shot => {
    const sAll = Math.min(STOPS.home, Math.max(0, sIn));
    if (sAll > WALK) {
      return {
        x: later.x(sAll),
        y: later.y(sAll),
        z: later.z(sAll),
        pitch: later.pitch(sAll) * rad,
        yaw: later.yaw(sAll) * rad,
        fov: fovWalk,
        near: 0.05,
        far: 200,
        cut: 6,
      };
    }
    const s = sAll / WALK; // through the walk itself
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
