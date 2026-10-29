import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own,
 * with "Interior Revolution" set large at the bottom left, a word to a line.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <PhotoRotation photos={PHOTOS} />
      <h1 className={styles.title}>
        <span className="visually-hidden">Furnishes: </span>
        <span className={styles.line}>Interior</span>{" "}
        <span className={styles.line}>Revolution</span>
      </h1>
    </main>
  );
}
