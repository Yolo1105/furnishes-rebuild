import styles from "./HeroTitle.module.css";

/**
 * The landing's title, as on the live site: "Interior Revolution" in
 * Archivo caps in rust. "Interior" is a hairline at its widest; "Revolution"
 * a shade fainter, a little heavier and narrower, so the two words differ in
 * weight as well as size and come out about as wide as each other. Each line
 * rises in after the one above. Or, `line`, both words on one line at one
 * size, the contrast all in their weight. It sets only the type: where it
 * sits is the page's to say, and a page may ink it (--hero-ink,
 * --hero-ink-strong).
 */
export function HeroTitle({ line = false }: { line?: boolean }) {
  return (
    <h1 className={`${styles.title} ${line ? styles.line : ""}`} aria-label="Interior Revolution">
      <span className={styles.first} aria-hidden="true">
        Interior
      </span>
      <span className={styles.second} aria-hidden="true">
        Revolution
      </span>
    </h1>
  );
}
