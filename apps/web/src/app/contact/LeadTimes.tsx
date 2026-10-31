import type { CSSProperties } from "react";
import { EMAIL } from "@/lib/contact";
import { Dimension } from "../studio/Dimension";
import { LEAD_TIMES, WEEK_STEP, WEEKS } from "./leadTimeList";
import styles from "./LeadTimes.module.css";

const at = (weeks: number) => ({ "--at": weeks / WEEKS }) as CSSProperties;

/**
 * The last word on the dark: on the left a line and a call to ask by email;
 * on the right the lead times, each a dimension along a scale of weeks, the usual wait
 * solid and the long end dashed.
 */
export function LeadTimes() {
  return (
    <section className={styles.band} aria-labelledby="lead-title">
      <div className={styles.call}>
        <p className={styles.mono}>
          <span>Lead times</span>
        </p>
        <h2 id="lead-title" className={styles.title}>
          How long it takes
        </h2>
        <p className={styles.lede}>From the day you order to the day it reaches you in Singapore. Your order confirms the time for your piece.</p>
        <a className={styles.button} href={`mailto:${EMAIL}?subject=${encodeURIComponent("Lead times")}`}>
          Ask about a piece
        </a>
      </div>

      <figure className={styles.chart}>
        <figcaption className={`${styles.mono} ${styles.caption}`}>
          <span>Lead times in Singapore</span>
          <span>Estimates</span>
        </figcaption>
        <div className={styles.row} aria-hidden="true">
          <span className={styles.mono}>Weeks</span>
          <span className={styles.scale}>
            {Array.from({ length: WEEKS / WEEK_STEP + 1 }, (_, i) => (
              <span key={i} className={`${styles.mono} ${styles.week}`} style={at(i * WEEK_STEP)}>
                {i * WEEK_STEP}
              </span>
            ))}
          </span>
        </div>
        <dl className={styles.list}>
          {LEAD_TIMES.map((t) => (
            <div key={t.name} className={styles.row}>
              <dt className={styles.name}>{t.name}</dt>
              <dd className={styles.scale}>
                <span className={`${styles.mono} ${styles.range}`}>
                  {t.from} to {t.to} weeks
                </span>
                <span className={styles.bars} aria-hidden="true">
                  <span className={styles.bar} style={at(t.from)}>
                    <Dimension />
                  </span>
                  <span className={styles.bar} style={at(t.to - t.from)}>
                    <Dimension dashed />
                  </span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={`${styles.mono} ${styles.key}`}>Solid is the usual wait, dashed is how long it can run</p>
      </figure>
    </section>
  );
}
