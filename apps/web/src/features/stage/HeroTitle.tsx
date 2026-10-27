import styles from "./HeroTitle.module.css";

/**
 * The landing's title: "Interior Revolution" on one line, in Jost Thin caps
 * in rust, every o in the orange, as the live site marks the o of "home".
 * Each word rises in after the one before; on phones held upright the words
 * stack. It sets only the type: where it sits and how large is the page's to
 * say (--text-hero), and a page may ink it (--hero-ink).
 */
export function HeroTitle() {
  return (
    <h1 className={styles.title} aria-label="Interior Revolution">
      <span className={styles.word} aria-hidden="true">
        Interi<span className={styles.accent}>o</span>r
      </span>
      <span className={styles.word} aria-hidden="true">
        Rev<span className={styles.accent}>o</span>luti<span className={styles.accent}>o</span>n
      </span>
    </h1>
  );
}
