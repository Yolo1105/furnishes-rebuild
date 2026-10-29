import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own,
 * with "Interior Revolution" set large along the bottom left.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <PhotoRotation photos={PHOTOS} />
      <h1 className={styles.title}>
        <span className="visually-hidden">Furnishes: </span>
        Interior Rev<span className={styles.accent}>o</span>lution
      </h1>
    </main>
  );
}
