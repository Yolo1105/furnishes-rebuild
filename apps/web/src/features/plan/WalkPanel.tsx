import Link from "next/link";
import type { CSSProperties, Ref } from "react";
import { routes } from "@/lib/routes";
import button from "./InkButton.module.css";
import styles from "./WalkPanel.module.css";

/**
 * The panel that slides in beside the walk and says what is going on, one
 * step at a time. PlanWalk opens it, scrolls its steps and marks each one
 * shown as it comes up (data-open, data-shown, data-active); everything
 * else here is markup and CSS.
 */

type Step = {
  no: string;
  label: string;
  lines: string[];
  body: string;
  card?: boolean;
  name?: string;
  cta?: boolean;
};

const STEPS: Step[] = [
  {
    no: "01",
    label: "The plan",
    lines: ["Every home", "starts as a plan."],
    body: "A 5-room HDB flat, drawn to scale: every wall, door and window where it really is, and the furniture that lives there.",
  },
  {
    no: "02",
    label: "The walls",
    lines: ["Then the walls", "go up."],
    card: true,
    name: "The Furnishes bookcase",
    body: "Built for that wall, from 18 mm boards, to the millimetre. Every piece we make starts from your plan.",
  },
  {
    no: "03",
    label: "Inside",
    lines: ["Step inside.", "Make it yours."],
    body: "Move a piece, change a finish, try another layout. What you see here is what we make.",
    cta: true,
  },
];

export const STEP_COUNT = STEPS.length;

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
      <path className={styles.dim} d={`M${x1 + 16} ${top}V${foot}M${x1 + 12} ${top + 4}l8 -8M${x1 + 12} ${foot + 4}l8 -8M${x0} ${foot + 14}H${x1}M${x0 - 4} ${foot + 18}l8 -8M${x1 - 4} ${foot + 18}l8 -8`} />
      <text x={x1 + 26} y={(top + foot) / 2} transform={`rotate(90 ${x1 + 26} ${(top + foot) / 2})`}>
        1800
      </text>
      <text x={(x0 + x1) / 2} y={foot + 28}>
        1600
      </text>
    </svg>
  );
}

export function WalkPanel({ ref }: { ref: Ref<HTMLElement> }) {
  return (
    <aside ref={ref} className={styles.panel} aria-label="What you are looking at">
      <div className={styles.content}>
        {STEPS.map((step) => (
          <section key={step.no} className={styles.step}>
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
                  <BookcaseDrawing />
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
          </section>
        ))}
      </div>
      <ol className={styles.dots} aria-hidden="true">
        {STEPS.map((step) => (
          <li key={step.no} />
        ))}
      </ol>
    </aside>
  );
}
