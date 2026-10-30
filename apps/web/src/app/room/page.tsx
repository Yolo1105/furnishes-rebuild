import type { Metadata } from "next";
import Image from "next/image";
import posterStudyRoom from "@/assets/poster-study-room.jpg";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Room" };

/** The room photo, a screen tall, under the bar, sent as its original file. */
export default function Room() {
  return (
    <main className={styles.page}>
      <h1 className="visually-hidden">Room</h1>
      <Image
        src={posterStudyRoom}
        alt="A narrow study with orange curtains, a wooden desk, two red armchairs and film posters on a blue wall"
        fill
        priority
        unoptimized
        sizes="100vw"
        className={styles.photo}
      />
    </main>
  );
}
