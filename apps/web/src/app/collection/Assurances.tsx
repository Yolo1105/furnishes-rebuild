import type { ReactNode } from "react";
import { shown } from "@/lib/facts";
import styles from "../products/sections.module.css";

const ASSURANCES: readonly { name: string; line: string; icon: ReactNode }[] = [
  {
    name: "Delivery",
    line: shown("gstTerms"),
    icon: <path d="M2 6h12v11H2zM14 10h4l4 4v3h-8zM6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  },
  {
    name: "Returns",
    line: shown("returnsTerms"),
    icon: <path d="M4 9h12a4 4 0 0 1 0 8H8M4 9l4-4M4 9l4 4" />,
  },
  {
    name: "Support",
    line: `Email and the AI assistant. We reply within ${shown("replyTime")}.`,
    icon: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  },
  {
    name: "Payment",
    line: shown("paymentMethods"),
    icon: <path d="M2 6h20v12H2zM2 10h20M6 15h4" />,
  },
];

/** What holds for every piece, in a row of four. */
export function Assurances() {
  return (
    <ul className={styles.assurances} aria-label="What holds for every piece">
      {ASSURANCES.map((a) => (
        <li key={a.name} className={styles.assurance}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {a.icon}
          </svg>
          <div>
            <h3 className={styles.assuranceName}>{a.name}</h3>
            <p className={styles.assuranceLine}>{a.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
