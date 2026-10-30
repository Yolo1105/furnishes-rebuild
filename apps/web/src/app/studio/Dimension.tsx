import styles from "./Dimension.module.css";

/**
 * A drawing's dimension line, in orange: a line across its box with a tick
 * at each end, and `label`, if given, breaking it in the middle.
 * `dashed` for a stretch that may or may not be needed.
 */
export function Dimension({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <span className={styles.dimension} data-dashed={dashed || undefined}>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
