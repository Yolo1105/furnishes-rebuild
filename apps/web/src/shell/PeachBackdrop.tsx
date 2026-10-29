import styles from "./PeachBackdrop.module.css";

/** The peach backdrop, filling the screen behind a page. */
export function PeachBackdrop() {
  return (
    <div className={styles.peach} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.glow} />
      <span className={styles.glow} />
    </div>
  );
}
