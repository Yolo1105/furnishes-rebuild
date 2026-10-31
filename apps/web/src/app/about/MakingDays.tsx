import type { CSSProperties } from "react";
import { MAKING_DAYS, MAKING_HEADLINE, MAKING_LINE } from "./aboutCopy";
import styles from "./MakingDays.module.css";

/**
 * A piece's way from order to door, after how it is made: the headline (its
 * second line softer) on the left, a line on the right, then the days along
 * a rule. As the band scrolls through, the rule draws across and each step
 * lights up in turn (`--i`, its place); where that is not supported, or
 * less motion is asked for, all of it is simply there.
 */
export function MakingDays() {
  return (
    <section className={styles.making} aria-labelledby="making-title">
      <header className={styles.head}>
        <p className={styles.index}>
          <span>Your order</span>
        </p>
        <h2 id="making-title" className={styles.title}>
          <span className={styles.lead}>{MAKING_HEADLINE.lead}</span>
          <span className={styles.soft}>{MAKING_HEADLINE.soft}</span>
        </h2>
        <p className={styles.line}>{MAKING_LINE}</p>
      </header>
      <ol className={styles.days} style={{ "--count": MAKING_DAYS.length } as CSSProperties}>
        {MAKING_DAYS.map((d, i) => (
          <li key={d.day} className={styles.day} style={{ "--i": i } as CSSProperties}>
            <p className={styles.dayNo}>Step {d.day}</p>
            <h3 className={styles.dayTitle}>{d.title}</h3>
            <p className={styles.body}>{d.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
