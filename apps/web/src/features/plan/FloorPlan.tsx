import type { CSSProperties, ReactNode } from "react";
import { AC_LEDGE, BAYS, type Box, COLUMNS, DOORS, DRAWN, GRID_CORNER, GRID_CORNER_GONE, GRID_INK, GRID_REACH, GRID_STEP, NAME_AT, ROOMS, type Room, SEAM, WALL, WINDOWS, type Opening, wallBoxes } from "./flat";
import { planSymbols } from "./symbols";
import styles from "./FloorPlan.module.css";

/** Room on the sheet past the drawing, mm: a hair on three sides, more to the east for the A/C ledge's label. */
const MARGIN = 40;
const MARGIN_EAST = 250;

/** How far a floor reaches past its room, mm: past halfway to the next room, so the floors overlap, no seam showing in the doorways. */
const UNDER_WALL = 200;

/** How far a bay's glass stands in from its cheeks, and each of its two lines from its middle, mm. */
const BAY_GLASS = 50;
const GLASS_APART = 25;

const box = ([x0, y0, x1, y1]: Box, fill: string) => (
  <rect key={`${x0} ${y0} ${x1} ${y1}`} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={fill} />
);

/** The grid's lines, on its squares, over the drawing and its reach. */
function gridLines([x0, y0, x1, y1]: Box) {
  const lines: string[] = [];
  for (let x = Math.ceil(x0 / GRID_STEP) * GRID_STEP; x <= x1; x += GRID_STEP) lines.push(`M${x} ${y0}V${y1}`);
  for (let y = Math.ceil(y0 / GRID_STEP) * GRID_STEP; y <= y1; y += GRID_STEP) lines.push(`M${x0} ${y}H${x1}`);
  return lines.join("");
}

/** A fade from nothing to solid and back along one axis, solid over all but the reach at each end. */
function gridFade(id: string, along: "x" | "y", length: number) {
  const edge = (GRID_REACH / length) * 100;
  return (
    <linearGradient id={id} x1="0" y1="0" x2={along === "x" ? 1 : 0} y2={along === "y" ? 1 : 0}>
      <stop offset="0%" stopColor="white" stopOpacity={0} />
      <stop offset={`${edge}%`} stopColor="white" />
      <stop offset={`${100 - edge}%`} stopColor="white" />
      <stop offset="100%" stopColor="white" stopOpacity={0} />
    </linearGradient>
  );
}

/** The box an opening cuts through its wall, a little past both faces. */
function cut(o: Opening): Box {
  const [a0, a1] = [o.at - o.width / 2, o.at + o.width / 2];
  const [c0, c1] = [o.across - WALL / 2 - SEAM, o.across + WALL / 2 + SEAM];
  return o.run === "ew" ? [a0, c0, a1, c1] : [c0, a0, c1, a1];
}

/** A window's two lines of glass, either side of its wall's centre. */
function glass(o: Opening) {
  const [a0, a1] = [o.at - o.width / 2, o.at + o.width / 2];
  return [-25, 25]
    .map((off) => (o.run === "ew" ? `M${a0} ${o.across + off}H${a1}` : `M${o.across + off} ${a0}V${a1}`))
    .join("");
}

/**
 * When each tier starts drawing on arrival, and over how long its pieces
 * scatter, seconds from the plan's start: the walls traced, then filled, the
 * glass, the doors and their swings, the fittings, the furniture, the faint
 * marks, then the names typed in.
 */
const DRAW = {
  outline: [0, 0.5],
  glass: [0.5, 0.3],
  doors: [0.6, 0.3],
  swings: [0.7, 0.3],
  fittings: [0.7, 0.4],
  furniture: [0.8, 0.4],
  light: [1, 0.3],
  names: [1, 0.3],
} as const;

/** A number from 0 to 1 that looks random but is always the same for a text, so server and browser agree. */
function scatter(text: string) {
  let hash = 2166136261;
  for (const c of text) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
  return (hash >>> 0) / 2 ** 32;
}

/** A piece's start and pace on arrival, scattered within its tier: some early, some late, some quick, some slow. */
function at(tier: keyof typeof DRAW, d: string) {
  const [from, spread] = DRAW[tier];
  return {
    "--at": `${(from + scatter(d) ** 1.5 * spread).toFixed(2)}s`,
    "--pace": (0.5 + scatter(`${d}pace`) * 1.2).toFixed(2),
  } as CSSProperties;
}

/** A tier's pieces, each its own path so each draws in on its own. */
const pieces = (tier: keyof typeof DRAW, list: readonly string[], className?: string) =>
  list.map((d, i) => <path key={i} className={className} d={d} pathLength={1} style={at(tier, d)} />);

/** A name's start on arrival, and its letters, for it to be typed in one at a time. */
const typed = (text: string) =>
  ({ "--at": `${(DRAW.names[0] + scatter(text) * DRAW.names[1]).toFixed(2)}s`, "--chars": text.length }) as CSSProperties;

