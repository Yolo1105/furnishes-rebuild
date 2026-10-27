import styles from "./HeroTitle.module.css";

/**
 * The landing's title: "Interior / Revolution" on two lines, in Jost Light
 * caps in rust, closed with a full stop in the orange, the one mark of it,
 * as the live site closes "Welcome home." Each word rises in after the one
 * before. It sets only the type: where it sits and how large is the page's
 * to say (--text-hero), and a page may ink it (--hero-ink).
 */
export function HeroTitle() {
  return (
    <h1 className={styles.title} aria-label="Interior Revolution">
      <span className={styles.word} aria-hidden="true">
        Interior
      </span>
      <span className={styles.word} aria-hidden="true">
        Revolution<span className={styles.stop}>.</span>
      </span>
    </h1>
  );
}
