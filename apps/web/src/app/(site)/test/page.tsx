import type { Metadata } from "next";
import Image from "next/image";
import { HeroTitle } from "@/features/stage/HeroTitle";
import room from "../../../../public/rooms/living-room.jpg";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Test", robots: { index: false } };

/** A bare test page: the bar and the landing's title over a photo of a living room. */
export default function TestPage() {
  return (
    <section className={styles.room} aria-label="Test">
      <Image
        src={room}
        alt="A living room: a red sofa and an olive armchair round a dark coffee table, under a floor lamp"
        fill
        priority
        // the original file, untouched: re-encoding softens it, and it is only 2000 px wide to begin with
        unoptimized
        placeholder="blur"
        className={styles.photo}
      />
      <HeroTitle tone="cream" />
    </section>
  );
}
