import type { ReactNode } from "react";

export type Step = { title: string; body: ReactNode; action?: ReactNode };

/** A numbered row of steps (or, unnumbered, a row of options), three to a row on wide screens. */
export function Steps({ steps, numbered = true, span = "span-4" }: { steps: readonly Step[]; numbered?: boolean; span?: string }) {
  const List = numbered ? "ol" : "ul";
  return (
    <List className="span-12 subgrid">
      {steps.map((s, i) => (
        <li key={s.title} className={`card ${span}`}>
          {numbered && <span className="mono">{String(i + 1).padStart(2, "0")}</span>}
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          {s.action}
        </li>
      ))}
    </List>
  );
}
