import type { ReactNode } from "react";

const TONE = { paper: "", linen: " band-linen", dark: " band-dark on-dark" } as const;

/** One section of a page: the site's one vertical rhythm, on paper, linen or a dark band, over the 12-column grid. */
export function Section({
  id,
  labelledBy = id ? `${id}-title` : undefined,
  tone = "paper",
  className = "",
  children,
}: {
  id?: string;
  /** The id of the section's heading; SectionHead gives `${id}-title` by default. */
  labelledBy?: string;
  tone?: keyof typeof TONE;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section${TONE[tone]} ${className}`.trim()}>
      <div className="container">{children}</div>
    </section>
  );
}
