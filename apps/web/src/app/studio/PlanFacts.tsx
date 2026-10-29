import type { ReactNode } from "react";
import { BAYS, WINDOWS, roomArea } from "@/features/plan/flat";
import styles from "./PlanFacts.module.css";

/** Line icons on a 24 grid, in the text colour. */
const icon = (paths: ReactNode) => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    {paths}
  </svg>
);

const SOFA = icon(
  <>
    <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
    <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3z" />
    <path d="M5 17v2M19 17v2" />
  </>,
);

const BED = icon(
  <>
    <path d="M3 18V6M21 18v-5a3 3 0 0 0-3-3h-8v5" />
    <path d="M3 13h18" />
    <circle cx="6.5" cy="10.5" r="1.5" />
  </>,
);

const WINDOW = icon(
  <>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M12 3v18M4 12h16" />
  </>,
);

/** Three of the flat's figures in a row under its plan: a label, then an icon and the figure. */
export function PlanFacts() {
  const facts = [
    { label: "Living & dining", icon: SOFA, value: roomArea("living"), unit: "m²" },
    { label: "Master bedroom", icon: BED, value: roomArea("master"), unit: "m²" },
    { label: "Windows", icon: WINDOW, value: WINDOWS.length + BAYS.length, unit: "" },
  ];
  return (
    <dl className={styles.facts}>
      {facts.map((f) => (
        <div key={f.label} className={styles.fact}>
          <dt className={styles.label}>{f.label}</dt>
          <dd className={styles.value}>
            {f.icon}
            {f.value}
            {f.unit && <span className={styles.unit}>{f.unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
