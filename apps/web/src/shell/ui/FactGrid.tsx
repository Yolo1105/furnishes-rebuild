import type { ReactNode } from "react";

export type Fact = { label: string; body: ReactNode };

/** A ruled grid of facts, three to a row on wide screens: each a label over its words. */
export function FactGrid({ facts, span = "span-4" }: { facts: readonly Fact[]; span?: string }) {
  return (
    <dl className="span-12 subgrid">
      {facts.map((f) => (
        <div key={f.label} className={`card ${span}`}>
          <dt className="eyebrow">{f.label}</dt>
          <dd>{f.body}</dd>
        </div>
      ))}
    </dl>
  );
}
