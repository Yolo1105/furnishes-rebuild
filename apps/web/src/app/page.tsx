import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own,
 * with the headline at the bottom left.
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
    </main>
  );
}
