import styles from "./HeroTitle.module.css";

/**
 * The landing's title, as on the live site: "Interior Revolution" in
 * Archivo caps in rust, every o in the orange, as the live site marks the o
 * of "home". Two lines, "Interior" a hairline at its widest and
 * "Revolution" a shade fainter, a little heavier and narrower; or, `line`,
 * both words on one line set alike, the same hairline, narrow and tall. Each
 * word rises in after the one before. It sets only the type: where it sits
 * is the page's to say, and a page may ink it (--hero-ink, --hero-ink-strong).
 */
export function HeroTitle({ line = false }: { line?: boolean }) {
  return (
    <h1 className={`${styles.title} ${line ? styles.line : ""}`} aria-label="Interior Revolution">
      <span className={styles.first} aria-hidden="true">
        Interi<span className={styles.accent}>o</span>r
      </span>
      <span className={styles.second} aria-hidden="true">
        Rev<span className={styles.accent}>o</span>luti<span className={styles.accent}>o</span>n
      </span>
    </h1>
  );
}
