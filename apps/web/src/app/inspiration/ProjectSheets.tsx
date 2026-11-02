import Image from "next/image";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { type Box, FLAT, ROOMS, type Room, WALL } from "@/features/plan/flat";
import { PROJECTS } from "./projects";
import styles from "./ProjectSheets.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** The drawn sheet's shape, width to height: the photo's beside it, 16:9. */
const ASPECT = 16 / 9;

/** Paper round a room on its drawn sheet, mm: room for the dimension lines and a little of the rooms next door. */
const PAPER = 1200;

/** How far out from a room's wall its dimension lines run, mm. */
const DIM_OUT = 750;

/** A room with paper round it, widened or deepened to the sheet's shape. */
function frameOf(r: Room): Box {
  let w = r.w + 2 * PAPER;
  let h = r.d + 2 * PAPER;
  if (w / h < ASPECT) w = h * ASPECT;
  else h = w / ASPECT;
  const [cx, cy] = [r.x + r.w / 2, r.y + r.d / 2];
  return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
}

/**
 * Over a room's part of the plan: the rooms round it faded back to the
 * paper, the room washed, and its width along its north side and its depth
 * down its west, as an architect dimensions them, in mm.
 */
function Dimensions({ room: r, frame: [f0, g0, f1, g1] }: { room: Room; frame: Box }) {
  const top = r.y - DIM_OUT;
  const left = r.x - DIM_OUT;
  const tick = (x: number, y: number) => `M${x - 70} ${y + 70}L${x + 70} ${y - 70}`;
  const [h0, k0, h1, k1] = [r.x - WALL, r.y - WALL, r.x + r.w + WALL, r.y + r.d + WALL];
  return (
    <g className={styles.dims}>
      <path className={styles.fade} fillRule="evenodd" d={`M${f0} ${g0}H${f1}V${g1}H${f0}ZM${h0} ${k0}V${k1}H${h1}V${k0}Z`} />
      <rect className={styles.wash} x={r.x} y={r.y} width={r.w} height={r.d} />
      <path
        d={[
          `M${r.x} ${top}H${r.x + r.w}`,
          `M${r.x} ${top - 150}V${r.y - 200}M${r.x + r.w} ${top - 150}V${r.y - 200}`,
          tick(r.x, top),
          tick(r.x + r.w, top),
          `M${left} ${r.y}V${r.y + r.d}`,
          `M${left - 150} ${r.y}H${r.x - 200}M${left - 150} ${r.y + r.d}H${r.x - 200}`,
          tick(left, r.y),
          tick(left, r.y + r.d),
        ].join("")}
      />
      <text x={r.x + r.w / 2} y={top} fontSize={170}>
        {r.w}
      </text>
      <text x={left} y={r.y + r.d / 2} fontSize={170} transform={`rotate(-90 ${left} ${r.y + r.d / 2})`}>
        {r.d}
      </text>
    </g>
  );
}

/**
 * The ideas as a list of sheets, one under another: each its number, name
 * and words, then its room on the plan (ours, dimensioned) beside a stock
 * mood photo, captioned as not our furniture.
 */
export function ProjectSheets() {
  return (
    <ol className="span-12 subgrid">
      {PROJECTS.map((p, i) => {
        const room = ROOMS.find((r) => r.key === p.room);
        const frame = room && frameOf(room);
        return (
          <li key={p.slug} id={p.slug} className={`span-12 subgrid ${styles.sheet}`}>
            <header className={`span-8 ${styles.head}`}>
              <p className="mono">
                {pad(i + 1)} · {FLAT.name} {FLAT.kind}
                {room && ` · ${((room.w * room.d) / 1e6).toFixed(1)} m²`}
              </p>
              <h2 id={`${p.slug}-title`} className="h2-sm">
                {p.title}
              </h2>
              <p>{p.body}</p>
            </header>
            {room && frame && (
              <div className={`span-6 ${styles.plan}`}>
                <FloorPlan frame={frame} label={`Plan of the ${room.name.toLowerCase()}, ${room.w} by ${room.d} mm`}>
                  <Dimensions room={room} frame={frame} />
                </FloorPlan>
              </div>
            )}
            <figure className={`span-6 ${styles.photo}`}>
              <div className="media-band">
                <Image src={p.photo} alt={p.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" placeholder="blur" />
              </div>
              <figcaption className="meta">Mood reference — not our furniture</figcaption>
            </figure>
          </li>
        );
      })}
    </ol>
  );
}
