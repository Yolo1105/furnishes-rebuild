import type { CSSProperties, ReactNode } from "react";
import { AC_LEDGE, BAYS, type Box, COLUMNS, DOORS, DRAWN, NAME_AT, ROOMS, WALL, WINDOWS, type Opening, wallBoxes } from "./flat";
import { planSymbols } from "./symbols";
import styles from "./FloorPlan.module.css";

/** Room on the sheet past the drawing, mm: a hair on three sides, more to the east for the A/C ledge's label. */
const MARGIN = 40;
const MARGIN_EAST = 250;

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

/** Where the drawing starts on arrival, mm: the front door, the rest spreading out from it. */
const ENTRANCE: readonly [number, number] = [14050, 6350];
const FARTHEST = Math.hypot(ENTRANCE[0] - DRAWN[0], ENTRANCE[1] - DRAWN[1]);

/**
 * When each tier starts drawing on arrival, and over how long it spreads
 * from the front door to the far corner, seconds from the plan's start:
 * the walls traced, then filled, the glass, the doors and their swings, the
 * fittings, the furniture, the faint marks, then the names typed in.
 */
const DRAW = {
  outline: [0, 0.7],
  glass: [1.1, 0.4],
  doors: [1.5, 0.4],
  swings: [1.65, 0.4],
  fittings: [1.8, 0.5],
  furniture: [2.0, 0.5],
  light: [2.4, 0.3],
  names: [2.5, 0.3],
} as const;

/** How far a point is from the front door, 0 to 1. */
const far = (x: number, y: number) => Math.hypot(x - ENTRANCE[0], y - ENTRANCE[1]) / FARTHEST;

/** A piece's start on arrival, from its tier and where its path begins. */
function at(tier: keyof typeof DRAW, d: string) {
  const [x = 0, y = 0] = d.slice(1).split(/[ A-Z]/, 2).map(Number);
  const [from, spread] = DRAW[tier];
  return { "--at": `${(from + far(x, y) * spread).toFixed(2)}s` } as CSSProperties;
}

/** A tier's pieces, each its own path so each draws in on its own. */
const pieces = (tier: keyof typeof DRAW, list: readonly string[], className?: string) =>
  list.map((d, i) => <path key={i} className={className} d={d} pathLength={1} style={at(tier, d)} />);

/** A name's start on arrival, and its letters, for it to be typed in one at a time. */
const typed = (text: string, x: number, y: number) =>
  ({ "--at": `${(DRAW.names[0] + far(x, y) * DRAW.names[1]).toFixed(2)}s`, "--chars": text.length }) as CSSProperties;

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
 *
 * While the page's arrival plays (`data-intro="play"` on the root), it draws
 * itself: each room's walls traced, then filled, then everything else, tier
 * by tier, spreading out from the front door (DRAW); the names last.
 *
 * Rooms in `linked` answer the pointer and the keyboard: hovering, focusing
 * or tapping one calls `onRoom` with its key, and `active` is shaded.
 *
 * `frame` crops the sheet to a box of the plan (the whole flat if not
 * given), and `children` are drawn over it in the plan's millimetres.
 */
export function FloorPlan({
  className,
  linked,
  active,
  onRoom,
  frame,
  label = "Floor plan of a five-room flat: living and dining, kitchen, three bedrooms, two bathrooms, a hall, a shelter and a yard",
  children,
}: {
  className?: string;
  linked?: ReadonlySet<string>;
  active?: string;
  onRoom?: (key: string) => void;
  frame?: Box;
  label?: string;
  children?: ReactNode;
}) {
  const walls = wallBoxes();
  const symbols = planSymbols();
  const top = -WALL;
  const [x0, y0, x1, y1] = DRAWN;
  const [v0, w0, v1, w1] = frame ?? [x0 - MARGIN, y0 - MARGIN, x1 + MARGIN_EAST, y1 + MARGIN];
  return (
    <svg
      className={[styles.plan, className].filter(Boolean).join(" ")}
      viewBox={`${v0} ${w0} ${v1 - v0} ${w1 - w0}`}
      role={onRoom ? "group" : "img"}
      aria-label={label}
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
        {/* the openings, kept clear of the walls' traced outlines */}
        <mask id="plan-openings" maskUnits="userSpaceOnUse" x={x0} y={y0} width={x1 - x0} height={y1 - y0}>
          {box(DRAWN, "white")}
          {[...DOORS, ...WINDOWS].map((o) => box(cut(o), "black"))}
          {BAYS.map((b) => box([b.x0, top - 1, b.x1, top + WALL + 1], "black"))}
        </mask>
      </defs>

      {onRoom && (
        <g className={styles.rooms}>
          {ROOMS.filter((r) => linked?.has(r.key)).map((r) => (
            <rect
              key={r.key}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.d}
              data-active={r.key === active || undefined}
              role="button"
              tabIndex={0}
              aria-label={`Show ${r.name.toLowerCase()}`}
              onPointerEnter={() => onRoom(r.key)}
              onFocus={() => onRoom(r.key)}
              onClick={() => onRoom(r.key)}
            />
          ))}
        </g>
      )}

      <rect className={styles.walls} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="currentColor" mask="url(#plan-walls)" />

      <g className={styles.lines}>
        {/* each room's walls, traced on arrival and gone once they are filled */}
        <g className={styles.outline} mask="url(#plan-openings)">
          {pieces(
            "outline",
            ROOMS.map((r) => `M${r.x} ${r.y}H${r.x + r.w}V${r.y + r.d}H${r.x}Z`),
          )}
        </g>
        {pieces(
          "glass",
          [
            ...WINDOWS.map(glass),
            ...BAYS.map((b) => `M${b.x0} ${top}V${top - b.depth}H${b.x1}V${top}`),
          ],
          styles.heavy,
        )}
        {pieces("light", BAYS.map((b) => `M${b.x0} ${top - b.depth + 50}H${b.x1}`), styles.light)}
        {pieces("doors", symbols.doors, styles.heavy)}
        {pieces("swings", symbols.swings, styles.light)}
        {pieces("fittings", symbols.fittings, styles.fittings)}
        {pieces("furniture", symbols.furniture, styles.furniture)}
        {pieces("light", symbols.light, styles.light)}
      </g>

      <g className={styles.names}>
        {ROOMS.map((r) => {
          const [x, y] = NAME_AT[r.key] ?? [r.x + r.w / 2, r.y + r.d / 2];
          const small = r.w < 2400 || r.d < 1500;
          return (
            <text key={r.key} x={x} y={y} fontSize={small ? 150 : 200} style={typed(r.name, x, y)}>
              {r.name}
            </text>
          );
        })}
        {symbols.tags.map((t) => (
          <text key={t.text} x={t.x} y={t.y} fontSize={110} style={typed(t.text, t.x, t.y)}>
            {t.text}
          </text>
        ))}
        <text
          x={AC_LEDGE.x1 + 180}
          y={(AC_LEDGE.y0 + AC_LEDGE.y1) / 2}
          fontSize={110}
          transform={`rotate(90 ${AC_LEDGE.x1 + 180} ${(AC_LEDGE.y0 + AC_LEDGE.y1) / 2})`}
          style={typed("A/C ledge", AC_LEDGE.x1, AC_LEDGE.y0)}
        >
          A/C ledge
        </text>
      </g>

      {children}
    </svg>
  );
}
