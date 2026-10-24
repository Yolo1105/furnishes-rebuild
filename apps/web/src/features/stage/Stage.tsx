import { LivingGradient } from "./LivingGradient";
import styles from "./Stage.module.css";
import { WASH_CSS } from "./wash";

/**
 * A full-height section on the site's moving orange-to-cream wash. Whatever
 * is passed in sits above the background, centred and clear of the bar.
 */
export function Stage({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    // The CSS wash shows until the canvas draws, and stays if WebGL is unavailable.
    <section className={styles.stage} aria-label={label} style={{ backgroundImage: WASH_CSS }}>
      <LivingGradient />
      {children ? <div className={styles.content}>{children}</div> : null}
    </section>
  );
}
