import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { StudioView } from "./StudioView";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/** The studio: the room photos and the flat's floor plan side by side, over the peach. */
export default function Studio() {
  return (
    <main className={styles.split}>
      <h1 className="visually-hidden">Design your room</h1>
      <PeachBackdrop />
      <StudioView />
    </main>
  );
}
