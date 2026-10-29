import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: first a screen of the room photos, turning on their own, with
 * the headline at the bottom left; then a screen of the peach backdrop.
 */
export default function Home() {
  return (
    <main>
      <div className={styles.hero}>
        <PhotoRotation photos={PHOTOS} />
        <h1 className={styles.title}>
          <span className="visually-hidden">Furnishes: </span>
          Design your room
        </h1>
      </div>
      <div className={styles.peach} aria-hidden="true">
        <span className={styles.glow} />
        <span className={styles.glow} />
        <span className={styles.glow} />
      </div>
    </main>
  );
}
