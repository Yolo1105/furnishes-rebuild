import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import {
  AC_LEDGE,
  type Box,
  BAYS,
  BOUNDS_M,
  CEILING,
  COLUMNS,
  DOOR_HEAD,
  DOORS,
  floorOf,
  FRONT_DOOR,
  OUTER_WALL,
  ROOMS,
  SHELTER_DOOR,
  SHELTER_WALL,
  wallBoxes,
  WINDOWS,
  type Opening,
} from "./flat";
import { smooth, stage } from "./ease";
import { FINISH } from "./finishes";
import { BoxSolid } from "./solid";
import { planSymbols } from "./symbols";

/**
 * The flat as a drawing you can walk into. One closed solid holds the floor
 * slab and every wall, with the rooms, doorways and windows cut out of it.
 * Faces are paper, gently shaded by the way they face; the solid's inside,
 * seen only where the cut plane slices it, is ink; edges are ink lines.
 * Nothing is lit, so straight down it is exactly a plan. The scene has no
 * background or ground of its own: it is drawn over the page's moving wash.
 *
 * Later in the walk the drawing comes to life, and `later` drives it: the
 * bookcase is taken apart and built again board by board, real materials
 * sweep out across the flat from the bookcase, and the living room's
 * furniture moves to a second layout.
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
  [8.805, 0.25, 9.395, 2.4], // bedroom 2, clear of the column
  [3.35, 2.925, 4.95, 3.495], // bedroom 3
];

/** A clipping plane's constant far enough off to clip nothing, m. */
const OPEN = 1e4;

/** One shade a face, from which way it faces: up is the paper itself. */
const SHADE = { up: 1, x: 0.93, z: 0.87, down: 0.8 };

/** Where the materials sweep out from: the bookcase, m on the floor (x, z). */
const SWEEP_FROM = new THREE.Vector2(9.72, 2.0);

/**
 * `floors` false leaves the floors unfilled, so the page shows through
 * them: the shell is drawn without its floor's top, nor the slab's
 * underside that would show, as the cut shows it, through the gap.
 */
