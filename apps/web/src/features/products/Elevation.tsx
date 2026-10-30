import styles from "./Elevation.module.css";

/** Paper round the outline, mm: room for the dimension lines. */
const PAPER = 420;

/** How far out from the outline its dimension lines run, mm. */
const DIM_OUT = 200;

/**
 * A piece drawn as an architect draws an elevation: its outline standing on
 * the floor line, its width (or depth) along the top and its height down the
 * left, each a line with slashed ends and the length on it in mm. `scale`:
 * mm across the drawing's own width, so a set of elevations drawn at the same
 * scale keep their sizes against each other.
 */
export function Elevation({ across, high, label, scale }: { across: number; high: number; label: string; scale: number }) {
  const [x, y] = [PAPER, PAPER];
  const top = y - DIM_OUT;
  const left = x - DIM_OUT;
  const tick = (tx: number, ty: number) => `M${tx - 40} ${ty + 40}L${tx + 40} ${ty - 40}`;
  const width = across + 2 * PAPER;
  const height = high + PAPER + 160;
  return (
    <figure className={styles.elevation} style={{ width: `${(width / scale) * 100}%` }}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}: ${across} by ${high} mm`}>
        <path className={styles.floor} d={`M0 ${y + high}H${width}`} />
        <rect className={styles.outline} x={x} y={y} width={across} height={high} />
        <path
          className={styles.dim}
          d={[
            `M${x} ${top}H${x + across}`,
            `M${x} ${top - 80}V${y - 80}M${x + across} ${top - 80}V${y - 80}`,
            tick(x, top),
            tick(x + across, top),
            `M${left} ${y}V${y + high}`,
            `M${left - 80} ${y}H${x - 80}M${left - 80} ${y + high}H${x - 80}`,
            tick(left, y),
            tick(left, y + high),
          ].join("")}
        />
        <text x={x + across / 2} y={top} fontSize={110}>
          {across}
        </text>
        <text x={left} y={y + high / 2} fontSize={110} transform={`rotate(-90 ${left} ${y + high / 2})`}>
          {high}
        </text>
      </svg>
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}

/** The width of paper an elevation of this size takes, mm: for choosing a shared `scale`. */
export const elevationWidth = (across: number) => across + 2 * PAPER;
