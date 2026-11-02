import type { ReactNode } from "react";

/** A section's eyebrow, heading and lede, over its content; the heading's id is what the section is labelled by. */
export function SectionHead({
  id,
  eyebrow,
  title,
  lede,
  action,
  as: Heading = "h2",
  className = "span-8",
}: {
  /** The section's id; the heading gets `${id}-title`. */
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** One `.btn-link` (or a row of buttons) under the lede. */
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <header className={`section-head ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id ? `${id}-title` : undefined}>{title}</Heading>
      {lede && <p className="lede">{lede}</p>}
      {action}
    </header>
  );
}
