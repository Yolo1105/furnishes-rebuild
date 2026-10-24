import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { BOUNDS, CEILING, DOORS, FRONT_DOOR, OUTER_WALL, ROOMS, WINDOWS, type Opening } from "./flat";
import { BoxSolid } from "./solid";

/**
 * The flat as a drawing you can walk into. One closed solid holds the floor
 * slab and every wall, with the rooms, doorways and windows cut out of it.
 * Faces are paper, gently shaded by the way they face; the solid's inside,
 * seen only where the cut plane slices it, is ink; edges are ink lines.
 * Nothing is lit, so straight down it is exactly a plan on paper.
 *
 * World units are metres: x east, y up, z south (sheet y), so the camera's
 * default -z view looks north, the way the plan is drawn.
 */

export type Palette = { paper: string; ink: string };

const M = 1 / 1000; // sheet millimetres to metres
const SLAB = 0.15; // floor slab depth, m
const PANEL = 0.018; // Furnishes board thickness, m

/** One shade a face, from which way it faces: up is the paper itself. */
const SHADE = { up: 1, x: 0.93, z: 0.87, down: 0.8 };

export function buildFlatScene(palette: Palette) {
  const scene = new THREE.Scene();
  const paper = new THREE.Color(palette.paper);
  const ink = new THREE.Color(palette.ink);
  scene.background = paper;

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
  disposables.push(faceMat, insideMat);

  /** Paper colours on a geometry's vertices, by the way each face faces. */
  const shade = (g: THREE.BufferGeometry) => {
    const n = g.getAttribute("normal");
    const colors = new Float32Array(n.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n.count; i++) {
      const ny = n.getY(i);
      const k =
        ny > 0.5 ? SHADE.up : ny < -0.5 ? SHADE.down : Math.abs(n.getX(i)) > 0.5 ? SHADE.x : SHADE.z;
      c.copy(paper).multiplyScalar(k);
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

  /** A solid object: shaded paper faces, ink inside, ink edges. */
  const solid = (g: THREE.BufferGeometry, width: number) => {
    shade(g);
    disposables.push(g);
    const group = new THREE.Group();
    group.add(new THREE.Mesh(g, faceMat), new THREE.Mesh(g, insideMat), lines(g, width));
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
    shell.sub([r.x * M, 0, r.y * M], [(r.x + r.w) * M, H, (r.y + r.d) * M]);
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
  solid(shell.build(), 1.4);

  // ---- the paper round the flat ------------------------------------------
  const groundGeo = new THREE.PlaneGeometry(400, 400);
  const groundMat = new THREE.MeshBasicMaterial({ color: paper });
  disposables.push(groundGeo, groundMat);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -SLAB - 0.001;
  scene.add(ground);

  // ---- furniture -----------------------------------------------------------
  /** A box from (x0, y0, z0) to (x1, y1, z1), metres. */
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
    const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return g;
  };
  const piece = (...parts: THREE.BufferGeometry[]) => parts.forEach((g) => solid(g, 0.9));

  // living room: the sofa faces the television on the north wall
  piece(
    box(11.25, 0, 3.1, 13.65, 0.42, 4.0), // seat
    box(11.25, 0.42, 3.82, 13.65, 0.82, 4.0), // back
    box(11.25, 0.42, 3.1, 11.42, 0.62, 3.82), // arms
    box(13.48, 0.42, 3.1, 13.65, 0.62, 3.82),
    box(11.9, 0, 2.1, 13.0, 0.4, 2.7), // coffee table
    box(11.0, 0.002, 1.8, 13.9, 0.012, 4.3), // rug
    box(11.65, 0, 0.01, 13.25, 0.5, 0.43), // television console
    box(11.9, 0.62, 0.15, 13.0, 1.25, 0.2), // television
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
  const bx0 = 9.62;
  const bx1 = bx0 + 0.4;
  const [bz0, bz1, bh] = [1.2, 2.8, 1.8];
  piece(
    box(bx0, 0, bz0, bx1, bh, bz0 + PANEL), // side
    box(bx0, 0, bz1 - PANEL, bx1, bh, bz1), // side
    box(bx0, bh - PANEL, bz0, bx1, bh, bz1), // top
    box(bx0, 0.06, bz0, bx1, 0.06 + PANEL, bz1), // bottom
    ...[0.48, 0.9, 1.32].map((y) => box(bx0, y, bz0 + PANEL, bx1, y + PANEL, bz1 - PANEL)), // shelves
  );

  // the other rooms, simply, so the plan reads as a home
  piece(
    box(7.95, 0, 8.4, 12.4, 0.9, 8.99), // kitchen counter
    box(0.7, 0, 2.3, 2.3, 0.5, 4.3), // master: bed
    box(0.7, 0.5, 2.3, 2.3, 1.0, 2.36),
    box(6.85, 0, 0.3, 7.85, 0.45, 2.3), // bedroom 2: bed
    box(3.5, 0, 0.3, 4.5, 0.45, 2.3), // bedroom 3: bed
    box(5.0, 0, 0.01, 6.2, 0.75, 0.61), // bedroom 3: desk
  );

  return { scene, cut, lineMats, disposables };
}

/** Text drawn into a canvas and laid flat on the floor, for room names and the title block. */
export function addLabels(
  scene: THREE.Scene,
  palette: Palette,
  font: string,
  disposables: { dispose(): void }[],
) {
  const PX = 220; // canvas pixels a metre
  const label = (rows: { text: string; size: number; weight?: number }[], x: number, z: number) => {
    const c = document.createElement("canvas");
    const g = c.getContext("2d")!;
    const fonts = rows.map((r) => `${r.weight ?? 400} ${r.size * PX}px ${font}`);
    let w = 0;
    rows.forEach((r, i) => {
      g.font = fonts[i]!;
      w = Math.max(w, g.measureText(r.text).width);
    });
    const lead = rows.map((r) => r.size * PX * 1.6);
    c.width = Math.ceil(w) + 8;
    c.height = Math.ceil(lead.reduce((a, b) => a + b, 0)) + 8;
    g.fillStyle = palette.ink;
    g.textBaseline = "middle";
    let y = 4;
    rows.forEach((r, i) => {
      g.font = fonts[i]!;
      g.fillText(r.text, 4, y + lead[i]! / 2);
      y += lead[i]!;
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const geo = new THREE.PlaneGeometry(c.width / PX, c.height / PX);
    disposables.push(tex, mat, geo);
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.004, z);
    m.renderOrder = 2;
    scene.add(m);
  };

  // where a room's own furniture leaves its floor free for its name
  const at: Record<string, [number, number]> = {
    living: [14.3, 1.2],
    kitchen: [9.0, 7.4],
    master: [1.5, 5.0],
    bedroom2: [7.95, 2.85],
    bedroom3: [5.4, 2.6],
  };
  for (const r of ROOMS) {
    const [x, z] = at[r.key] ?? [(r.x + r.w / 2) / 1000, (r.y + r.d / 2) / 1000];
    const small = r.w < 2000 || r.d < 1500;
    label(
      [
        { text: r.name.toUpperCase(), size: small ? 0.09 : 0.13, weight: 700 },
        { text: `${(r.w / 1000).toFixed(1)} × ${(r.d / 1000).toFixed(1)} m`, size: small ? 0.07 : 0.1 },
      ],
      x,
      z,
    );
  }

  // the title block, on the paper below the flat's south-east corner
  label(
    [
      { text: "furnishes.", size: 0.32, weight: 700 },
      { text: "5-ROOM HDB  ·  GROUND PLAN  ·  1:100", size: 0.13 },
    ],
    (BOUNDS.x1 / 1000) - 4.6,
    (BOUNDS.y1 / 1000) + 1.2,
  );
}
