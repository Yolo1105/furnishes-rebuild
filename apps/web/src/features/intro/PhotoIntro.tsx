"use client";

import { type CSSProperties, useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import { HeroTitle } from "@/features/stage/HeroTitle";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room (or several in
 * turn) filling the screen, each drifting slowly closer while it is in
 * view; and along its foot, on the bar's grid, a row of the slogan and the
 * room's caption and count, over the title set on one line from edge to
 * edge. As the page scrolls (PlanWalk sets --title and --photo) the words go,
 * then the photo fades straight to the plan of one room beneath; from there
 * PlanWalk's side panel tells the rest.
 */

/** Where the ceiling meets the window wall, in the photos' own pixels (2000 x 1334): they are shown from just below it. */
const CEILING = 260;

/**
 * With more than one photo, each holds for ROTATE_MS, then crossfades into
 * the next over FADE_MS (the live site's carousel pace), drifting closer
 * all the while it shows.
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

/** The ink that reads on a part of a photo: cream where it is dark, rust where it is bright. */
type Ink = "cream" | "rust";

/** A room for the opening: the photo (2000 x 1334), its caption, and the ink for the bar over its top and the words along its foot. */
export type IntroPhoto = { src: StaticImageData; caption: string; ink: { bar: Ink; foot: Ink } };

const A_FRAME: IntroPhoto = { src: room, caption: "A-frame living room", ink: { bar: "rust", foot: "cream" } };

/** `photos`: the room shown, or the rooms shown in turn. */
export function PhotoIntro({ photos = [A_FRAME] }: { photos?: IntroPhoto[] }) {
  const photo = useRotation(photos.length);
  const count = (n: number) => String(n).padStart(2, "0");
  return (
    // the bar sits over the dimmed photo until it has gone; the wordmark at the bar's left
    <div
      className={styles.intro}
      data-intro
      data-dark-under-bar
      data-wordmark-left
      data-rotating={photos.length > 1 || undefined}
      data-bar={photos[photo]!.ink.bar}
      data-foot={photos[photo]!.ink.foot}
      style={{ "--fade": `${FADE_MS}ms`, "--drift": `${ROTATE_MS + FADE_MS}ms` } as CSSProperties}
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
          {photos.map(({ src }, i) => (
            <image key={src.src} className={styles.slide} href={src.src} width="2000" height="1334" data-active={i === photo || undefined} />
          ))}
        </svg>
      </div>

      <div className={styles.foot}>
        {/* on the bar's grid: the slogan, and the room in view */}
        <div className={styles.info}>
          <p className={styles.slogan}>Made for your room, to the millimetre.</p>
          <p className={styles.caption} aria-live="polite">
            <span className={styles.counter}>
              {count(photo + 1)} / {count(photos.length)}
            </span>
            {photos[photo]!.caption}
          </p>
        </div>
        <HeroTitle line />
      </div>

    </div>
  );
}
