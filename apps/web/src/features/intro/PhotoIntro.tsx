import Link from "next/link";
import button from "@/ui/InkButton.module.css";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { routes } from "@/lib/routes";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room, the title and
 * the way in. As the page scrolls (PlanWalk sets --intro, 0 to 1) the title
 * goes, then the photo fades straight to the plan of one room beneath; from
 * there PlanWalk's side panel tells the rest (01 the room, 02 the whole
 * flat as it grows in round it, and on).
 */

/** Where the ceiling meets the window wall, in the photo's own pixels (2000 x 1334): the photo is shown from just below it. */
const CEILING = 260;

export function PhotoIntro() {
  return (
    // a light picture under the bar (PlanWalk clears it once the photo has gone); the wordmark at the bar's left
    <div className={styles.intro} data-intro data-light-under-bar data-wordmark-left>
      <div className={styles.scene}>
        <svg
          className={styles.room}
          viewBox={`0 ${CEILING} 2000 ${1334 - CEILING}`}
          role="img"
          aria-label="A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
        >
          <image className={styles.photo} href={room.src} width="2000" height="1334" />
        </svg>
      </div>
      <div className={styles.hero}>
        <HeroTitle>
          <p className={styles.slogan}>Made for your room, to the millimetre.</p>
          <Link href={routes.studio} className={`${button.button} ${styles.start}`}>
            Explore your journey
          </Link>
        </HeroTitle>
      </div>
      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </div>
  );
}
