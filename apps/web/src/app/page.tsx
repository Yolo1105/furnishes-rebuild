import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own,
 * with "Interior Revolution" set huge across the bottom.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <PhotoRotation photos={PHOTOS} />
      <h1 className={styles.title}>
        <span className="visually-hidden">Furnishes: </span>
        Interior Revolution
      </h1>
    </main>
  );
}
