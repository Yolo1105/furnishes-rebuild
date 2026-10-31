import { HERITAGE, HERITAGE_STEPS } from "./heritageCopy";
import styles from "./Heritage.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The story band, after the factory: over the page's own peach, the index
 * line over the heading on the left, its words on the right, then the
 * company's story as a ruled list, each step opening to its words (the first open), a plus
 * turning to a cross while it is.
 */
export function Heritage() {
  return (
    <section className={styles.band} aria-labelledby="heritage-title">
      <div className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Our story</span>
        </p>
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
              <span className={styles.mark} aria-hidden="true" />
            </summary>
            <p className={styles.body}>{s.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
