import { DOORS, FRONT_DOOR } from "./flat";

/**
 * The plan's furniture and fittings as an architect draws them: symbols in
 * line, not the tops of boxes. They stand in for the 3D pieces while the
 * flat is a drawing (scene.ts grows those up out of the floor as the walls
 * rise), so every place and size here mirrors a piece in scene.ts.
 *
 * The door leaves are the building's, drawn from the start; the rest is
 * drawn in once the flat is shown empty. Lines come in tiers, heaviest
 * first: fittings built into the flat (the kitchen, bathrooms, wardrobes),
 * then furniture, then the
 * lightest marks (rugs, shower falls, door swings live in addSheet). Each
 * tier is flat pairs of [x, z] points, metres; `tags` are the small
 * labels a plan puts on appliances.
 */

type Pts = number[];

const CORNER_STEPS = 6;

/** A rectangle from (x0, z0) to (x1, z1), its corners rounded by r. */
function rect(out: Pts, x0: number, z0: number, x1: number, z1: number, r = 0) {
  if (r <= 0) {
    out.push(x0, z0, x1, z0, x1, z0, x1, z1, x1, z1, x0, z1, x0, z1, x0, z0);
    return;
  }
  const corners: [number, number, number][] = [
    [x1 - r, z0 + r, -Math.PI / 2],
    [x1 - r, z1 - r, 0],
    [x0 + r, z1 - r, Math.PI / 2],
    [x0 + r, z0 + r, Math.PI],
  ];
  const ring: [number, number][] = [];
  for (const [cx, cz, a0] of corners) {
    for (let k = 0; k <= CORNER_STEPS; k++) {
      const a = a0 + (k / CORNER_STEPS) * (Math.PI / 2);
      ring.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
    }
  }
  ring.forEach(([x, z], i) => {
    const [nx, nz] = ring[(i + 1) % ring.length]!;
    out.push(x, z, nx, nz);
  });
}

/** An ellipse centred on (x, z), radii rx and rz. */
function ellipse(out: Pts, x: number, z: number, rx: number, rz: number, steps = 32) {
  for (let k = 0; k < steps; k++) {
    const [a0, a1] = [(k / steps) * Math.PI * 2, ((k + 1) / steps) * Math.PI * 2];
    out.push(x + rx * Math.cos(a0), z + rz * Math.sin(a0), x + rx * Math.cos(a1), z + rz * Math.sin(a1));
  }
}

const line = (out: Pts, x0: number, z0: number, x1: number, z1: number) => out.push(x0, z0, x1, z1);

