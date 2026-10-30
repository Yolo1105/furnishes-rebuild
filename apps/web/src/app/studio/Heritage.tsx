import Link from "next/link";
import { routes } from "@/lib/routes";
import { HERITAGE, HERITAGE_STEPS } from "./heritageCopy";
import styles from "./Heritage.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The heritage band, after the questions, as furnishes_prod's homepage has
 * it: over the page's own peach, the bracketed call to start a project over
 * the heading on the left, its two paragraphs on the right, then the
 * studio's history as a ruled list, each step opening to its words (the
 * first open), its arrow turning down while it is.
 */
export function Heritage() {
  return (
    <section className={styles.band} aria-labelledby="heritage-title">
      <div className={`${styles.head} reveal`}>
        <Link href={routes.contact} className={styles.call}>
          <span className={styles.bracket} aria-hidden="true">
            [
          </span>
          {HERITAGE.call}
          <span className={styles.bracket} aria-hidden="true">
            ]
          </span>
        </Link>
        <h2 id="heritage-title" className={styles.title}>
          <span className={styles.titleFirst}>{HERITAGE.heading}</span>
          <span className={styles.titleSecond}>
            <span className={styles.we}>{HERITAGE.we}</span>
            {HERITAGE.rest}
          </span>
        </h2>
        <div className={styles.tagline}>
          {HERITAGE.tagline.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <div className={styles.list}>
        {HERITAGE_STEPS.map((s, i) => (
          <details key={s.title} className={`${styles.item} reveal`} open={i === 0}>
            <summary className={styles.summary}>
              <span className={styles.code}>{pad(i + 1)}</span>
              <span className={styles.step}>{s.title}</span>
              <span className={styles.code}>{s.tag}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </summary>
            <p className={styles.body}>{s.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
