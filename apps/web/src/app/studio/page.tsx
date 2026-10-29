import type { Metadata } from "next";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { RoomPhotos } from "./RoomPhotos";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/** The studio: the room photos on the left, changed by hand, and the flat's floor plan on the right, over the peach. */
export default function Studio() {
  return (
    <main className={styles.split}>
      <h1 className="visually-hidden">Design your room</h1>
      <PeachBackdrop />
      <div className={styles.photo}>
        <RoomPhotos photos={ROOM_PHOTOS} />
      </div>
      <div className={styles.plan}>
        <FloorPlan />
      </div>
    </main>
  );
}
