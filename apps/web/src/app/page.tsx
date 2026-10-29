import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: first a screen of the room photos, turning on their own, with
 * the headline at the bottom left; then a plain screen in the page's colour.
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
      <div className={styles.plain} />
    </main>
  );
}
