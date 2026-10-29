import Link from "next/link";
import { routes } from "@/lib/routes";
import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own,
 * with what we do and where to start at the bottom left.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className="visually-hidden">Furnishes: Interior Revolution</h1>
      <PhotoRotation photos={PHOTOS} />
      <div className={styles.intro}>
        <p className={styles.lede}>Modular furniture you can see in your own home before you buy it.</p>
        <div className={styles.actions}>
          <Link href={routes.studio} className={styles.button}>
            Design your room
          </Link>
          <Link href={routes.collection} className={styles.link}>
            Browse the collection
          </Link>
        </div>
      </div>
    </main>
  );
}
