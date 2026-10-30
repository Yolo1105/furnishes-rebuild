import Image from "next/image";
import { CASES } from "./cases";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./CaseSheets.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The everyday cases, after the tour, set out like the sheets of a drawing
 * set: an index line over them, then a card for each, its kind, what it runs
 * between on a dimension line, its number, its headline and words, and its
 * sheet number and call at the foot. Pointing at one brings its room's photo
 * up behind it, under a warm wash, and its words turn cream.
 */
export function CaseSheets() {
  return (
    <section className={styles.cases} aria-labelledby="cases-title">
      <header className={`${styles.index} reveal`}>
        <span>C-00</span>
        <h2 id="cases-title" className={styles.indexTitle}>
          Everyday cases
        </h2>
        <span className={styles.count}>{pad(CASES.length)} cases</span>
      </header>
      <ol className={styles.sheets}>
        {CASES.map((c, i) => {
          const photo = ROOM_PHOTOS.find((p) => p.room === c.room);
          return (
            <li key={c.kind} className={`${styles.sheet} reveal`}>
              {photo && (
                <Image
                  className={styles.photo}
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  placeholder="blur"
                />
              )}
              <p className={styles.kind}>{c.kind}</p>
              {/* what the case runs between, as a dimension on the plan */}
              <p className={styles.span}>
                <span className={styles.spanLabel}>{c.span}</span>
              </p>
              <p className={styles.number} aria-hidden="true">
                {pad(i + 1)}
              </p>
              <h3 className={styles.title}>{c.title}</h3>
              <p className={styles.body}>{c.body}</p>
              <footer className={styles.foot}>
                <span>C-{pad(i + 1)}</span>
                <span>{c.call}</span>
              </footer>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
