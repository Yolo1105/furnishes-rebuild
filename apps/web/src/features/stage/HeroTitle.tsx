import type { CSSProperties, ReactNode } from "react";
import styles from "./HeroTitle.module.css";

/** How strongly each echo of the second word shows, fainter as they go down. */
const ECHOES = [0.55, 0.25];

/**
 * The landing's title, as on the live site: "Interior Revolution" in wide
 * hairline caps, its second word a shade fainter, each line rising in after
 * the one above. It sits at the top left of whatever stage it is on, lined
 * up with the bar's first link; a stage may fade it by setting --title.
 * It is rust over the orange wash, and cream (`tone="cream"`) over a dark
 * picture; `className` lets a page move it. With `echoes`, the second word
 * repeats below itself, up to twice, fainter each time (as the live site's
 * title did). Anything passed as children sits right under it, and moves
 * and fades with it.
 */
export function HeroTitle({
  tone = "rust",
  className,
  echoes = 0,
  children,
}: {
  tone?: "rust" | "cream";
  className?: string;
  echoes?: number;
  children?: ReactNode;
}) {
  return (
    <div className={className ? `${styles.hero} ${className}` : styles.hero}>
      <h1 className={styles.title} data-tone={tone} aria-label="Interior Revolution">
        <span className={styles.first} aria-hidden="true">
          Interior
        </span>
        <span className={styles.second} aria-hidden="true">
          Revolution
        </span>
        {ECHOES.slice(0, echoes).map((shown, i) => (
          <span
            key={i}
            className={styles.second}
            style={{ "--shown": shown, "--i": i + 2 } as CSSProperties}
            aria-hidden="true"
          >
            Revolution
          </span>
        ))}
      </h1>
      {children}
    </div>
  );
}
