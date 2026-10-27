"use client";

import { type CSSProperties, useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import button from "@/ui/InkButton.module.css";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { routes } from "@/lib/routes";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room (or several in
 * turn) filling the screen, dimmed a little and evenly so cream type reads
 * on any of them, and on it the live site's greeting under the bar and, at
 * the foot, the title with a row of what Furnishes does and the way in under
 * it. As the page scrolls (PlanWalk sets --title and --photo) the words go,
 * then the photo fades straight to the plan of one room beneath; from there
 * PlanWalk's side panel tells the rest.
 */

/** Where the ceiling meets the window wall, in the photos' own pixels (2000 x 1334): they are shown from just below it. */
const CEILING = 260;

/** What Furnishes does, as the live site's landing tags it. */
const TAGS = ["AI interiors", "3D layouts", "Custom pieces"] as const;

/**
 * With more than one photo, each holds for ROTATE_MS, then crossfades into
 * the next over FADE_MS (the live site's carousel pace).
 */
const ROTATE_MS = 5000;
const FADE_MS = 1600;

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Which photo is in view. */
function useRotation(count: number) {
  const [photo, setPhoto] = useState(0);
  useEffect(() => {
    if (count < 2 || window.matchMedia(REDUCED).matches) return;
    const turn = window.setInterval(() => setPhoto((i) => (i + 1) % count), ROTATE_MS);
    return () => window.clearInterval(turn);
  }, [count]);
  return photo;
}

/** `photos`: the room shown, or the rooms shown in turn. All 2000 x 1334. */
export function PhotoIntro({ photos = [room] }: { photos?: StaticImageData[] }) {
  const photo = useRotation(photos.length);
  return (
    // the bar sits over the dimmed photo until it has gone; the wordmark at the bar's left
    <div
      className={styles.intro}
      data-intro
      data-dark-under-bar
      data-wordmark-left
      style={{ "--fade": `${FADE_MS}ms` } as CSSProperties}
    >
      <div className={styles.frame}>
        <svg
          className={styles.room}
          viewBox={`0 ${CEILING} 2000 ${1334 - CEILING}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={
            photos.length > 1
              ? "Bright, lived-in rooms, one after another"
              : "A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
          }
        >
          {photos.map((src, i) => (
            <image key={src.src} className={styles.slide} href={src.src} width="2000" height="1334" data-active={i === photo || undefined} />
          ))}
        </svg>
      </div>

      <p className={styles.greeting}>
        Hello<span className={styles.accent}>!</span> Welcome h<span className={styles.accent}>o</span>me
        <span className={styles.accent}>.</span>
      </p>
      <div className={styles.foot}>
        <HeroTitle />
        <div className={styles.details}>
          <p className={styles.slogan}>Made for your room, to the millimetre.</p>
          <ul className={styles.tags}>
            {TAGS.map((tag, i) => (
              <li key={tag} style={{ "--i": i } as CSSProperties}>
                <span className={styles.accent}>#</span>
                {tag}
              </li>
            ))}
          </ul>
          <Link href={routes.studio} className={`${button.button} ${styles.start}`}>
            Explore your journey
          </Link>
        </div>
      </div>

      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </div>
  );
}
