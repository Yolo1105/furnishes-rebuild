import type { Metadata } from "next";
import Image from "next/image";
import room from "../../../../public/rooms/a-frame-living-room.jpg";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Test", robots: { index: false } };

/** A bare test page: the bar over a photo of a living room (the live site's picture after "every room feels"). */
export default function TestPage() {
  return (
    // a light picture: the bar turns rust over it (SiteHeader)
    <section className={styles.room} aria-label="Test" data-light-under-bar>
      <div className={styles.frame}>
        <Image
          src={room}
          alt="A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
          fill
          priority
          // the original file, untouched: re-encoding softens it, and it is only 2000 px wide to begin with
          unoptimized
          placeholder="blur"
          className={styles.photo}
        />
      </div>
    </section>
  );
}
