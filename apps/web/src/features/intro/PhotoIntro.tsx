"use client";

import { type CSSProperties, useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import { HeroTitle } from "@/features/stage/HeroTitle";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room (or several in
 * turn) filling the screen, and along its foot the title on one line from
 * edge to edge, with one line of small words over it: the room's caption
 * at its start, the slogan at its end. As the page scrolls
 * (PlanWalk sets --title and --photo) the words go, then the photo fades
 * straight to the plan of one room beneath; from there PlanWalk's side
 * panel tells the rest.
 */

/** Where the ceiling meets the window wall, in the photos' own pixels (2000 x 1334): they are shown from just below it. */
const CEILING = 260;

/**
 * With more than one photo, each holds for ROTATE_MS, then fades into the
 * next over FADE_MS (the live site's carousel pace); the words stay.
 */
const ROTATE_MS = 5000;
const FADE_MS = 1600;

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Which photo is in view, and which one the words are set for: they switch
 * halfway through the fade, when the new photo is as much in view as the
 * old, rather than fading out and in with it.
 */
function useRotation(count: number) {
  const [photo, setPhoto] = useState(0);
  const [words, setWords] = useState(0);
  useEffect(() => {
    if (count < 2 || window.matchMedia(REDUCED).matches) return;
    let next = 0;
    let half = 0;
    const turn = window.setInterval(() => {
      next = (next + 1) % count;
      const to = next;
      setPhoto(to);
      half = window.setTimeout(() => setWords(to), FADE_MS / 2);
    }, ROTATE_MS);
    return () => {
      window.clearInterval(turn);
      window.clearTimeout(half);
    };
  }, [count]);
  return { photo, words };
}

/** The ink that reads on a part of a photo: cream where it is dark, rust where it is bright. */
type Ink = "cream" | "rust";

/**
 * A room for the opening: the photo (2000 x 1334), its caption, and the ink
 * that reads on it under the bar, under the title, and under the small words
 * over the title (the orange marks keep their orange whatever these are).
 */
export type IntroPhoto = { src: StaticImageData; caption: string; ink: { bar: Ink; title: Ink; small: Ink } };

const A_FRAME: IntroPhoto = { src: room, caption: "A-frame living room", ink: { bar: "rust", title: "rust", small: "rust" } };

/** `photos`: the room shown, or the rooms shown in turn. */
export function PhotoIntro({ photos = [A_FRAME] }: { photos?: IntroPhoto[] }) {
  const { photo, words } = useRotation(photos.length);
  const { caption, ink } = photos[words]!;
  return (
    // the bar sits over the photo until it has gone; the wordmark at the bar's left
    <div
      className={styles.intro}
      data-intro
      data-dark-under-bar
      data-wordmark-left
      data-bar={ink.bar}
      style={{ "--fade": `${FADE_MS}ms` } as CSSProperties}
    >
      <div
        className={styles.frame}
        role="img"
        aria-label={
          photos.length > 1
            ? "Bright, lived-in rooms, one after another"
            : "A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
        }
      >
        {photos.map(({ src }, i) => (
          <div key={src.src} className={styles.slide} data-active={i === photo || undefined}>
            <svg className={styles.room} viewBox={`0 ${CEILING} 2000 ${1334 - CEILING}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <image href={src.src} width="2000" height="1334" />
            </svg>
          </div>
        ))}
      </div>

      {/* the words, set for the photo in view: they stay, and switch with it */}
      <div className={styles.foot} data-title={ink.title} data-small={ink.small}>
        {/* one line over the title: the room at its start, the slogan at its end */}
        <div className={styles.info}>
          <p className={styles.caption}>{caption}</p>
          <p className={styles.slogan}>
            Made for your room, to the millimetre<span className={styles.accent}>.</span>
          </p>
        </div>
        <div className={styles.headline}>
          <HeroTitle line />
        </div>
      </div>
    </div>
  );
}
