import Link from "next/link";
import type { CSSProperties, Ref } from "react";
import { routes } from "@/lib/routes";
import { SWATCHES } from "./finishes";
import button from "./InkButton.module.css";
import styles from "./WalkPanel.module.css";

/**
 * The panel that slides in beside the walk and says what is going on, one
 * step at a time. PlanWalk opens it, scrolls its steps (the scroller's
 * scrollTop, one for one with the page) and marks each one shown as it
 * comes up (data-open, data-shown, data-active); everything else here is
 * markup and CSS.
 */

type Step = {
  label: string;
  lines: string[];
  body: string;
  /** a card above the words: the bookcase drawn, or the finishes */
  card?: "bookcase" | "swatches";
  name?: string;
  cta?: boolean;
};

const STEPS: Step[] = [
  {
    label: "The plan",
    lines: ["Every home", "starts as a plan."],
    body: "A 5-room HDB flat, drawn to scale: every wall, door and window where it really is, and the furniture that lives there.",
  },
  {
    label: "The walls",
    lines: ["Then the walls", "go up."],
    body: "The drawing becomes rooms you can stand in, at their real height, with light through their windows.",
  },
  {
    label: "Inside",
    lines: ["Step inside."],
    body: "Through the front door at eye level, the way you will walk in on the first day.",
  },
  {
    label: "Board by board",
    lines: ["Made for that wall,", "board by board."],
    card: "bookcase",
    name: "The Furnishes bookcase",
    body: "Cut to the millimetre from 18 mm boards, and put together in your home. Every piece we make starts from your plan.",
  },
  {
    label: "Materials",
    lines: ["Then choose what", "it is made of."],
    card: "swatches",
    body: "Oak or walnut, wool or linen, any colour: try a finish across the whole room before you decide.",
  },
  {
    label: "Your turn",
    lines: ["Try another layout.", "Make it yours."],
    body: "Turn the sofa, move the table, see what fits. Then start on your own room.",
    cta: true,
  },
];

/** The bookcase from the plan, drawn in elevation with its two main sizes. */
function BookcaseDrawing() {
  // 1 unit = 16 mm: 1600 wide, 1800 tall, standing on the line y = 142.5
  const [x0, x1, top, foot] = [110, 210, 30, 142.5];
  const shelves = [60, 480, 900, 1320].map((mm) => foot - mm / 16);
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="The bookcase, 1600 mm wide and 1800 mm tall">
      <rect x={x0} y={top} width={x1 - x0} height={foot - top} />
      <path d={`M${x0 + 1.1} ${top + 1.1}V${foot}M${x1 - 1.1} ${top + 1.1}V${foot}M${x0} ${top + 1.1}H${x1}`} />
      {shelves.map((y) => (
        <path key={y} d={`M${x0 + 1.1} ${y}H${x1 - 1.1}M${x0 + 1.1} ${y - 1.1}H${x1 - 1.1}`} />
      ))}
      <path
        className={styles.dim}
        d={`M${x1 + 16} ${top}V${foot}M${x1 + 12} ${top + 4}l8 -8M${x1 + 12} ${foot + 4}l8 -8M${x0} ${foot + 14}H${x1}M${x0 - 4} ${foot + 18}l8 -8M${x1 - 4} ${foot + 18}l8 -8`}
      />
      <text x={x1 + 26} y={(top + foot) / 2} transform={`rotate(90 ${x1 + 26} ${(top + foot) / 2})`}>
        1800
      </text>
      <text x={(x0 + x1) / 2} y={foot + 28}>
        1600
      </text>
    </svg>
  );
}

/** The finishes the room sweeps into, as round samples with their names. */
function Swatches() {
  return (
    <ul className={styles.swatches}>
      {SWATCHES.map((s) => (
        <li key={s.name}>
          <span className={styles.swatch} style={{ background: s.color }} />
          {s.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * `afterOpening`: the walk had an opening that told the plan's part itself
 * (its own 01 and 02), so the panel leaves its first step out and numbers
 * the rest on from 03.
 */
export function WalkPanel({ ref, afterOpening = false }: { ref: Ref<HTMLElement>; afterOpening?: boolean }) {
  const steps = (afterOpening ? STEPS.slice(1) : STEPS).map((step, i) => ({
    ...step,
    no: String(i + (afterOpening ? 3 : 1)).padStart(2, "0"),
  }));
  return (
    <aside ref={ref} className={styles.panel} aria-label="What you are looking at">
      <div className={styles.scroller}>
        <div className={styles.content}>
          {steps.map((step) => (
            <section key={step.no} className={styles.step}>
              <div className={styles.stepBody}>
                <p className={styles.numeral} aria-hidden="true">
                  {step.no}
                </p>
                <p className={styles.label}>
                  {step.no} · {step.label}
                </p>
                <h2 className={styles.headline}>
                  {step.lines.map((line, i) => (
                    <span key={line} className={styles.line} style={{ "--i": i } as CSSProperties}>
                      <span>{line}</span>
                    </span>
                  ))}
                </h2>
                {step.card && (
                  <figure className={styles.card}>
                    <div className={styles.cardArt}>
                      {step.card === "bookcase" ? <BookcaseDrawing /> : <Swatches />}
                    </div>
                  </figure>
                )}
                {step.name && <p className={styles.name}>{step.name}</p>}
                <p className={styles.body}>{step.body}</p>
                {step.cta && (
                  <Link href={routes.studio} className={`${button.button} ${styles.cta}`}>
                    Design your room
                  </Link>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      <ol className={styles.dots} aria-hidden="true">
        {steps.map((step) => (
          <li key={step.no} />
        ))}
      </ol>
    </aside>
  );
}
