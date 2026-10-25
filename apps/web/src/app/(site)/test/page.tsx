import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import button from "@/features/plan/InkButton.module.css";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { routes } from "@/lib/routes";
import room from "../../../../public/rooms/a-frame-living-room.jpg";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Test", robots: { index: false } };

/** A bare test page: the bar and the landing's title over a photo of a living room (the live site's picture after "every room feels"). */
export default function TestPage() {
  return (
    // a light picture, so the bar turns rust over it; and the wordmark at the bar's left (SiteHeader)
    <section
      className={styles.room}
      aria-label="Test"
      data-light-under-bar
      data-wordmark-left
    >
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
      <HeroTitle>
        <p className={styles.slogan}>Made for your room, to the millimetre.</p>
        <Link
          href={routes.studio}
          className={`${button.button} ${styles.start}`}
        >
          Explore your journey
        </Link>
      </HeroTitle>
      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </section>
  );
}
