import styles from "./PeachBackdrop.module.css";

/**
 * The peach backdrop, filling the screen behind a page, with the old
 * landing's grain over it: a fine grey noise and warm orange flecks.
 */
export function PeachBackdrop() {
  return (
    <div className={styles.peach} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.glow} />
      <span className={styles.glow} />
      <span className={styles.underBar} />
      <svg className={styles.grain} preserveAspectRatio="none">
        <filter id="peach-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#peach-grain)" />
      </svg>
      <svg className={styles.flecks} preserveAspectRatio="none">
        <filter id="peach-flecks" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          {/* the noise's lightness kept only at its brightest, as orange */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.86
                    0 0 0 0 0.39
                    0 0 0 0 0.08
                    0.5 0.5 0.5 0 -0.82"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#peach-flecks)" />
      </svg>
    </div>
  );
}