export function buildFlatScene(palette: Palette, { floors = true }: { floors?: boolean } = {}) {
  const scene = new THREE.Scene();
  const paper = new THREE.Color(palette.paper);
  const ink = new THREE.Color(palette.ink);

  /** Everything is cut by this plane: it keeps what lies below its height. */
  const cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.2);
  /**
   * And by these four, a box on the floor that keeps what lies inside it:
   * wide open, unless `reveal` closes it round one room to show that alone.
   */
  const roomBox = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), OPEN),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), OPEN),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), OPEN),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), OPEN),
  ];
  /** One shared list, so every material follows the planes as they move. */
  const clipping = [cut, ...roomBox];
  const lineMats: LineMaterial[] = [];
  const disposables: { dispose(): void }[] = [];

  const faceMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    clippingPlanes: clipping,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  // Each vertex also carries its finished colour; a face shows it where the
  // sweep, a circle growing out across the floor from the bookcase, has reached.
  const sweep = { value: -1 };
  faceMat.onBeforeCompile = (shader) => {
    shader.uniforms.uSweep = sweep;
    shader.uniforms.uFrom = { value: SWEEP_FROM };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec3 finish;\nvarying vec3 vFinish;\nvarying vec2 vFloor;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvFinish = finish;\nvFloor = (modelMatrix * vec4(transformed, 1.0)).xz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float uSweep;\nuniform vec2 uFrom;\nvarying vec3 vFinish;\nvarying vec2 vFloor;",
      )
      .replace(
        "#include <color_fragment>",
        "#include <color_fragment>\ndiffuseColor.rgb = mix(vFinish, diffuseColor.rgb, smoothstep(uSweep - 0.35, uSweep, distance(vFloor, uFrom)));",
      );
  };
  // Pushed back as far as the faces, so a thin piece's paper top always wins
  // over its own inside; only the lines sit in front.
  const insideMat = new THREE.MeshBasicMaterial({
    color: ink,
    side: THREE.BackSide,
    clippingPlanes: clipping,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  // A cut piece of furniture is not poché: only the building's walls are.
  const pieceInsideMat = insideMat.clone();
  pieceInsideMat.color.copy(paper);
  pieceInsideMat.clippingPlanes = clipping; // a clone has copies of the planes, which would not move
  disposables.push(faceMat, insideMat, pieceInsideMat);

  /** What a face is made of: a colour, or one picked by which way the face looks and how high it is. */
  type Finish = string | ((ny: number, y: number) => string | null) | null;

  /**
   * Paper colours on a geometry's vertices, by the way each face faces (up
   * faces at or over `inkFrom` m are ink, as the cut shows them), and the
   * finished colours the sweep turns them to, shaded the same way.
   */
  const shade = (g: THREE.BufferGeometry, inkFrom = Infinity, finish: Finish = null) => {
    const n = g.getAttribute("normal");
    const p = g.getAttribute("position");
    const colors = new Float32Array(n.count * 3);
    const finished = new Float32Array(n.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n.count; i++) {
      const ny = n.getY(i);
      const k =
        ny > 0.5 ? SHADE.up : ny < -0.5 ? SHADE.down : Math.abs(n.getX(i)) > 0.5 ? SHADE.x : SHADE.z;
      const inked = ny > 0.5 && p.getY(i) >= inkFrom;
      if (inked) c.copy(ink);
      else c.copy(paper).multiplyScalar(k);
      colors.set([c.r, c.g, c.b], i * 3);
      const f = typeof finish === "function" ? finish(ny, p.getY(i)) : finish;
      if (f && !inked) c.set(f).multiplyScalar(k);
      finished.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.setAttribute("finish", new THREE.BufferAttribute(finished, 3));
    return g;
  };

  const lines = (g: THREE.BufferGeometry, width: number) => {
    const edges = new THREE.EdgesGeometry(g, 20);
    const lg = new LineSegmentsGeometry().setPositions(edges.attributes.position!.array as Float32Array);
    edges.dispose();
    const mat = new LineMaterial({ color: ink, linewidth: width, worldUnits: false, clippingPlanes: clipping });
    lineMats.push(mat);
    disposables.push(lg, mat);
    return new LineSegments2(lg, mat);
  };

  /**
   * The triangles of a (non-indexed) geometry but those `drop` picks, by
   * their normal's y, their height and their middle on the ground (x, z).
   */
  const keep = (g: THREE.BufferGeometry, drop: (ny: number, y: number, x: number, z: number) => boolean) => {
    const [n, p] = [g.getAttribute("normal"), g.getAttribute("position")];
    const mid = (i: number, get: (v: number) => number) => (get(i) + get(i + 1) + get(i + 2)) / 3;
    const kept = new THREE.BufferGeometry();
    for (const name of Object.keys(g.attributes)) {
      const a = g.getAttribute(name);
      const out: number[] = [];
      for (let i = 0; i < n.count; i += 3) {
        if (drop(n.getY(i), p.getY(i), mid(i, (v) => p.getX(v)), mid(i, (v) => p.getZ(v)))) continue;
        for (let v = i; v < i + 3; v++) for (let k = 0; k < a.itemSize; k++) out.push(a.array[v * a.itemSize + k]!);
      }
      kept.setAttribute(name, new THREE.Float32BufferAttribute(out, a.itemSize));
    }
    disposables.push(kept);
    return kept;
  };

  /**
   * A solid object: shaded paper faces, its inside, ink edges. `open`, the
   * boxes (m, on the ground) where its floor is left unfilled: the faces
   * without the floor's top (up, at 0), the inside without the slab's
   * underside inside them; under the walls the underside stays, the poché
   * the cut shows.
   */
  const solid = (
    g: THREE.BufferGeometry,
    width: number,
    inside: THREE.Material,
    {
      inkFrom,
      finish = null,
      into = scene,
      open = null,
    }: { inkFrom?: number; finish?: Finish; into?: THREE.Object3D; open?: readonly Box[] | null } = {},
  ) => {
    shade(g, inkFrom, finish);
    disposables.push(g);
    const under = (x: number, z: number) => open!.some(([x0, z0, x1, z1]) => x > x0 && x < x1 && z > z0 && z < z1);
    const faces = open ? keep(g, (ny, y) => ny > 0.5 && Math.abs(y) < 0.01) : g;
    const back = open ? keep(g, (ny, _y, x, z) => ny < -0.5 && under(x, z)) : g;
    const group = new THREE.Group();
    group.add(new THREE.Mesh(faces, faceMat), new THREE.Mesh(back, inside), lines(g, width));
    into.add(group);
    return group;
  };

  // ---- the shell -----------------------------------------------------------
  const shell = new BoxSolid();
  const H = CEILING * M;
  const { add, clear, trim } = wallBoxes();
  for (const [x0, y0, x1, y1] of add) shell.add([x0 * M, -SLAB, y0 * M], [x1 * M, H, y1 * M]);
  for (const [x0, y0, x1, y1] of clear) shell.sub([x0 * M, 0, y0 * M], [x1 * M, H, y1 * M]);
  for (const [x0, y0, x1, y1] of trim) shell.sub([x0 * M, -SLAB - 0.01, y0 * M], [x1 * M, H, y1 * M]);
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

  // ---- what makes it an HDB flat --------------------------------------------
  // columns, full height
  for (const [x0, y0, x1, y1] of COLUMNS) shell.add([x0 * M, -SLAB, y0 * M], [x1 * M, H, y1 * M]);
  // the household shelter's walls, thickened inwards by SHELTER_WALL if it is set; its door cut through again
  const shelter = floorOf(ROOMS.find((r) => r.key === "shelter")!);
  const [sx0, sz0, sx1, sz1] = [shelter.x0 * M, shelter.y0 * M, shelter.x1 * M, shelter.y1 * M];
  const st = SHELTER_WALL * M;
  if (st > 0) {
    shell.add([sx0, 0, sz0], [sx1, H, sz0 + st]);
    shell.add([sx0, 0, sz1 - st], [sx1, H, sz1]);
    shell.add([sx0, 0, sz0], [sx0 + st, H, sz1]);
    shell.add([sx1 - st, 0, sz0], [sx1, H, sz1]);
    hole(SHELTER_DOOR);
  }
  // bay windows: a box standing out from the north wall, open to the room
  // from sill to head, a seat ledge below, glazed across its outer face
  const face = -OUTER_WALL * M; // the north wall's outer face
  for (const b of BAYS) {
    const [x0, x1, sill, head, d] = [b.x0 * M, b.x1 * M, b.sill * M, b.head * M, b.depth * M];
    const cheek = 0.1;
    shell.add([x0 - cheek, -SLAB, face - d], [x1 + cheek, H, face]);
    shell.sub([x0, sill, face - d + cheek], [x1, head, 0.01]);
    shell.sub([x0 + 0.05, sill + 0.05, face - d - 0.01], [x1 - 0.05, head - 0.05, face - d + cheek + 0.01]);
  }
  // the air-conditioner ledge: a slab outside the living room, behind a parapet
  {
    const { x0, y0, x1, y1, parapet, wall } = AC_LEDGE;
    const [lx0, lz0, lx1, lz1, ph, pw] = [x0 * M, y0 * M, x1 * M, y1 * M, parapet * M, wall * M];
    shell.add([lx0, -SLAB, lz0], [lx1, 0, lz1]);
    shell.add([lx1 - pw, 0, lz0], [lx1, ph, lz1]);
    shell.add([lx0, 0, lz0], [lx1, ph, lz0 + pw]);
    shell.add([lx0, 0, lz1 - pw], [lx1, ph, lz1]);
  }
  // the walls' tops are ink, so once the cut clears them they read as it did
  solid(shell.build(), 1.2, insideMat, {
    inkFrom: H - 0.001,
    // the floor is oak and the walls plaster; the slab's edges stay paper
    finish: (ny, y) => (ny > 0.5 && Math.abs(y) < 0.01 ? FINISH.floor : Math.abs(ny) < 0.5 && y > -0.01 ? FINISH.wall : null),
    // unfilled: every room's clear floor, the A/C ledge's, and every doorway's through its wall
    open: floors
      ? null
      : [
          ...clear.map(([x0, y0, x1, y1]): Box => [x0 * M, y0 * M, x1 * M, y1 * M]),
          [AC_LEDGE.x0 * M, AC_LEDGE.y0 * M, AC_LEDGE.x1 * M, AC_LEDGE.y1 * M],
          ...[...DOORS, FRONT_DOOR].map((op): Box => {
            const [a0, a1, c0, c1] = [(op.at - op.width / 2) * M, (op.at + op.width / 2) * M, op.across * M - 0.25, op.across * M + 0.25];
            return op.run === "ew" ? [a0, c0, a1, c1] : [c0, a0, c1, a1];
          }),
        ],
  });

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
  /** Every piece of furniture and fitting, so they can rise out of the floor together. */
  const pieces: THREE.Group[] = [];
  /** Pieces made of `finish`, put `into` a group (the scene by default). */
  const made = (finish: Finish, into: THREE.Object3D, ...parts: THREE.BufferGeometry[]) => {
    const groups = parts.map((g) => solid(g, 0.6, pieceInsideMat, { finish, into }));
    pieces.push(...groups);
    return groups;
  };
  const piece = (...parts: THREE.BufferGeometry[]) => made(null, scene, ...parts);

  /**
   * A set of furniture that can move to a second layout: its pieces turn
   * `turn` radians about `pivot` (x, z) and shift by `shift` (x, z).
   */
  const set = (pivot: [number, number], turn: number, shift: [number, number]) => {
    const outer = new THREE.Group();
    const inner = new THREE.Group();
    outer.position.set(pivot[0], 0, pivot[1]);
    inner.position.set(-pivot[0], 0, -pivot[1]);
    outer.add(inner);
    scene.add(outer);
    return {
      into: inner,
      /** 0 for the first layout, 1 for the second. */
      at(t: number) {
        outer.rotation.y = turn * t;
        outer.position.set(pivot[0] + shift[0] * t, 0, pivot[1] + shift[1] * t);
      },
    };
  };

  // living room: the sofa faces the television on the north wall; in the
  // second layout it turns to face the bookcase, and the dining table turns
  // lengthways by the west wall
  const lounge = set([12.45, 3.05], Math.PI / 2, [0, 0]);
  made(
    FINISH.moss,
    lounge.into,
    box(11.25, 0, 3.1, 13.65, 0.4, 4.0), // base
    box(11.25, 0.4, 3.8, 13.65, 0.82, 4.0), // back
    box(11.25, 0.4, 3.1, 11.42, 0.62, 3.8), // arms
    box(13.48, 0.4, 3.1, 13.65, 0.62, 3.8),
  );
  made(FINISH.mossLight, lounge.into, ...[0, 1, 2].map((i) => box(11.43 + i * 0.68, 0.4, 3.12, 11.43 + (i + 1) * 0.68 - 0.02, 0.46, 3.8))); // seat cushions
  made(FINISH.walnut, lounge.into, box(11.9, 0, 2.1, 13.0, 0.4, 2.7)); // coffee table
  made(FINISH.wool, lounge.into, box(11.0, 0.002, 1.8, 13.9, 0.012, 4.3)); // rug
  made(FINISH.oak, scene, box(11.65, 0, 0.01, 13.25, 0.5, 0.43)); // television console
  made(FINISH.screen, scene, box(11.9, 0.62, 0.15, 13.0, 1.25, 0.2)); // television
  // an armchair by the east window, turned to the room, and its side table
  made(
    FINISH.rust,
    scene,
    box(14.25, 0, 1.9, 15.05, 0.4, 2.7),
    box(14.88, 0.4, 1.9, 15.05, 0.8, 2.7),
    box(14.25, 0.4, 1.9, 14.88, 0.6, 2.05),
    box(14.25, 0.4, 2.55, 14.88, 0.6, 2.7),
  );
  made(FINISH.walnut, scene, disc(14.75, 3.25, 0.22, 0.22, 0, 0.55));

  // dining: a table and four chairs by the kitchen
  const dining = set([11.0, 5.15], Math.PI / 2, [-0.2, 0]);
  const table = (x0: number, z0: number, x1: number, z1: number) => {
    const l = 0.05;
    made(
      FINISH.oak,
      dining.into,
      box(x0, 0.71, z0, x1, 0.75, z1),
      box(x0, 0, z0, x0 + l, 0.71, z0 + l),
      box(x1 - l, 0, z0, x1, 0.71, z0 + l),
      box(x0, 0, z1 - l, x0 + l, 0.71, z1),
      box(x1 - l, 0, z1 - l, x1, 0.71, z1),
    );
  };
  table(10.2, 4.7, 11.8, 5.6);
  const chair = (x: number, z: number, backZ: number, finish: Finish = null, into: THREE.Object3D = scene) =>
    made(finish, into, box(x - 0.22, 0, z - 0.22, x + 0.22, 0.45, z + 0.22), box(x - 0.22, 0.45, backZ - 0.02, x + 0.22, 0.9, backZ + 0.02));
  chair(10.6, 4.45, 4.25, FINISH.walnut, dining.into);
  chair(11.4, 4.45, 4.25, FINISH.walnut, dining.into);
  chair(10.6, 5.85, 6.05, FINISH.walnut, dining.into);
  chair(11.4, 5.85, 6.05, FINISH.walnut, dining.into);

  // the Furnishes bookcase on the living room's west wall: real 18 mm boards,
  // each its own piece so it can be built board by board
  const bx0 = 9.52;
  const bx1 = bx0 + 0.4;
  const [bz0, bz1, bh] = [1.2, 2.8, 1.8];
  const boards = made(
    FINISH.furnishes,
    scene,
    box(bx0, 0.06, bz0, bx1, 0.06 + PANEL, bz1), // bottom
    box(bx0, 0, bz0, bx1, bh, bz0 + PANEL), // side
    box(bx0, 0, bz1 - PANEL, bx1, bh, bz1), // side
    ...[0.48, 0.9, 1.32].map((y) => box(bx0, y, bz0 + PANEL, bx1, y + PANEL, bz1 - PANEL)), // shelves
    box(bx0, bh - PANEL, bz0, bx1, bh, bz1), // top
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
  bed(0.55, 1.91, 2.15, 4.01); // master
  bedside(0.08, 1.93);
  bedside(2.2, 1.93);
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
  shower(0.01, 0.21, 0.9, 1.69); // clear of the corner column
  wc(4.2, 6.79, -1); // bathroom
  basin(3.31, 6.0, 3.8, 6.79);
  shower(4.75, 5.01, 5.69, 6.79);

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
    box(7.62, 0, 6.52, 8.32, 1.8, 7.22), // fridge
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

  // the air-conditioner's condenser, out on its ledge
  piece(box(15.5, 0, 0.45, 15.85, 0.6, 1.15));

  // the yard: a washing machine in its corner
  piece(box(5.92, 0, 8.36, 6.52, 0.85, 8.98), disc(6.22, 8.67, 0.2, 0.2, 0.85, 0.856));


  /**
   * The furniture and fittings standing up out of the floor, 0 (flat and
   * hidden: the plan draws them as symbols) to 1 (full height).
   */
  const rise = (t: number) => {
    for (const p of pieces) {
      p.visible = t > 0.001;
      p.scale.y = Math.max(t, 0.001);
    }
  };

  const later = {
    /**
     * The bookcase taken apart and built again, 0 to 1: its boards all lift
     * out into the room together, then go back one at a time, bottom first,
     * each on a little arc.
     */
    build(t: number) {
      const out = smooth(stage(t, 0, 0.22));
      boards.forEach((board, i) => {
        const back = smooth(stage(t, 0.3 + i * 0.085, 0.42 + i * 0.085));
        const away = out * (1 - back);
        board.position.set(away * (0.9 + i * 0.16), away * 0.12 + Math.sin(Math.PI * back) * 0.18 * out, 0);
      });
    },
    /** How far the materials have swept out from the bookcase, 0 (none) to 1 (the whole flat). */
    sweep(t: number) {
      sweep.value = t <= 0 ? -1 : t * 20;
    },
    /** The living room's furniture, 0 in its first layout, 1 in its second. */
    layout(t: number) {
      lounge.at(t);
      dining.at(t);
    },
  };

  /**
   * Show one room alone, or the flat round it: 0 keeps only the box `room`
   * ([x0, z0, x1, z1], m), 1 the whole flat; between, the box grows out from
   * the room to the flat's bounds, and past them.
   */
  const reveal = (room: readonly [number, number, number, number], t: number) => {
    if (t >= 1) {
      for (const p of roomBox) p.constant = OPEN;
      return;
    }
    const all = [BOUNDS_M.x0 - 4, BOUNDS_M.y0 - 4, BOUNDS_M.x1 + 4, BOUNDS_M.y1 + 4];
    const [x0, z0, x1, z1] = room.map((v, i) => v + (all[i]! - v) * t) as [number, number, number, number];
    roomBox[0]!.constant = -x0;
    roomBox[1]!.constant = x1;
    roomBox[2]!.constant = -z0;
    roomBox[3]!.constant = z1;
  };

  return { scene, cut, roomBox, lineMats, disposables, rise, later, reveal };
}

/** A line material and the objects that use it, so the plan's notes can fade. */
type Fader = { mats: { opacity: number }[]; objects: THREE.Object3D[] };

/**
 * What an architect adds to a plan that is not the building: room names,
 * tile joints, door swings, window glass, the furniture and fittings drawn
 * as symbols (symbols.ts, drawn in across the plan by `furnishTo`), and the
 * metre grid on the ground. All of it lies on the floor or the ground. The
 * notes that only make sense on a flat drawing fade as the walls rise; room
 * names, tiles, window glass and the ground grid stay.
 * `lineMats` collects the line materials so the caller can size them;
 * `grid` false leaves out the ground's metre grid.
 */
export function addSheet(
  scene: THREE.Scene,
  palette: Palette,
  font: string,
  disposables: { dispose(): void }[],
  lineMats: LineMaterial[],
  box: THREE.Plane[] = [],
  grid = true,
) {
  const PX = 220; // canvas pixels a metre
  const FLOOR = 0.003; // notes lie this far over the floor, m
  const fader: Fader = { mats: [], objects: [] };
  const ink = new THREE.Color(palette.ink);
  // The drawing's tiers of line, heaviest first: the walls (drawn by the
  // model), fittings in ink, furniture lighter, and the faintest marks.
  const furnitureInk = new THREE.Color(palette.paper).lerp(ink, 0.55);
  const lightInk = new THREE.Color(palette.paper).lerp(ink, 0.32);
  /** The tile joints' colour: ink barely on paper. */
  const faint = new THREE.Color(palette.paper).lerp(ink, 0.14);

  const keep = (o: THREE.Object3D, mat: { opacity: number }, fade: boolean) => {
    scene.add(o);
    if (fade) {
      fader.mats.push(mat);
      fader.objects.push(o);
    }
  };

  // The furniture and fittings are drawn in across the plan, west to east,
  // as the opening goes (`furnishTo`): they are cut away east of this plane.
  const drawnTo = new THREE.Plane(new THREE.Vector3(-1, 0, 0), BOUNDS_M.x0 - 1);
  /**
   * What is drawn next is clipped by the scene's room box (`box`, so the
   * notes show only where the flat does) and by `clip`, set while the
   * furniture is drawn; the ground grid, drawn with `grounded`, by neither.
   */
  let clip: THREE.Plane[] = [];
  let grounded = false;
  const planes = () => (grounded ? [] : [...box, ...clip]);

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
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, clippingPlanes: planes() });
    const geo = new THREE.PlaneGeometry(c.width / PX, c.height / PX);
    disposables.push(tex, mat, geo);
    const m = new THREE.Mesh(geo, mat);
    m.rotation.set(-Math.PI / 2, 0, rot);
    m.position.set(x, y, z);
    m.renderOrder = 2;
    keep(m, mat, fade);
  };

  /** Line segments, as flat pairs of [x, y, z] points. */
  const segments = (points: number[], width: number, fade: boolean, color: THREE.Color = ink, opacity = 1) => {
    const geo = new LineSegmentsGeometry().setPositions(points);
    const mat = new LineMaterial({
      color,
      linewidth: width,
      worldUnits: false,
      transparent: fade || opacity < 1,
      opacity,
      clippingPlanes: planes(),
    });
    lineMats.push(mat);
    disposables.push(geo, mat);
    keep(new LineSegments2(geo, mat), mat, fade);
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

  // ---- room names ----------------------------------------------------------
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
    text([{ text: r.name.toUpperCase(), size: small ? 0.15 : 0.2, track: 0.08 }], x, z, { y: LABEL_Y });
  }
  // the air-conditioner ledge, named along its outer side
  text([{ text: "A/C LEDGE", size: 0.11, track: 0.08 }], AC_LEDGE.x1 / 1000 + 0.18, (AC_LEDGE.y0 + AC_LEDGE.y1) / 2000, {
    rot: -Math.PI / 2,
    fade: true,
  });

  // the flat's outer bounds, m
  const b = BOUNDS_M;

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
  segments(swings, 0.5, true, lightInk);

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
  // a bay's glazing runs across its outer face, at its sill
  for (const bay of BAYS) {
    const z = (-OUTER_WALL - bay.depth + 50) / 1000;
    const [a0, a1, y] = [(bay.x0 + 50) / 1000, (bay.x1 - 50) / 1000, bay.sill / 1000 + 0.002];
    for (const k of [-0.025, 0.025]) glass.push(a0, y, z + k, a1, y, z + k);
  }
  segments(glass, 0.6, false);

  // ---- furniture and fittings, as the plan draws them --------------------------
  // (the 3D pieces stay down until the walls start to rise: see `rise`)
  const symbols = planSymbols(WARDROBES);
  const onFloor = (pts: number[]) => pts.flatMap((v, i) => (i % 2 ? [] : [v, FLOOR * 2, pts[i + 1]!]));
  segments(onFloor(symbols.doors), 0.9, true);
  clip = [drawnTo];
  segments(onFloor(symbols.fittings), 0.9, true);
  segments(onFloor(symbols.furniture), 0.7, true, furnitureInk);
  segments(onFloor(symbols.light), 0.5, true, lightInk);
  for (const t of symbols.tags) text([{ text: t.text, size: 0.11, track: 0.08 }], t.x, t.z, { fade: true });
  clip = [];

  // ---- the drafting grid: a metre grid on the ground the flat stands on ----
  // It thins out away from the flat, in rings, and stays once the walls rise.
  const GROUND = -SLAB - 0.001;
  const RINGS = [
    { out: 4, opacity: 0.16 },
    { out: 10, opacity: 0.1 },
    { out: 18, opacity: 0.05 },
  ];
  const reach = RINGS[RINGS.length - 1]!.out;
  /** How far a point lies outside the flat's bounds, m. */
  const away = (x: number, z: number) => Math.hypot(Math.max(b.x0 - x, 0, x - b.x1), Math.max(b.y0 - z, 0, z - b.y1));
  const rings = RINGS.map(() => [] as number[]);
  const [gx0, gx1] = [Math.floor(b.x0 - reach), Math.ceil(b.x1 + reach)];
  const [gz0, gz1] = [Math.floor(b.y0 - reach), Math.ceil(b.y1 + reach)];
  const put = (x0: number, z0: number, x1: number, z1: number) => {
    const ring = RINGS.findIndex((r) => away((x0 + x1) / 2, (z0 + z1) / 2) < r.out);
    if (ring >= 0) rings[ring]!.push(x0, GROUND, z0, x1, GROUND, z1);
  };
  if (grid) {
    for (let x = gx0; x <= gx1; x++) for (let z = gz0; z < gz1; z++) put(x, z, x, z + 1);
    for (let z = gz0; z <= gz1; z++) for (let x = gx0; x < gx1; x++) put(x, z, x + 1, z);
    grounded = true;
    rings.forEach((pts, i) => segments(pts, 0.6, false, ink, RINGS[i]!.opacity));
    grounded = false;
  }

  return {
    /** How much of the flat-drawing notes shows, 0 to 1. */
    fade(t: number) {
      for (const m of fader.mats) m.opacity = t;
      for (const o of fader.objects) o.visible = t > 0.001;
    },
    /** How far across the plan the furniture and fittings are drawn: as far east as x, metres (none until then). */
    furnishTo(x: number) {
      drawnTo.constant = x;
    },
  };
}
