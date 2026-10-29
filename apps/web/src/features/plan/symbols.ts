import { DOORS, WALL } from "./flat";

/**
 * The plan's furniture and fittings as an architect draws them: symbols in
 * line, not the tops of boxes (the landing-page branch's symbols.ts, drawn as
 * SVG paths). Places and sizes are in metres, as the old 3D scene had them;
 * the paths come out in millimetres, the plan's unit.
 *
 * Lines come in tiers, heaviest first: the door leaves; fittings built into
 * the flat (the kitchen, bathrooms, wardrobes); furniture; then the lightest
 * marks (rugs, shower falls, door swings). `tags` are the small labels a
 * plan puts on appliances.
 */

const mm = (m: number) => Math.round(m * 1000);

/** A rectangle from (x0, z0) to (x1, z1), its corners rounded by r. */
function rect(x0: number, z0: number, x1: number, z1: number, r = 0) {
  const [a, b, c, d, k] = [x0, z0, x1, z1, r].map(mm) as [number, number, number, number, number];
  if (k <= 0) return `M${a} ${b}H${c}V${d}H${a}Z`;
  const arc = (x: number, y: number) => `A${k} ${k} 0 0 1 ${x} ${y}`;
  return `M${a + k} ${b}H${c - k}${arc(c, b + k)}V${d - k}${arc(c - k, d)}H${a + k}${arc(a, d - k)}V${b + k}${arc(a + k, b)}Z`;
}

/** An ellipse centred on (x, z), radii rx and rz. */
function ellipse(x: number, z: number, rx: number, rz = rx) {
  const [cx, cy, a, b] = [x, z, rx, rz].map(mm) as [number, number, number, number];
  return `M${cx - a} ${cy}A${a} ${b} 0 1 0 ${cx + a} ${cy}A${a} ${b} 0 1 0 ${cx - a} ${cy}Z`;
}

const line = (x0: number, z0: number, x1: number, z1: number) => `M${mm(x0)} ${mm(z0)}L${mm(x1)} ${mm(z1)}`;

/** Wardrobes, [x0, z0, x1, z1] in metres: master bedroom, bedroom 2, bedroom 3. */
const WARDROBES: readonly (readonly [number, number, number, number])[] = [
  [0.05, 5.2, 2.0, 5.79],
  [8.805, 0.25, 9.395, 2.4],
  [3.35, 2.925, 4.95, 3.495],
];