export function planSymbols(wardrobes: readonly (readonly [number, number, number, number])[]) {
  const doors: Pts = [];
  const fittings: Pts = [];
  const furniture: Pts = [];
  const light: Pts = [];
  const tags: { text: string; x: number; z: number }[] = [];

  // ---- bedrooms --------------------------------------------------------------
  /** A bed, head to the north: headboard, pillows, and the sheet turned down over the duvet. */
  const bed = (x0: number, z0: number, x1: number, z1: number) => {
    const w = x1 - x0;
    rect(furniture, x0, z0 + 0.06, x1, z1, 0.04);
    rect(furniture, x0 - 0.03, z0, x1 + 0.03, z0 + 0.06);
    const n = w > 1.2 ? 2 : 1;
    const pw = (w - 0.16 - (n - 1) * 0.06) / n;
    for (let i = 0; i < n; i++) {
      const px = x0 + 0.08 + i * (pw + 0.06);
      rect(furniture, px, z0 + 0.14, px + pw, z0 + 0.48, 0.07);
    }
    const fold = z0 + 0.62;
    line(furniture, x0, fold, x1, fold);
    line(furniture, x0, fold + 0.3, x0 + w * 0.4, fold); // the corner turned back
  };
  /** A bedside table, with the round base of its lamp. */
  const bedside = (x0: number, z0: number) => {
    rect(furniture, x0, z0, x0 + 0.42, z0 + 0.4, 0.03);
    ellipse(furniture, x0 + 0.21, z0 + 0.2, 0.09, 0.09, 20);
  };
  /** A chair from above: its seat, and the back as a heavier bar on the `backZ` side. */
  const chair = (x: number, z: number, backZ: number) => {
    rect(furniture, x - 0.22, z - 0.22, x + 0.22, z + 0.22, 0.06);
    const s = Math.sign(backZ - z);
    rect(furniture, x - 0.2, backZ - 0.02 * s - 0.02, x + 0.2, backZ - 0.02 * s + 0.02, 0.02);
  };
  bed(0.55, 1.91, 2.15, 4.01); // master
  bedside(0.08, 1.93);
  bedside(2.2, 1.93);
  bed(6.85, 0.05, 7.85, 2.15); // bedroom 2
  bedside(7.9, 0.05);
  bed(3.5, 0.05, 4.5, 2.15); // bedroom 3
  bedside(4.55, 0.05);
  rect(furniture, 5.0, 0.01, 6.2, 0.61, 0.02); // bedroom 3: desk
  chair(5.6, 0.85, 1.07);

  // wardrobes: the carcass, its hanging rail along the middle, and hangers on it
  for (const [x0, z0, x1, z1] of wardrobes) {
    rect(fittings, x0, z0, x1, z1);
    const long = x1 - x0 > z1 - z0;
    if (long) {
      const zm = (z0 + z1) / 2;
      line(fittings, x0 + 0.05, zm, x1 - 0.05, zm);
      for (let x = x0 + 0.2; x < x1 - 0.1; x += 0.22) line(light, x - 0.06, zm - 0.2, x + 0.06, zm + 0.2);
    } else {
      const xm = (x0 + x1) / 2;
      line(fittings, xm, z0 + 0.05, xm, z1 - 0.05);
      for (let z = z0 + 0.2; z < z1 - 0.1; z += 0.22) line(light, xm - 0.2, z - 0.06, xm + 0.2, z + 0.06);
    }
  }

  // ---- living and dining -------------------------------------------------------
  // the sofa, its back to the south: the outline, the back, the arms, three seats
  rect(furniture, 11.25, 3.1, 13.65, 4.0, 0.08);
  line(furniture, 11.42, 3.8, 13.48, 3.8);
  line(furniture, 11.42, 3.1, 11.42, 3.8);
  line(furniture, 13.48, 3.1, 13.48, 3.8);
  for (const x of [12.11, 12.79]) line(furniture, x, 3.14, x, 3.8);
  rect(furniture, 11.9, 2.1, 13.0, 2.7, 0.05); // coffee table
  rect(light, 11.0, 1.8, 13.9, 4.3); // rug
  rect(light, 11.06, 1.86, 13.84, 4.24);
  rect(furniture, 11.65, 0.01, 13.25, 0.43, 0.02); // television console
  rect(furniture, 11.9, 0.15, 13.0, 0.2); // the television on it
  // the armchair, its back to the east window, and its side table
  rect(furniture, 14.25, 1.9, 15.05, 2.7, 0.08);
  line(furniture, 14.88, 2.05, 14.88, 2.55);
  line(furniture, 14.25, 2.05, 14.88, 2.05);
  line(furniture, 14.25, 2.55, 14.88, 2.55);
  ellipse(furniture, 14.75, 3.25, 0.22, 0.22);
  rect(furniture, 10.2, 4.7, 11.8, 5.6, 0.04); // dining table
  chair(10.6, 4.45, 4.25);
  chair(11.4, 4.45, 4.25);
  chair(10.6, 5.85, 6.05);
  chair(11.4, 5.85, 6.05);
  // the Furnishes bookcase: its 18 mm boards, outside and in
  rect(furniture, 9.52, 1.2, 9.92, 2.8);
  rect(furniture, 9.52, 1.218, 9.92, 2.782);

  // ---- bathrooms ---------------------------------------------------------------
  /** A WC against the wall at `wall`, facing `dir` (1 south, -1 north): cistern, then pan and seat. */
  const wc = (x: number, wall: number, dir: 1 | -1) => {
    rect(fittings, x - 0.2, Math.min(wall, wall + dir * 0.18), x + 0.2, Math.max(wall, wall + dir * 0.18), 0.03);
    ellipse(fittings, x, wall + dir * 0.42, 0.18, 0.25);
    ellipse(light, x, wall + dir * 0.44, 0.12, 0.17);
  };
  /** A vanity with its basin and tap. */
  const basin = (x0: number, z0: number, x1: number, z1: number, tapAt: [number, number]) => {
    rect(fittings, x0, z0, x1, z1);
    const m = Math.min(x1 - x0, z1 - z0);
    ellipse(fittings, (x0 + x1) / 2, (z0 + z1) / 2, m * 0.32, m * 0.24);
    ellipse(light, tapAt[0], tapAt[1], 0.025, 0.025, 12);
  };
  /** A shower: the tray, its falls to the drain drawn corner to corner, and the drain. */
  const shower = (x0: number, z0: number, x1: number, z1: number) => {
    rect(fittings, x0, z0, x1, z1);
    line(light, x0, z0, x1, z1);
    line(light, x0, z1, x1, z0);
    ellipse(fittings, (x0 + x1) / 2, (z0 + z1) / 2, 0.05, 0.05, 16);
  };
  wc(1.3, 0.01, 1); // master bath
  basin(1.75, 0.01, 2.85, 0.5, [2.3, 0.06]);
  shower(0.01, 0.21, 0.9, 1.69); // clear of the corner column
  wc(4.2, 6.79, -1); // bathroom
  basin(3.31, 6.0, 3.8, 6.79, [3.36, 6.4]);
  shower(4.75, 5.01, 5.69, 6.79);

  // ---- kitchen and yard --------------------------------------------------------
  // counters (an L along the south and east walls), with the line of the
  // wall cabinets above drawn dashed, the sink, the hob, the fridge
  rect(fittings, 7.95, 8.4, 12.69, 8.99);
  rect(fittings, 12.1, 7.0, 12.69, 8.4);
  for (let x = 8.0; x < 12.6; x += 0.3) line(light, x, 8.64, Math.min(x + 0.18, 12.69), 8.64);
  rect(fittings, 11.62, 8.5, 11.98, 8.9, 0.04);
  rect(fittings, 12.02, 8.5, 12.38, 8.9, 0.04);
  ellipse(light, 12.0, 8.94, 0.025, 0.025, 12);
  rect(fittings, 9.25, 8.48, 9.95, 8.92, 0.02);
  for (const x of [9.43, 9.77]) for (const z of [8.6, 8.8]) ellipse(fittings, x, z, 0.08, 0.08, 20);
  rect(fittings, 7.62, 6.52, 8.32, 7.22);
  tags.push({ text: "FR", x: 7.97, z: 6.87 });
  rect(fittings, 5.92, 8.36, 6.52, 8.98);
  ellipse(fittings, 6.22, 8.67, 0.2, 0.2);
  tags.push({ text: "WM", x: 6.22, z: 8.25 });
  // the air-conditioner's condenser on its ledge: its case and fan
  rect(fittings, 15.5, 0.45, 15.85, 1.15);
  ellipse(fittings, 15.675, 0.8, 0.14, 0.14, 24);

  // ---- door leaves, standing open square to their walls --------------------------
  for (const d of [...DOORS, FRONT_DOOR]) {
    if (!d.swing) continue;
    const w = d.width / 1000;
    const hinge = d.at / 1000 + (d.swing.hinge === "low" ? -w / 2 : w / 2);
    const toward = d.swing.hinge === "low" ? 1 : -1;
    const face = d.across / 1000 + (d.swing.side * d.swing.wall) / 2000;
    const along = [hinge, hinge + toward * 0.04].sort((p, q) => p - q) as [number, number];
    const perp = [face, face + d.swing.side * w].sort((p, q) => p - q) as [number, number];
    if (d.run === "ew") rect(doors, along[0], perp[0], along[1], perp[1]);
    else rect(doors, perp[0], along[0], perp[1], along[1]);
  }

  return { doors, fittings, furniture, light, tags };
}
