import { AC_LEDGE, BAYS, type Box, COLUMNS, DOORS, DRAWN, NAME_AT, ROOMS, WALL, WINDOWS, type Opening, wallBoxes } from "./flat";
import { planSymbols } from "./symbols";
import styles from "./FloorPlan.module.css";

/** Room on the sheet past the drawing, mm: room for the A/C ledge's label to the east. */
const MARGIN = 450;

const box = ([x0, y0, x1, y1]: Box, fill: string) => (
  <rect key={`${x0} ${y0} ${x1} ${y1}`} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={fill} />
);

/** The box an opening cuts through its wall, a hair past both faces. */
function cut(o: Opening): Box {
  const [a0, a1] = [o.at - o.width / 2, o.at + o.width / 2];
  const [c0, c1] = [o.across - WALL / 2 - 1, o.across + WALL / 2 + 1];
  return o.run === "ew" ? [a0, c0, a1, c1] : [c0, a0, c1, a1];
}

/** A window's two lines of glass, either side of its wall's centre. */
function glass(o: Opening) {
  const [a0, a1] = [o.at - o.width / 2, o.at + o.width / 2];
  return [-25, 25]
    .map((off) => (o.run === "ew" ? `M${a0} ${o.across + off}H${a1}` : `M${o.across + off} ${a0}V${a1}`))
    .join("");
}

/** The parapet round the A/C ledge, open to the living room's wall. */
const LEDGE: Box[] = [
  [AC_LEDGE.x0, AC_LEDGE.y0, AC_LEDGE.x1, AC_LEDGE.y0 + AC_LEDGE.wall],
  [AC_LEDGE.x1 - AC_LEDGE.wall, AC_LEDGE.y0, AC_LEDGE.x1, AC_LEDGE.y1],
  [AC_LEDGE.x0, AC_LEDGE.y1 - AC_LEDGE.wall, AC_LEDGE.x1, AC_LEDGE.y1],
];

/**
 * The showcase flat's floor plan, drawn as SVG: walls solid, cut through at
 * the doors and windows; columns; the bay windows and A/C ledge outside;
 * the furniture and fittings in fine line; and the rooms' names. Its colour
 * is the text colour it sits in.
 */
export function FloorPlan({ className }: { className?: string }) {
  const walls = wallBoxes();
  const symbols = planSymbols();
  const top = -WALL;
  const [x0, y0, x1, y1] = DRAWN;
  return (
    <svg
      className={[styles.plan, className].filter(Boolean).join(" ")}
      viewBox={`${x0 - MARGIN} ${y0 - MARGIN} ${x1 - x0 + 2 * MARGIN} ${y1 - y0 + 2 * MARGIN}`}
      role="img"
      aria-label="Floor plan of a five-room flat: living and dining, kitchen, three bedrooms, two bathrooms, a hall, a shelter and a yard"
    >
      <defs>
        <mask id="plan-walls" maskUnits="userSpaceOnUse" x={x0} y={y0} width={x1 - x0} height={y1 - y0}>
          {walls.fill.map((b) => box(b, "white"))}
          {walls.clear.map((b) => box(b, "black"))}
          {[...DOORS, ...WINDOWS].map((o) => box(cut(o), "black"))}
          {BAYS.map((b) => box([b.x0, top - 1, b.x1, top + WALL + 1], "black"))}
          {COLUMNS.map((b) => box(b, "white"))}
          {LEDGE.map((b) => box(b, "white"))}
        </mask>
      </defs>

      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="currentColor" mask="url(#plan-walls)" />

      <g className={styles.lines}>
        <path className={styles.heavy} d={WINDOWS.map(glass).join("")} />
        {BAYS.map((b) => (
          <g key={b.x0}>
            <path className={styles.heavy} d={`M${b.x0} ${top}V${top - b.depth}H${b.x1}V${top}`} />
            <path className={styles.light} d={`M${b.x0} ${top - b.depth + 50}H${b.x1}`} />
          </g>
        ))}
        <path className={styles.heavy} d={symbols.doors} />
        <path className={styles.fittings} d={symbols.fittings} />
        <path className={styles.furniture} d={symbols.furniture} />
        <path className={styles.light} d={symbols.light} />
      </g>

      <g className={styles.names}>
        {ROOMS.map((r) => {
          const [x, y] = NAME_AT[r.key] ?? [r.x + r.w / 2, r.y + r.d / 2];
          const small = r.w < 2400 || r.d < 1500;
          return (
            <text key={r.key} x={x} y={y} fontSize={small ? 150 : 200}>
              {r.name}
            </text>
          );
        })}
        {symbols.tags.map((t) => (
          <text key={t.text} x={t.x} y={t.y} fontSize={110}>
            {t.text}
          </text>
        ))}
        <text
          x={AC_LEDGE.x1 + 180}
          y={(AC_LEDGE.y0 + AC_LEDGE.y1) / 2}
          fontSize={110}
          transform={`rotate(90 ${AC_LEDGE.x1 + 180} ${(AC_LEDGE.y0 + AC_LEDGE.y1) / 2})`}
        >
          A/C ledge
        </text>
      </g>
    </svg>
  );
}
