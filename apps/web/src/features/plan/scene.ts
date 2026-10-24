import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { BOUNDS, CEILING, DOOR_HEAD, DOORS, floorOf, FRONT_DOOR, OUTER_WALL, ROOMS, WINDOWS, type Opening } from "./flat";
import { BoxSolid } from "./solid";

/**
 * The flat as a drawing you can walk into. One closed solid holds the floor
 * slab and every wall, with the rooms, doorways and windows cut out of it.
 * Faces are paper, gently shaded by the way they face; the solid's inside,
 * seen only where the cut plane slices it, is ink; edges are ink lines.
 * Nothing is lit, so straight down it is exactly a plan. The scene has no
 * background or ground of its own: it is drawn over the page's moving wash.
 *
 * World units are metres: x east, y up, z south (sheet y), so the camera's
 * default -z view looks north, the way the plan is drawn.
 */

export type Palette = { paper: string; ink: string };

const M = 1 / 1000; // sheet millimetres to metres
const SLAB = 0.15; // floor slab depth, m
const PANEL = 0.018; // Furnishes board thickness, m

/** Built-in wardrobes, [x0, z0, x1, z1] in metres: the plan marks each with a cross. */
export const WARDROBES: readonly [number, number, number, number][] = [
  [0.05, 5.2, 2.0, 5.79], // master
  [8.78, 0.05, 9.37, 2.2], // bedroom 2
  [3.35, 2.9, 4.95, 3.47], // bedroom 3
];

/** One shade a face, from which way it faces: up is the paper itself. */
const SHADE = { up: 1, x: 0.93, z: 0.87, down: 0.8 };

