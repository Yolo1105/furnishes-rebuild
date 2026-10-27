import { LivingGradient } from "./LivingGradient";
import styles from "./Backdrop.module.css";
import { WASH_CSS } from "./wash";

/**
 * Which background the site's stages stand on:
 * - "wash": the live site's orange-to-cream wash, alive (LivingGradient);
 * - "peach": the playground's (furnishes-playground) cream-to-peach diagonal
 *   with three soft light blobs drifting over it. Light, so it marks itself
 *   data-light-backdrop and the bar turns to dark ink.
 * Flip it here to switch every stage at once.
 */
const BACKDROP: "wash" | "peach" = "peach";

/** The background, filling its (positioned) parent. */
export function Backdrop() {
  if (BACKDROP === "wash") {
    return (
      // The CSS wash shows until the canvas draws, and stays if WebGL is unavailable.
      <div className={styles.layer} style={{ backgroundImage: WASH_CSS }}>
        <LivingGradient />
      </div>
    );
  }
  return (
    <div className={`${styles.layer} ${styles.peach}`} data-light-backdrop aria-hidden="true">
      <span className={`${styles.blob} ${styles.one}`} />
      <span className={`${styles.blob} ${styles.two}`} />
      <span className={`${styles.blob} ${styles.three}`} />
    </div>
  );
}