/** A room's walls as one path, starting from a corner of its own and going round either way. */
function roomOutline(r: Room) {
  const corners = [`${r.x} ${r.y}`, `${r.x + r.w} ${r.y}`, `${r.x + r.w} ${r.y + r.d}`, `${r.x} ${r.y + r.d}`];
  const first = Math.floor(scatter(r.key) * 4);
  const turned = [...corners.slice(first), ...corners.slice(0, first)];
  const [start, ...rest] = scatter(`${r.key}way`) < 0.5 ? turned : [turned[0]!, ...turned.slice(1).reverse()];
  return `M${start}L${rest.join("L")}Z`;
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
 *
 * While the page's arrival plays (`data-intro="play"` on the root), it draws
 * itself: each room's walls traced, then filled, then everything else, tier
 * by tier, spreading out from the front door (DRAW); the names last.
 *
 * Rooms in `linked` answer the pointer and the keyboard: hovering, focusing
 * or tapping one calls `onRoom` with its key, and `active` is shaded.
 *
 * `grid` lays a drafting grid behind it, kept out of the flat itself and
 * fading out in a rectangle round it, past the edge of the sheet.
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
  grid = false,
  label = "Floor plan of a five-room flat: living and dining, kitchen, three bedrooms, two bathrooms, a hall, a shelter and a yard",
  children,
}: {
  className?: string;
  linked?: ReadonlySet<string>;
  active?: string;
  onRoom?: (key: string) => void;
  frame?: Box;
  grid?: boolean;
  label?: string;
  children?: ReactNode;
}) {
  const walls = wallBoxes();
  const symbols = planSymbols();
  const top = -WALL;
  const [x0, y0, x1, y1] = DRAWN;
  const reach: Box = [x0 - GRID_REACH, y0 - GRID_REACH, x1 + GRID_REACH, y1 + GRID_REACH];
  const [v0, w0, v1, w1] = frame ?? [x0 - MARGIN, y0 - MARGIN, x1 + MARGIN_EAST, y1 + MARGIN];
  return (
    <svg
      className={[styles.plan, className].filter(Boolean).join(" ")}
      viewBox={`${v0} ${w0} ${v1 - v0} ${w1 - w0}`}
      role={onRoom ? "group" : "img"}
      aria-label={label}
      overflow={grid ? "visible" : undefined}
    >
      <defs>
        <mask id="plan-walls" maskUnits="userSpaceOnUse" x={x0} y={y0} width={x1 - x0} height={y1 - y0}>
          {walls.fill.map((b) => box(b, "white"))}
          {walls.clear.map((b) => box(b, "black"))}
          {[...DOORS, ...WINDOWS].map((o) => box(cut(o), "black"))}
          {BAYS.map((b) => box([b.x0, top - SEAM, b.x1, top + WALL + SEAM], "black"))}
          {COLUMNS.map((b) => box(b, "white"))}
          {LEDGE.map((b) => box(b, "white"))}
        </mask>
        {/* the openings, kept clear of the walls' traced outlines */}
        <mask id="plan-openings" maskUnits="userSpaceOnUse" x={x0} y={y0} width={x1 - x0} height={y1 - y0}>
          {box(DRAWN, "white")}
          {[...DOORS, ...WINDOWS].map((o) => box(cut(o), "black"))}
          {BAYS.map((b) => box([b.x0, top - 1, b.x1, top + WALL + 1], "black"))}
        </mask>
        {/* the flat's footprint: the floors stop at the outer face of its walls, and run on through its doorways */}
        <clipPath id="plan-footprint">
          {DOORS.map((o) => box(cut(o), "black"))}
          {ROOMS.map((r) => box([r.x - WALL, r.y - WALL, r.x + r.w + WALL, r.y + r.d + WALL], "black"))}
          {BAYS.map((b) => box([b.x0 - WALL, top - b.depth, b.x1 + WALL, top + WALL], "black"))}
          {box([AC_LEDGE.x0, AC_LEDGE.y0, AC_LEDGE.x1, AC_LEDGE.y1], "black")}
        </clipPath>
      </defs>

      {grid && (
        <>
          <defs>
            {gridFade("plan-grid-across", "x", reach[2] - reach[0])}
            {gridFade("plan-grid-down", "y", reach[3] - reach[1])}
            <radialGradient id="plan-grid-corner">
              <stop offset={`${GRID_CORNER_GONE * 100}%`} stopColor="black" />
              <stop offset="100%" stopColor="black" stopOpacity={0} />
            </radialGradient>
            <mask id="plan-grid-fade-across" maskUnits="userSpaceOnUse" x={reach[0]} y={reach[1]} width={reach[2] - reach[0]} height={reach[3] - reach[1]}>
              {box(reach, "url(#plan-grid-across)")}
            </mask>
            <mask id="plan-grid-fade-down" maskUnits="userSpaceOnUse" x={reach[0]} y={reach[1]} width={reach[2] - reach[0]} height={reach[3] - reach[1]}>
              {box(reach, "url(#plan-grid-down)")}
            </mask>
            {/* the flat's own footprint, cut out: its rooms out to their walls, the bays and the ledge */}
            <mask id="plan-grid-outside" maskUnits="userSpaceOnUse" x={reach[0]} y={reach[1]} width={reach[2] - reach[0]} height={reach[3] - reach[1]}>
              {box(reach, "white")}
              {[reach[0], reach[2]].flatMap((cx) =>
                [reach[1], reach[3]].map((cy) => <circle key={`${cx} ${cy}`} cx={cx} cy={cy} r={GRID_CORNER} fill="url(#plan-grid-corner)" />),
              )}
              {ROOMS.map((r) => box([r.x - WALL, r.y - WALL, r.x + r.w + WALL, r.y + r.d + WALL], "black"))}
              {BAYS.map((b) => box([b.x0, top - b.depth, b.x1, top + WALL], "black"))}
              {box([AC_LEDGE.x0, AC_LEDGE.y0, AC_LEDGE.x1, AC_LEDGE.y1], "black")}
            </mask>
          </defs>
          <g className={styles.grid} mask="url(#plan-grid-fade-across)">
            <g mask="url(#plan-grid-fade-down)">
              <g mask="url(#plan-grid-outside)">
                <path d={gridLines(reach)} strokeOpacity={GRID_INK} />
              </g>
            </g>
          </g>
        </>
      )}

      <g className={styles.sheet}>
      <g className={styles.floors} clipPath="url(#plan-footprint)">
        {ROOMS.map((r) => box([r.x - UNDER_WALL, r.y - UNDER_WALL, r.x + r.w + UNDER_WALL, r.y + r.d + UNDER_WALL], "currentColor"))}
        {BAYS.map((b) => box([b.x0 - WALL, top - b.depth, b.x1 + WALL, top + WALL], "currentColor"))}
        {box([AC_LEDGE.x0, AC_LEDGE.y0, AC_LEDGE.x1, AC_LEDGE.y1], "currentColor")}
      </g>

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
        {pieces("glass", WINDOWS.map(glass), styles.heavy)}
        <g>
          {/* each room's walls, traced on arrival and gone once they are filled */}
          <g className={styles.outline} mask="url(#plan-openings)">
            {pieces(
              "outline",
              ROOMS.map(roomOutline),
            )}
          </g>
          {pieces("glass", BAYS.map((b) => `M${b.x0} ${top}V${top - b.depth}H${b.x1}V${top}`), styles.heavy)}
          {pieces("light", BAYS.map((b) => `M${b.x0} ${top - b.depth + 50}H${b.x1}`), styles.light)}
          {pieces("doors", symbols.doors, styles.heavy)}
          {pieces("swings", symbols.swings, styles.light)}
          {pieces("fittings", symbols.fittings, styles.fittings)}
          {pieces("furniture", symbols.furniture, styles.furniture)}
          {pieces("light", symbols.light, styles.light)}
        </g>
        {/* the bays as the 3D plan has them, solid, as the room's shading goes */}
        <g className={styles.bayWalls}>
          {BAYS.flatMap((b) => [
            box([b.x0 - WALL, top - b.depth, b.x0, top], "currentColor"),
            box([b.x1, top - b.depth, b.x1 + WALL, top], "currentColor"),
            box([b.x0, top - b.depth, b.x0 + BAY_GLASS, top - b.depth + WALL], "currentColor"),
            box([b.x1 - BAY_GLASS, top - b.depth, b.x1, top - b.depth + WALL], "currentColor"),
          ])}
          <path
            className={styles.heavy}
            d={BAYS.flatMap((b) =>
              [-GLASS_APART, GLASS_APART].map((off) => `M${b.x0 + BAY_GLASS} ${top - b.depth + BAY_GLASS + off}H${b.x1 - BAY_GLASS}`),
            ).join("")}
          />
        </g>
      </g>

      <g className={styles.names}>
        {ROOMS.map((r) => {
          const [x, y] = NAME_AT[r.key] ?? [r.x + r.w / 2, r.y + r.d / 2];
          const small = r.w < 2400 || r.d < 1500;
          return (
            <text key={r.key} x={x} y={y} fontSize={small ? 150 : 200} style={typed(r.name)}>
              {r.name}
            </text>
          );
        })}
        {symbols.tags.map((t) => (
          <text key={t.text} x={t.x} y={t.y} fontSize={110} style={typed(t.text)}>
            {t.text}
          </text>
        ))}
        <text
          x={AC_LEDGE.x1 + 180}
          y={(AC_LEDGE.y0 + AC_LEDGE.y1) / 2}
          fontSize={110}
          transform={`rotate(90 ${AC_LEDGE.x1 + 180} ${(AC_LEDGE.y0 + AC_LEDGE.y1) / 2})`}
          style={typed("A/C ledge")}
        >
          A/C ledge
        </text>
      </g>

      </g>

      {children}
    </svg>
  );
}