export function planSymbols() {
  const doors: string[] = [];
  const fittings: string[] = [];
  const furniture: string[] = [];
  const light: string[] = [];
  const tags: { text: string; x: number; y: number }[] = [];
  const tag = (text: string, x: number, z: number) => tags.push({ text, x: mm(x), y: mm(z) });

  // ---- bedrooms --------------------------------------------------------------
  /** A bed, head to the north: headboard, pillows, and the sheet turned down over the duvet. */
  const bed = (x0: number, z0: number, x1: number, z1: number) => {
    const w = x1 - x0;
    furniture.push(rect(x0, z0 + 0.06, x1, z1, 0.04), rect(x0 - 0.03, z0, x1 + 0.03, z0 + 0.06));
    const n = w > 1.2 ? 2 : 1;
    const pw = (w - 0.16 - (n - 1) * 0.06) / n;
    for (let i = 0; i < n; i++) {
      const px = x0 + 0.08 + i * (pw + 0.06);
      furniture.push(rect(px, z0 + 0.14, px + pw, z0 + 0.48, 0.07));
    }
    const fold = z0 + 0.62;
    furniture.push(line(x0, fold, x1, fold), line(x0, fold + 0.3, x0 + w * 0.4, fold)); // the corner turned back
  };
  /** A bedside table, with the round base of its lamp. */
  const bedside = (x0: number, z0: number) =>
    furniture.push(rect(x0, z0, x0 + 0.42, z0 + 0.4, 0.03), ellipse(x0 + 0.21, z0 + 0.2, 0.09));
  /** A chair from above: its seat, and the back as a heavier bar on the `backZ` side. */
  const chair = (x: number, z: number, backZ: number) => {
    const s = Math.sign(backZ - z);
    furniture.push(
      rect(x - 0.22, z - 0.22, x + 0.22, z + 0.22, 0.06),
      rect(x - 0.2, backZ - 0.02 * s - 0.02, x + 0.2, backZ - 0.02 * s + 0.02, 0.02),
    );
  };
  bed(0.55, 1.91, 2.15, 4.01); // master
  bedside(0.08, 1.93);
  bedside(2.2, 1.93);
  bed(6.85, 0.05, 7.85, 2.15); // bedroom 2
  bedside(7.9, 0.05);
  bed(3.5, 0.05, 4.5, 2.15); // bedroom 3
  bedside(4.55, 0.05);
  furniture.push(rect(5.0, 0.01, 6.2, 0.61, 0.02)); // bedroom 3: desk
  chair(5.6, 0.85, 1.07);

  // wardrobes: the carcass, its hanging rail along the middle, and hangers on it
  for (const [x0, z0, x1, z1] of WARDROBES) {
    fittings.push(rect(x0, z0, x1, z1));
    if (x1 - x0 > z1 - z0) {
      const zm = (z0 + z1) / 2;
      fittings.push(line(x0 + 0.05, zm, x1 - 0.05, zm));
      for (let x = x0 + 0.2; x < x1 - 0.1; x += 0.22) light.push(line(x - 0.06, zm - 0.2, x + 0.06, zm + 0.2));
    } else {
      const xm = (x0 + x1) / 2;
      fittings.push(line(xm, z0 + 0.05, xm, z1 - 0.05));
      for (let z = z0 + 0.2; z < z1 - 0.1; z += 0.22) light.push(line(xm - 0.2, z - 0.06, xm + 0.2, z + 0.06));
    }
  }

  // ---- living and dining -------------------------------------------------------
  // the sofa, its back to the south: the outline, the back, the arms, three seats
  furniture.push(
    rect(11.25, 3.1, 13.65, 4.0, 0.08),
    line(11.42, 3.8, 13.48, 3.8),
    line(11.42, 3.1, 11.42, 3.8),
    line(13.48, 3.1, 13.48, 3.8),
    ...[12.11, 12.79].map((x) => line(x, 3.14, x, 3.8)),
    rect(11.9, 2.1, 13.0, 2.7, 0.05), // coffee table
    rect(11.65, 0.01, 13.25, 0.43, 0.02), // television console
    rect(11.9, 0.15, 13.0, 0.2), // the television on it
  );
  light.push(rect(11.0, 1.8, 13.9, 4.3), rect(11.06, 1.86, 13.84, 4.24)); // rug
  // the armchair, its back to the east window, and its side table
  furniture.push(
    rect(14.25, 1.9, 15.05, 2.7, 0.08),
    line(14.88, 2.05, 14.88, 2.55),
    line(14.25, 2.05, 14.88, 2.05),
    line(14.25, 2.55, 14.88, 2.55),
    ellipse(14.75, 3.25, 0.22),
    rect(10.2, 4.7, 11.8, 5.6, 0.04), // dining table
  );
  chair(10.6, 4.45, 4.25);
  chair(11.4, 4.45, 4.25);
  chair(10.6, 5.85, 6.05);
  chair(11.4, 5.85, 6.05);
  // the Furnishes bookcase: its 18 mm boards, outside and in
  furniture.push(rect(9.52, 1.2, 9.92, 2.8), rect(9.52, 1.218, 9.92, 2.782));

  // ---- bathrooms ---------------------------------------------------------------
  /** A WC against the wall at `wall`, facing `dir` (1 south, -1 north): cistern, then pan and seat. */
  const wc = (x: number, wall: number, dir: 1 | -1) => {
    const back = wall + dir * 0.18;
    fittings.push(rect(x - 0.2, Math.min(wall, back), x + 0.2, Math.max(wall, back), 0.03), ellipse(x, wall + dir * 0.42, 0.18, 0.25));
    light.push(ellipse(x, wall + dir * 0.44, 0.12, 0.17));
  };
  /** A vanity with its basin and tap. */
  const basin = (x0: number, z0: number, x1: number, z1: number, tapX: number, tapZ: number) => {
    const m = Math.min(x1 - x0, z1 - z0);
    fittings.push(rect(x0, z0, x1, z1), ellipse((x0 + x1) / 2, (z0 + z1) / 2, m * 0.32, m * 0.24));
    light.push(ellipse(tapX, tapZ, 0.025));
  };
  /** A shower: the tray, its falls to the drain drawn corner to corner, and the drain. */
  const shower = (x0: number, z0: number, x1: number, z1: number) => {
    fittings.push(rect(x0, z0, x1, z1), ellipse((x0 + x1) / 2, (z0 + z1) / 2, 0.05));
    light.push(line(x0, z0, x1, z1), line(x0, z1, x1, z0));
  };
  wc(1.3, 0.01, 1); // master bath
  basin(1.75, 0.01, 2.85, 0.5, 2.3, 0.06);
  shower(0.01, 0.21, 0.9, 1.69); // clear of the corner column
  wc(4.2, 6.79, -1); // bathroom
  basin(3.31, 6.0, 3.8, 6.79, 3.36, 6.4);
  shower(4.75, 5.01, 5.69, 6.79);

  // ---- kitchen and yard --------------------------------------------------------
  // counters (an L along the south and east walls), with the line of the
  // wall cabinets above drawn dashed, the sink, the hob, the fridge
  fittings.push(rect(7.95, 8.4, 12.69, 8.99), rect(12.1, 7.0, 12.69, 8.4));
  for (let x = 8.0; x < 12.6; x += 0.3) light.push(line(x, 8.64, Math.min(x + 0.18, 12.69), 8.64));
  fittings.push(rect(11.62, 8.5, 11.98, 8.9, 0.04), rect(12.02, 8.5, 12.38, 8.9, 0.04));
  light.push(ellipse(12.0, 8.94, 0.025));
  fittings.push(rect(9.25, 8.48, 9.95, 8.92, 0.02));
  for (const x of [9.43, 9.77]) for (const z of [8.6, 8.8]) fittings.push(ellipse(x, z, 0.08));
  fittings.push(rect(7.62, 6.52, 8.32, 7.22));
  tag("FR", 7.97, 6.87);
  fittings.push(rect(5.92, 8.36, 6.52, 8.98), ellipse(6.22, 8.67, 0.2));
  tag("WM", 6.22, 8.25);
  // the air-conditioner's condenser on its ledge: its case and fan
  fittings.push(rect(15.5, 0.45, 15.85, 1.15), ellipse(15.675, 0.8, 0.14));

  // ---- door leaves, standing open square to their walls, and their swings ------
  for (const d of DOORS) {
    if (!d.swing) continue;
    const w = d.width / 1000;
    const toward = d.swing.hinge === "low" ? 1 : -1;
    const hinge = d.at / 1000 - (toward * w) / 2;
    const face = (d.across + (d.swing.side * WALL) / 2) / 1000;
    const tip = face + d.swing.side * w;
    // a point at `along` the wall and `out` from it, as [x, z]
    const at = (along: number, out: number): [number, number] => (d.run === "ew" ? [along, out] : [out, along]);
    const [p0, p1] = [at(hinge, face), at(hinge + toward * 0.04, tip)];
    doors.push(rect(Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1])));
    // the swing: a quarter circle from the leaf's tip round to the far jamb
    const [sx, sz] = at(hinge, tip);
    const [ex, ez] = at(hinge + toward * w, face);
    const r = mm(w);
    const sweep = (toward * d.swing.side > 0) === (d.run === "ew") ? 0 : 1;
    light.push(`M${mm(sx)} ${mm(sz)}A${r} ${r} 0 0 ${sweep} ${mm(ex)} ${mm(ez)}`);
  }

  const join = (tier: string[]) => tier.join("");
  return { doors: join(doors), fittings: join(fittings), furniture: join(furniture), light: join(light), tags };
}