export function buildFlatScene(palette: Palette) {
  const scene = new THREE.Scene();
  const paper = new THREE.Color(palette.paper);
  const ink = new THREE.Color(palette.ink);

  /** Everything is cut by this plane: it keeps what lies below its height. */
  const cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.2);
  const lineMats: LineMaterial[] = [];
  const disposables: { dispose(): void }[] = [];

  const faceMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    clippingPlanes: [cut],
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  // Pushed back as far as the faces, so a thin piece's paper top always wins
  // over its own inside; only the lines sit in front.
  const insideMat = new THREE.MeshBasicMaterial({
    color: ink,
    side: THREE.BackSide,
    clippingPlanes: [cut],
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  // A cut piece of furniture is not poché: only the building's walls are.
  const pieceInsideMat = insideMat.clone();
  pieceInsideMat.color.copy(paper);
  disposables.push(faceMat, insideMat, pieceInsideMat);

  /**
   * Paper colours on a geometry's vertices, by the way each face faces; up
   * faces at or over `inkFrom` m are ink, as the cut shows them.
   */
  const shade = (g: THREE.BufferGeometry, inkFrom = Infinity) => {
    const n = g.getAttribute("normal");
    const p = g.getAttribute("position");
    const colors = new Float32Array(n.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n.count; i++) {
      const ny = n.getY(i);
      const k =
        ny > 0.5 ? SHADE.up : ny < -0.5 ? SHADE.down : Math.abs(n.getX(i)) > 0.5 ? SHADE.x : SHADE.z;
      if (ny > 0.5 && p.getY(i) >= inkFrom) c.copy(ink);
      else c.copy(paper).multiplyScalar(k);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  };

  const lines = (g: THREE.BufferGeometry, width: number) => {
    const edges = new THREE.EdgesGeometry(g, 20);
    const lg = new LineSegmentsGeometry().setPositions(edges.attributes.position!.array as Float32Array);
    edges.dispose();
    const mat = new LineMaterial({ color: ink, linewidth: width, worldUnits: false, clippingPlanes: [cut] });
    lineMats.push(mat);
    disposables.push(lg, mat);
    return new LineSegments2(lg, mat);
  };

  /** A solid object: shaded paper faces, its inside, ink edges. */
  const solid = (g: THREE.BufferGeometry, width: number, inside: THREE.Material, inkFrom?: number) => {
    shade(g, inkFrom);
    disposables.push(g);
    const group = new THREE.Group();
    group.add(new THREE.Mesh(g, faceMat), new THREE.Mesh(g, inside), lines(g, width));
    scene.add(group);
    return group;
  };

  // ---- the shell -----------------------------------------------------------
  const shell = new BoxSolid();
  const H = CEILING * M;
  const o = OUTER_WALL * M;
  for (const r of ROOMS) {
    shell.add([r.x * M - o, -SLAB, r.y * M - o], [(r.x + r.w) * M + o, H, (r.y + r.d) * M + o]);
  }
  for (const r of ROOMS) {
    const f = floorOf(r);
    shell.sub([f.x0 * M, 0, f.y0 * M], [f.x1 * M, H, f.y1 * M]);
  }
  const hole = (op: Opening) => {
    const half = (op.width / 2) * M;
    const t = 0.25; // past either face of any wall
    const along: [number, number] = [op.at * M - half, op.at * M + half];
    const across: [number, number] = [op.across * M - t, op.across * M + t];
    const [y0, y1] = [op.bottom * M, op.top * M];
    if (op.run === "ew") shell.sub([along[0], y0, across[0]], [along[1], y1, across[1]]);
    else shell.sub([across[0], y0, along[0]], [across[1], y1, along[1]]);
  };
  [...DOORS, FRONT_DOOR, ...WINDOWS].forEach(hole);
  // the walls' tops are ink, so once the cut clears them they read as it did
  solid(shell.build(), 1.5, insideMat, H - 0.001);

  // ---- furniture and fittings ---------------------------------------------
  /** A box from (x0, y0, z0) to (x1, y1, z1), metres. */
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return g;
  };
  /** An upright elliptic disc centred on (x, z), radii rx and rz, from y0 to y1. */
  const disc = (x: number, z: number, rx: number, rz: number, y0: number, y1: number) => {
    const g = new THREE.CylinderGeometry(1, 1, y1 - y0, 48);
    g.scale(rx, 1, rz);
    g.translate(x, (y0 + y1) / 2, z);
    return g;
  };
  const piece = (...parts: THREE.BufferGeometry[]) => parts.forEach((g) => solid(g, 0.6, pieceInsideMat));

  // living room: the sofa faces the television on the north wall
  piece(
    box(11.25, 0, 3.1, 13.65, 0.4, 4.0), // base
    ...[0, 1, 2].map((i) => box(11.43 + i * 0.68, 0.4, 3.12, 11.43 + (i + 1) * 0.68 - 0.02, 0.46, 3.8)), // seat cushions
    box(11.25, 0.4, 3.8, 13.65, 0.82, 4.0), // back
    box(11.25, 0.4, 3.1, 11.42, 0.62, 3.8), // arms
    box(13.48, 0.4, 3.1, 13.65, 0.62, 3.8),
    box(11.9, 0, 2.1, 13.0, 0.4, 2.7), // coffee table
    box(11.0, 0.002, 1.8, 13.9, 0.012, 4.3), // rug
    box(11.65, 0, 0.01, 13.25, 0.5, 0.43), // television console
    box(11.9, 0.62, 0.15, 13.0, 1.25, 0.2), // television
    // an armchair by the east window, turned to the room
    box(14.25, 0, 1.9, 15.05, 0.4, 2.7),
    box(14.88, 0.4, 1.9, 15.05, 0.8, 2.7),
    box(14.25, 0.4, 1.9, 14.88, 0.6, 2.05),
    box(14.25, 0.4, 2.55, 14.88, 0.6, 2.7),
    disc(14.75, 3.25, 0.22, 0.22, 0, 0.55), // side table
  );
  // dining: a table and four chairs by the kitchen
  const table = (x0: number, z0: number, x1: number, z1: number) => {
    const l = 0.05;
    piece(
      box(x0, 0.71, z0, x1, 0.75, z1),
      box(x0, 0, z0, x0 + l, 0.71, z0 + l),
      box(x1 - l, 0, z0, x1, 0.71, z0 + l),
      box(x0, 0, z1 - l, x0 + l, 0.71, z1),
      box(x1 - l, 0, z1 - l, x1, 0.71, z1),
    );
  };
  table(10.2, 4.7, 11.8, 5.6);
  const chair = (x: number, z: number, backZ: number) =>
    piece(box(x - 0.22, 0, z - 0.22, x + 0.22, 0.45, z + 0.22), box(x - 0.22, 0.45, backZ - 0.02, x + 0.22, 0.9, backZ + 0.02));
  chair(10.6, 4.45, 4.25);
  chair(11.4, 4.45, 4.25);
  chair(10.6, 5.85, 6.05);
  chair(11.4, 5.85, 6.05);

  // the Furnishes bookcase on the living room's west wall: real 18 mm boards
  const bx0 = 9.545;
  const bx1 = bx0 + 0.4;
  const [bz0, bz1, bh] = [1.2, 2.8, 1.8];
  piece(
    box(bx0, 0, bz0, bx1, bh, bz0 + PANEL), // side
    box(bx0, 0, bz1 - PANEL, bx1, bh, bz1), // side
    box(bx0, bh - PANEL, bz0, bx1, bh, bz1), // top
    box(bx0, 0.06, bz0, bx1, 0.06 + PANEL, bz1), // bottom
    ...[0.48, 0.9, 1.32].map((y) => box(bx0, y, bz0 + PANEL, bx1, y + PANEL, bz1 - PANEL)), // shelves
  );

  // bedrooms: each bed's head against the north, a duvet turned down, pillows
  const bed = (x0: number, z0: number, x1: number, z1: number) => {
    const w = x1 - x0;
    const n = w > 1.2 ? 2 : 1;
    const pw = (w - 0.16 - (n - 1) * 0.06) / n;
    piece(
      box(x0, 0, z0 + 0.06, x1, 0.5, z1), // mattress
      box(x0 - 0.03, 0, z0, x1 + 0.03, 0.95, z0 + 0.06), // headboard
      ...Array.from({ length: n }, (_, i) => box(x0 + 0.08 + i * (pw + 0.06), 0.5, z0 + 0.14, x0 + 0.08 + i * (pw + 0.06) + pw, 0.6, z0 + 0.48)),
      box(x0 - 0.015, 0.5, z0 + 0.62, x1 + 0.015, 0.54, z1 + 0.015), // duvet
      box(x0 - 0.015, 0.54, z0 + 0.62, x1 + 0.015, 0.56, z0 + 0.86), // its fold
    );
  };
  const bedside = (x0: number, z0: number) => piece(box(x0, 0, z0, x0 + 0.42, 0.5, z0 + 0.4));
  bed(0.55, 1.935, 2.15, 4.035); // master
  bedside(0.08, 1.955);
  bedside(2.2, 1.955);
  bed(6.85, 0.05, 7.85, 2.15); // bedroom 2
  bedside(7.9, 0.05);
  bed(3.5, 0.05, 4.5, 2.15); // bedroom 3
  bedside(4.55, 0.05);
  piece(box(5.0, 0, 0.01, 6.2, 0.75, 0.61)); // bedroom 3: desk
  chair(5.6, 0.85, 1.07);
  for (const [x0, z0, x1, z1] of WARDROBES) piece(box(x0, 0, z0, x1, 2.1, z1));

  // bathrooms: a WC and basin, and a shower tray with its drain
  const wc = (x: number, wall: number, dir: 1 | -1) => {
    const tank: [number, number] = [wall, wall + dir * 0.18];
    piece(
      box(x - 0.2, 0, Math.min(...tank), x + 0.2, 0.8, Math.max(...tank)),
      disc(x, wall + dir * 0.42, 0.18, 0.25, 0, 0.4),
    );
  };
  const basin = (x0: number, z0: number, x1: number, z1: number) =>
    piece(box(x0, 0, z0, x1, 0.85, z1), disc((x0 + x1) / 2, (z0 + z1) / 2, Math.min(x1 - x0, z1 - z0) * 0.32, Math.min(x1 - x0, z1 - z0) * 0.24, 0.85, 0.856));
  const shower = (x0: number, z0: number, x1: number, z1: number) =>
    piece(box(x0, 0, z0, x1, 0.03, z1), disc((x0 + x1) / 2, (z0 + z1) / 2, 0.05, 0.05, 0.03, 0.034));
  wc(1.3, 0.01, 1); // master bath
  basin(1.75, 0.01, 2.85, 0.5);
  shower(0.01, 0.01, 0.9, 1.69);
  wc(4.2, 6.79, -1); // bathroom
  basin(3.235, 6.0, 3.73, 6.79);
  shower(4.75, 5.035, 5.665, 6.79);

  // kitchen: counters on the south and east walls, a sink under the window,
  // the hob, the fridge by the yard door
  const plate = (x0: number, z0: number, x1: number, z1: number, y: number) => box(x0, y, z0, x1, y + 0.006, z1);
  piece(
    box(7.95, 0, 8.4, 12.69, 0.9, 8.99), // south counter
    box(12.1, 0, 7.0, 12.69, 0.9, 8.4), // east counter
    plate(11.62, 8.5, 11.98, 8.9, 0.9), // sink, two bowls
    plate(12.02, 8.5, 12.38, 8.9, 0.9),
    plate(9.25, 8.48, 9.95, 8.92, 0.9), // hob
    ...[9.43, 9.77].flatMap((x) => [8.6, 8.8].map((z) => disc(x, z, 0.08, 0.08, 0.906, 0.91))),
    box(7.645, 0, 6.545, 8.345, 1.8, 7.245), // fridge
  );
  // each hinged door's leaf, standing open square to its wall
  for (const d of [...DOORS, FRONT_DOOR]) {
    if (!d.swing) continue;
    const w = d.width * M;
    const hinge = d.at * M + (d.swing.hinge === "low" ? -w / 2 : w / 2);
    const toward = d.swing.hinge === "low" ? 1 : -1;
    const face = d.across * M + d.swing.side * d.swing.wall * M * 0.5;
    const along = [hinge, hinge + toward * 0.04].sort((p, q) => p - q) as [number, number];
    const perp = [face, face + d.swing.side * w].sort((p, q) => p - q) as [number, number];
    const top = DOOR_HEAD * M - 0.01;
    piece(d.run === "ew" ? box(along[0], 0, perp[0], along[1], top, perp[1]) : box(perp[0], 0, along[0], perp[1], top, along[1]));
  }

  // the yard: a washing machine in its corner
  piece(box(5.845, 0, 8.36, 6.445, 0.85, 8.98), disc(6.145, 8.67, 0.2, 0.2, 0.85, 0.856));

  return { scene, cut, lineMats, disposables };
}

/** A line material and the objects that use it, so the plan's notes can fade. */
type Fader = { mats: { opacity: number }[]; objects: THREE.Object3D[] };

/**
 * What an architect adds to a plan that is not the building: room names and
 * areas, tile joints, dimension strings round the outside, door swings,
 * window glass, wardrobe crosses, the north point, the title block and scale
 * bar. All of it lies on the floor or the ground. The notes that only make
 * sense on a flat drawing fade as the walls rise; room names, tiles and
 * window glass stay.
 * `lineMats` collects the line materials so the caller can size them.
 */
export function addSheet(
  scene: THREE.Scene,
  palette: Palette,
  font: string,
  disposables: { dispose(): void }[],
  lineMats: LineMaterial[],
) {
  const PX = 220; // canvas pixels a metre
  const FLOOR = 0.003; // notes lie this far over the floor, m
  const fader: Fader = { mats: [], objects: [] };
  const ink = new THREE.Color(palette.ink);
  /** The tile joints' colour: ink barely on paper. */
  const faint = new THREE.Color(palette.paper).lerp(ink, 0.22);

  const keep = (o: THREE.Object3D, mat: { opacity: number }, fade: boolean) => {
    scene.add(o);
    if (fade) {
      fader.mats.push(mat);
      fader.objects.push(o);
    }
  };

  /**
   * Text drawn into a canvas and laid flat at height `y`, turned `rot`
   * radians; `track` spaces its letters, in ems.
   */
  const text = (
    rows: { text: string; size: number; weight?: number; track?: number }[],
    x: number,
    z: number,
    { rot = 0, fade = false, y = FLOOR + 0.001 }: { rot?: number; fade?: boolean; y?: number } = {},
  ) => {
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    const set = (r: (typeof rows)[number]) => {
      g.font = `${r.weight ?? 400} ${r.size * PX}px ${font}`;
      g.letterSpacing = `${(r.track ?? 0) * r.size * PX}px`;
    };
    let w = 0;
    rows.forEach((r) => {
      set(r);
      w = Math.max(w, g.measureText(r.text).width);
    });
    const lead = rows.map((r) => r.size * PX * 1.5);
    c.width = Math.ceil(w) + 8;
    c.height = Math.ceil(lead.reduce((a, b) => a + b, 0)) + 8;
    g.fillStyle = palette.ink;
    g.textBaseline = "middle";
    g.textAlign = "center";
    let row = 4;
    rows.forEach((r, i) => {
      set(r);
      // letter spacing trails the last letter: shift back by half of it
      g.fillText(r.text, c.width / 2 + ((r.track ?? 0) * r.size * PX) / 2, row + lead[i]! / 2);
      row += lead[i]!;
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const geo = new THREE.PlaneGeometry(c.width / PX, c.height / PX);
    disposables.push(tex, mat, geo);
    const m = new THREE.Mesh(geo, mat);
    m.rotation.set(-Math.PI / 2, 0, rot);
    m.position.set(x, y, z);
    m.renderOrder = 2;
    keep(m, mat, fade);
  };

  /** Line segments, as flat pairs of [x, y, z] points. */
  const segments = (points: number[], width: number, fade: boolean, color: THREE.Color = ink) => {
    const geo = new LineSegmentsGeometry().setPositions(points);
    const mat = new LineMaterial({ color, linewidth: width, worldUnits: false, transparent: fade });
    lineMats.push(mat);
    disposables.push(geo, mat);
    keep(new LineSegments2(geo, mat), mat, fade);
  };

  /** A filled ink shape on the floor, through [x, z] points. */
  const fill = (points: [number, number][], fade: boolean) => {
    const geo = new THREE.ShapeGeometry(new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z))));
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: ink, transparent: fade, depthWrite: false });
    disposables.push(geo, mat);
    const m = new THREE.Mesh(geo, mat);
    m.position.y = FLOOR;
    m.renderOrder = 2;
    keep(m, mat, fade);
  };

  // ---- floor finishes: 300 mm tiles in the wet rooms ------------------------
  const TILE = 0.3;
  const joints: number[] = [];
  for (const r of ROOMS.filter((r) => ["kitchen", "bathroom", "ensuite", "yard"].includes(r.key))) {
    const f = floorOf(r);
    const [x0, z0, x1, z1] = [f.x0 / 1000, f.y0 / 1000, f.x1 / 1000, f.y1 / 1000];
    for (let x = x0 + TILE; x < x1 - 0.01; x += TILE) joints.push(x, 0.001, z0, x, 0.001, z1);
    for (let z = z0 + TILE; z < z1 - 0.01; z += TILE) joints.push(x0, 0.001, z, x1, 0.001, z);
  }
  segments(joints, 0.5, false, faint);

  // ---- room names, and each room's area -------------------------------------
  const LABEL_Y = 0.04; // just over the shower trays and the rug, so a name may sit on them
  // where a room's own furniture leaves its floor free for its name
  const at: Record<string, [number, number]> = {
    living: [14.05, 1.0],
    kitchen: [10.4, 7.55],
    master: [1.25, 4.88],
    ensuite: [1.58, 1.25],
    bathroom: [5.2, 5.5],
    bedroom2: [7.95, 2.85],
    bedroom3: [5.6, 1.6],
    shelter: [8.5, 5.95],
  };
  for (const r of ROOMS) {
    const [x, z] = at[r.key] ?? [(r.x + r.w / 2) / 1000, (r.y + r.d / 2) / 1000];
    const small = r.w < 2400 || r.d < 1500;
    text(
      [
        { text: r.name.toUpperCase(), size: small ? 0.15 : 0.2, track: 0.08 },
        { text: `${((r.w * r.d) / 1e6).toFixed(1)} m²`, size: small ? 0.12 : 0.15 },
      ],
      x,
      z,
      { y: LABEL_Y },
    );
  }

  // ---- dimension strings ----------------------------------------------------
  const TICK = 0.08; // half a tick's reach, m
  const OVER = 0.15; // how far an extension line runs past its dimension line, m
  const DIM_TEXT = 0.19;
  /**
   * A chain of dimensions along one side. `along` are the points measured,
   * `line` where the dimension line runs across them, `from` where each
   * extension line starts (by the building), `labels` one a gap, mm.
   */
  const chain = (run: "ew" | "ns", along: number[], line: number, from: number | number[], labels: string[]) => {
    const pts: number[] = [];
    const P = (a: number, b: number) => (run === "ew" ? [a, FLOOR, b] : [b, FLOOR, a]);
    const out = Math.sign(line - (Array.isArray(from) ? from[0]! : from));
    pts.push(...P(along[0]!, line), ...P(along[along.length - 1]!, line));
    along.forEach((a, i) => {
      const f = Array.isArray(from) ? from[i]! : from;
      pts.push(...P(a, f), ...P(a, line + out * OVER)); // extension line
      pts.push(...P(a - TICK, line + TICK), ...P(a + TICK, line - TICK)); // the architect's slash
    });
    segments(pts, 0.6, true);
    labels.forEach((t, i) => {
      const mid = (along[i]! + along[i + 1]!) / 2;
      const off = line + out * 0.19;
      if (run === "ew") text([{ text: t, size: DIM_TEXT }], mid, off, { fade: true });
      else text([{ text: t, size: DIM_TEXT }], off, mid, { rot: Math.PI / 2, fade: true });
    });
  };
  const b = { x0: BOUNDS.x0 / 1000, x1: BOUNDS.x1 / 1000, y0: BOUNDS.y0 / 1000, y1: BOUNDS.y1 / 1000 };
  const gap = 0.15; // extension lines stop this short of the building
  // north: each room along the top, then the whole flat
  chain("ew", [b.x0, 3.15, 6.45, 9.45, b.x1], b.y0 - 0.8, b.y0 - gap, ["3000", "3000", "2700", "5700"]);
  chain("ew", [b.x0, b.x1], b.y0 - 1.5, b.y0 - gap, [`${Math.round((b.x1 - b.x0) * 1000)}`]);
  // west: the master suite, then the whole flat's depth (its foot is the kitchen wing)
  chain("ns", [b.y0, 1.85, 6.0], b.x0 - 0.8, b.x0 - gap, ["1700", "3800"]);
  chain("ns", [b.y0, b.y1], b.x0 - 1.5, [b.x0 - gap, 5.7 - gap], [`${Math.round((b.y1 - b.y0) * 1000)}`]);
  // east: the living room's depth
  chain("ns", [b.y0, 6.5], b.x1 + 0.8, b.x1 + gap, ["6300"]);
  // south: the yard and the kitchen
  chain("ew", [5.7, 7.55, 12.9], b.y1 + 0.8, b.y1 + gap, ["1500", "5000"]);

  // ---- door swings: the arc each leaf sweeps (the leaves themselves stand open in the model)
  const swings: number[] = [];
  for (const d of [...DOORS, FRONT_DOOR]) {
    if (!d.swing) continue;
    const w = d.width / 1000;
    const mid = d.at / 1000;
    const face = d.across / 1000 + d.swing.side * (d.swing.wall / 2000);
    const hinge = d.swing.hinge === "low" ? mid - w / 2 : mid + w / 2;
    const toward = d.swing.hinge === "low" ? 1 : -1; // from the hinge to the other jamb
    const P = (along: number, perp: number) => (d.run === "ew" ? [along, FLOOR, perp] : [perp, FLOOR, along]);
    const STEPS = 24;
    for (let k = 0; k < STEPS; k++) {
      const a0 = (k / STEPS) * (Math.PI / 2);
      const a1 = ((k + 1) / STEPS) * (Math.PI / 2);
      swings.push(
        ...P(hinge + toward * w * Math.sin(a0), face + d.swing.side * w * Math.cos(a0)),
        ...P(hinge + toward * w * Math.sin(a1), face + d.swing.side * w * Math.cos(a1)),
      );
    }
  }
  segments(swings, 0.5, true);

  // ---- windows: the glass, two lines along the middle of the wall at the sill
  const glass: number[] = [];
  for (const wdw of WINDOWS) {
    const half = wdw.width / 2000;
    const y = wdw.bottom / 1000 + 0.002;
    for (const k of [-0.025, 0.025]) {
      const c = wdw.across / 1000 + k;
      const [a0, a1] = [wdw.at / 1000 - half, wdw.at / 1000 + half];
      glass.push(...(wdw.run === "ew" ? [a0, y, c, a1, y, c] : [c, y, a0, c, y, a1]));
    }
  }
  segments(glass, 0.6, false);

  // ---- wardrobes: the plan's cross over each -------------------------------
  const crosses: number[] = [];
  for (const [x0, z0, x1, z1] of WARDROBES) {
    crosses.push(x0, FLOOR, z0, x1, FLOOR, z1, x0, FLOOR, z1, x1, FLOOR, z0);
  }
  segments(crosses, 0.5, true);

  // ---- north point, by the north-east corner --------------------------------
  const [nx, nz, nr] = [b.x1 + 1.75, b.y0 + 0.9, 0.34];
  const ring: number[] = [];
  for (let k = 0; k < 48; k++) {
    const [a0, a1] = [(k / 48) * Math.PI * 2, ((k + 1) / 48) * Math.PI * 2];
    ring.push(nx + nr * Math.cos(a0), FLOOR, nz + nr * Math.sin(a0), nx + nr * Math.cos(a1), FLOOR, nz + nr * Math.sin(a1));
  }
  segments(ring, 0.6, true);
  fill([[nx, nz - nr * 0.92], [nx + nr * 0.38, nz + nr * 0.62], [nx, nz + nr * 0.3]], true);
  segments([nx, FLOOR, nz - nr * 0.92, nx - nr * 0.38, FLOOR, nz + nr * 0.62, nx - nr * 0.38, FLOOR, nz + nr * 0.62, nx, FLOOR, nz + nr * 0.3], 0.6, true);
  text([{ text: "N", size: 0.22 }], nx, nz - nr - 0.26, { fade: true });

  // ---- the title block and a scale bar, below the flat's south-east corner --
  const tx = b.x1 - 2.6;
  text(
    [
      { text: "furnishes.", size: 0.32, weight: 700 },
      { text: "5-ROOM HDB  ·  FLOOR PLAN  ·  1:100", size: 0.16, track: 0.06 },
    ],
    tx,
    b.y1 + 1.7,
    { fade: true },
  );
  const [s0, sz, sh] = [tx - 2.5, b.y1 + 2.5, 0.08];
  for (let m = 0; m < 5; m++) {
    if (m % 2 === 0) fill([[s0 + m, sz], [s0 + m + 1, sz], [s0 + m + 1, sz + sh], [s0 + m, sz + sh]], true);
  }
  segments([s0, FLOOR, sz, s0 + 5, FLOOR, sz, s0, FLOOR, sz + sh, s0 + 5, FLOOR, sz + sh, s0 + 5, FLOOR, sz, s0 + 5, FLOOR, sz + sh], 0.6, true);
  for (const m of [0, 1, 2, 5]) text([{ text: m === 5 ? "5 m" : `${m}`, size: 0.15 }], s0 + m + (m === 5 ? 0.17 : 0), sz + sh + 0.2, { fade: true });

  return {
    /** How much of the flat-drawing notes shows, 0 to 1. */
    fade(t: number) {
      for (const m of fader.mats) m.opacity = t;
      for (const o of fader.objects) o.visible = t > 0.001;
    },
  };
}
