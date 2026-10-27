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
 * The walk's opening, laid over it: a photo of a real room, the live site's
 * greeting, the title, what Furnishes does and the way in. As the page scrolls (PlanWalk sets --intro, 0 to 1) the title
 * goes, then the photo fades straight to the plan of one room beneath; from
 * there PlanWalk's side panel tells the rest (01 the room, 02 the whole
 * flat as it grows in round it, and on).
 */

/** Where the ceiling meets the window wall, in the photo's own pixels (2000 x 1334): the photo is shown from just below it. */
const CEILING = 260;

/** What Furnishes does, as the live site's landing tags it. */
const TAGS = ["AI interiors", "3D layouts", "Custom pieces"] as const;

/** A room for the opening: the photo, where it has plain space for the title, and how to ink the title on it. */
export type IntroPhoto = {
  src: StaticImageData;
  /** Its plain area: top left (as the bar's links), top right, or bottom left. */
  spot: "left" | "right" | "bottom";
  /** "ink" (the rust) on a light photo; "light" (cream) on a dark one. */
  tone: "ink" | "light";
};

const A_FRAME: IntroPhoto = { src: room, spot: "left", tone: "ink" };

/**
 * With more than one photo, each holds for ROTATE_MS then crossfades into
 * the next over FADE_MS (the live site's carousel pace). At each turn the
 * title steps out over SWAP_MS, moves to the next photo's spot, and comes
 * back in as that photo fades up.
 */
const ROTATE_MS = 5000;
const FADE_MS = 1600;
const SWAP_MS = 400;

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Which photo is in view, and whether the title is between spots. */
function useRotation(count: number) {
  const [active, setActive] = useState(0);
  const [swapping, setSwapping] = useState(false);
  useEffect(() => {
    if (count < 2 || window.matchMedia(REDUCED).matches) return;
    let swap = 0;
    const turn = window.setInterval(() => {
      setSwapping(true);
      swap = window.setTimeout(() => {
        setActive((i) => (i + 1) % count);
        setSwapping(false);
      }, SWAP_MS);
    }, ROTATE_MS);
    return () => {
      window.clearInterval(turn);
      window.clearTimeout(swap);
    };
  }, [count]);
  return { active, swapping };
}

/** `photos`: the room shown, or the rooms shown in turn. All 2000 px wide, at least 1334 tall. */
export function PhotoIntro({ photos = [A_FRAME] }: { photos?: IntroPhoto[] }) {
  const rotating = photos.length > 1;
  const { active, swapping } = useRotation(photos.length);
  const shown = photos[active]!;
  const pace = { "--fade": `${FADE_MS}ms`, "--swap": `${SWAP_MS}ms` } as CSSProperties;
  return (
    // a light picture under the bar (PlanWalk clears it once the photo has gone); the wordmark at the bar's left
    <div
      className={styles.intro}
      data-intro
      data-light-under-bar
      data-wordmark-left
      data-spot={shown.spot}
      data-tone={shown.tone}
      data-swapping={swapping || undefined}
      style={pace}
    >
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
            {photos.map(({ src }, i) => (
              <image key={src.src} className={styles.slide} href={src.src} width="2000" height="1334" data-active={i === active || undefined} />
            ))}
          </g>
        </svg>
      </div>
      <div className={`${styles.hero} ${styles.textSwap}`}>
        <HeroTitle
          greeting={
            <p className={styles.greeting}>
              Hello<span className={styles.accent}>!</span> Welcome h<span className={styles.accent}>o</span>me
              <span className={styles.accent}>.</span>
            </p>
          }
        >
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
        </HeroTitle>
      </div>
      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </div>
  );
}
