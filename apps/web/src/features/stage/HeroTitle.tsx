import type { ReactNode } from "react";
import styles from "./HeroTitle.module.css";

/**
 * The landing's title, as on the live site: "Interior Revolution" in wide
 * hairline caps in rust, its second word a shade fainter, each line rising
 * in after the one above. It sits at the top left of whatever stage it is
 * on, lined up with the bar's first link; a stage may fade it by setting
 * --title. Anything passed as children sits right under it, and moves and
 * fades with it.
 */
export function HeroTitle({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title} aria-label="Interior Revolution">
        <span className={styles.first} aria-hidden="true">
          Interior
        </span>
        <span className={styles.second} aria-hidden="true">
          Revolution
        </span>
      </h1>
      {children}
    </div>
  );
}
