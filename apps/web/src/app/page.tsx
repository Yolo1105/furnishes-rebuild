import Link from "next/link";
import { routes } from "@/lib/routes";
import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/**
 * The landing: the room photos, one screen at a time, turning on their own;
 * along the bottom, the headline at the left, and what we do with the way in
 * at the right.
 */
export default function Home() {
  return (
    <main className={styles.main}>
      <PhotoRotation photos={PHOTOS} />
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className="visually-hidden">Furnishes: </span>
          Design your room
        </h1>
        <div className={styles.aside}>
          <p className={styles.lede}>Modular furniture you can see in your own home before you buy it.</p>
          <Link href={routes.studio} className={styles.cta}>
            Start designing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
