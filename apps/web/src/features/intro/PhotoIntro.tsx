"use client";

import { type CSSProperties, useEffect, useId, useState } from "react";
import type { StaticImageData } from "next/image";
import { useLoaderDone } from "@/features/loader/useLoaderDone";
import { HeroTitle } from "@/features/stage/HeroTitle";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room (or several in
 * turn) filling the screen, and along its foot a band of the page's paper
 * with the title cut out of it from edge to edge, the photos showing through
 * its letters, and one quiet line over it: the room in view, and the
 * slogan. On phones the words sit on the photo at the bottom left instead,
 * the title on two lines. As the
 * page scrolls (PlanWalk sets --title and --photo) the words go, then the
 * photo fades straight to the plan of one room beneath; from there
 * PlanWalk's side panel tells the rest.
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
  // the first photo is the one seen first: none turns while the loader covers it
  const loaderDone = useLoaderDone();
  useEffect(() => {
    if (!loaderDone || count < 2 || window.matchMedia(REDUCED).matches) return;
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
  }, [count, loaderDone]);
  return { photo, words };
}

/** The ink that reads on a part of a photo: cream where it is dark, rust where it is bright. */
type Ink = "cream" | "rust";

/**
 * A room for the opening: the photo (2000 x 1334), its caption, and the ink
 * that reads on it under the bar, and, on phones, under the title and the
 * small words at its foot.
 */
export type IntroPhoto = { src: StaticImageData; caption: string; ink: { bar: Ink; title: Ink; small: Ink } };

/**
 * The knockout title's drawing: "Interior Revolution" in Jost Light at 100
 * units, set to TITLE_W units wide, its caps TITLE_H tall.
 */
const TITLE_W = 975;
const TITLE_H = 72;
/** How far the band's paper reaches past the title's drawing, in its units. */
const PAST = 2000;


/** `photos`: the room shown, or the rooms shown in turn. */
export function PhotoIntro({ photos }: { photos: IntroPhoto[] }) {
  const { photo, words } = useRotation(photos.length);
  const { caption, ink } = photos[words]!;
  const cut = useId();
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
      <div className={styles.words} data-title={ink.title} data-small={ink.small}>
        {/* one quiet line with the title: the room in view, and the slogan */}
        <p className={styles.info}>
          <span className={styles.slogan}>Made for your room, to the millimetre</span>
          <span className={styles.dot}> · </span>
          <span className={styles.caption}>{caption}</span>
        </p>
        <div className={styles.headline}>
          <HeroTitle />
        </div>
        {/* on larger screens the title is cut out of the band, the photos showing through its letters */}
        <svg className={styles.cut} viewBox={`0 0 ${TITLE_W} ${TITLE_H}`} aria-hidden="true">
          {/* the paper reaches well past the drawing on every side, so it fills the whole band (which clips it) */}
          <mask id={cut} maskUnits="userSpaceOnUse" x={-PAST} y={-PAST} width={TITLE_W + 2 * PAST} height={TITLE_H + 2 * PAST}>
            <rect x={-PAST} y={-PAST} width={TITLE_W + 2 * PAST} height={TITLE_H + 2 * PAST} fill="white" />
            <text x="0" y={TITLE_H} textLength={TITLE_W} lengthAdjust="spacing" fill="black">
              INTERIOR REVOLUTION
            </text>
          </mask>
          <rect x={-PAST} y={-PAST} width={TITLE_W + 2 * PAST} height={TITLE_H + 2 * PAST} mask={`url(#${cut})`} />
        </svg>
      </div>
    </div>
  );
}
