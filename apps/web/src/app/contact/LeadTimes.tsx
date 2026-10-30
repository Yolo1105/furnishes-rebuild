import type { CSSProperties } from "react";
import { EMAIL } from "@/lib/contact";
import { Dimension } from "../studio/Dimension";
import { LEAD_TIMES, LEAD_TIMES_AS_OF, WEEK_STEP, WEEKS } from "./leadTimeList";
import styles from "./LeadTimes.module.css";

const at = (weeks: number) => ({ "--at": weeks / WEEKS }) as CSSProperties;

/**
 * The last word on the dark: on the left the call to get lead times by
 * email (there is no list to join yet, so it writes to us); on the right the
 * lead times now, each a dimension along a scale of weeks, the usual wait
 * solid and the long end dashed.
 */
export function LeadTimes() {
  return (
    <section className={styles.band} aria-labelledby="lead-title">
      <div className={styles.call}>
        <p className={styles.mono}>
          <span>Newsletter</span>
        </p>
        <h2 id="lead-title" className={styles.title}>
          Lead times, by email
        </h2>
        <p className={styles.lede}>Sourcing lead times, updated each quarter. Nothing else.</p>
        <form className={styles.form} action={`mailto:${EMAIL}`} method="get">
          <input type="hidden" name="subject" value="Lead times by email" />
          <label className={styles.field}>
            <span className={styles.mono}>Email</span>
            <input
              className={styles.input}
              type="email"
              name="body"
              required
              autoComplete="email"
              placeholder="For example alex@example.com"
            />
          </label>
          <button type="submit" className={styles.button}>
            Get lead times by email
          </button>
        </form>
      </div>

      <figure className={styles.chart}>
        <figcaption className={`${styles.mono} ${styles.caption}`}>
          <span>Lead times in Singapore</span>
          <span>
            As of <time dateTime={LEAD_TIMES_AS_OF.iso}>{LEAD_TIMES_AS_OF.shown}</time>
          </span>
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
              {"note" in t ? (
                <dd className={styles.mono}>{t.note}</dd>
              ) : (
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
              )}
            </div>
          ))}
        </dl>
        <p className={`${styles.mono} ${styles.key}`}>Solid is the usual wait, dashed is how long it can run</p>
      </figure>
    </section>
  );
}
