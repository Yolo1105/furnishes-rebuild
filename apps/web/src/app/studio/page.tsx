import type { Metadata } from "next";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { FLAT, FLOOR_AREA } from "@/features/plan/flat";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { RoomPhotos } from "./RoomPhotos";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/**
 * The studio: the room photos on the left, changed by hand, and the flat's
 * floor plan on the right, over the peach, headed by its name and size.
 */
export default function Studio() {
  return (
    <main className={styles.split}>
      <h1 className="visually-hidden">Design your room</h1>
      <PeachBackdrop />
      <div className={styles.photo}>
        <RoomPhotos photos={ROOM_PHOTOS} />
      </div>
      <section className={styles.plan} aria-labelledby="flat-name">
        <header className={styles.head}>
          <h2 id="flat-name" className={styles.big}>
            {FLAT.name}
          </h2>
          <p className={`${styles.big} ${styles.end}`}>
            {FLOOR_AREA} m<sup>2</sup>
          </p>
          <p className={styles.small}>{FLAT.rooms}</p>
          <p className={`${styles.small} ${styles.end}`}>Sleeps {FLAT.sleeps}</p>
        </header>
        <div className={styles.drawing}>
          <FloorPlan />
        </div>
      </section>
    </main>
  );
}
