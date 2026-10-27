import { Backdrop } from "./Backdrop";
import styles from "./Stage.module.css";

/**
 * A full-height section on the site's background (Backdrop). Whatever is
 * passed in sits above it, centred and clear of the bar.
 */
export function Stage({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <section className={styles.stage} aria-label={label}>
      <Backdrop />
      {children ? <div className={styles.content}>{children}</div> : null}
    </section>
  );
}
