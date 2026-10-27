import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";
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

/**
 * With more than one photo, each holds for HOLD_S then crossfades into the
 * next over FADE_S, round and round (the live site's carousel pace). The
 * keyframes in the CSS are cut for SLIDES photos at this pace.
 */
const HOLD_S = 5;
const FADE_S = 1.6;
const SLIDES = 5;

/** `photos`: the room shown, or (exactly SLIDES of them) the rooms shown in turn. All 2000 px wide, at least 1334 tall. */
export function PhotoIntro({ photos = [room] }: { photos?: StaticImageData[] }) {
  const rotating = photos.length > 1;
  if (rotating && photos.length !== SLIDES) throw new Error(`PhotoIntro rotates exactly ${SLIDES} photos`);
  const pace = { "--hold": `${HOLD_S}s`, "--fade": `${FADE_S}s` } as CSSProperties;
  return (
    // a light picture under the bar (PlanWalk clears it once the photo has gone); the wordmark at the bar's left
    <div className={styles.intro} data-intro data-light-under-bar data-wordmark-left data-rotating={rotating || undefined} style={pace}>
      <div className={styles.scene}>
        <svg
          className={styles.room}
          viewBox={`0 ${CEILING} 2000 ${1334 - CEILING}`}
          role="img"
          aria-label={
            rotating
              ? "Bright, lived-in rooms, one after another"
              : "A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
          }
        >
          <g className={styles.photo}>
            {photos.map((photo, i) => (
              <image key={photo.src} className={styles.slide} href={photo.src} width="2000" height="1334" style={{ "--i": i } as CSSProperties} />
            ))}
          </g>
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
