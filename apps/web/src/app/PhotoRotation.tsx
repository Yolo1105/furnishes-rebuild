"use client";

import { type CSSProperties, useEffect, useState } from "react";
import Image from "next/image";
import type { PHOTOS } from "./photos";
import styles from "./PhotoRotation.module.css";

/** How long each photo holds before the next fades in, in ms. */
const HOLD_MS = 5000;
/** How long the cross-fade between two photos takes, in ms. */
const FADE_MS = 1600;
/** Sharper than Next's default of 75; must be listed in next.config's `images.qualities`. */
const PHOTO_QUALITY = 90;

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * The room photos filling the screen, one at a time, each fading into the
 * next and numbered from 1. Turning stops under reduced motion, and the
 * pause button stops it on request (motion longer than 5 s needs a way to
 * stop it). A photo is only fetched once it is in view or next.
 */
export function PhotoRotation({ photos }: { photos: typeof PHOTOS }) {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  // the furthest photo reached so far; it and the one after are mounted
  const [reached, setReached] = useState(0);

  useEffect(() => {
    if (paused || photos.length < 2 || window.matchMedia(REDUCED).matches) return;
    const turn = window.setInterval(() => {
      setAt((i) => {
        const next = (i + 1) % photos.length;
        setReached((r) => Math.max(r, next));
        return next;
      });
    }, HOLD_MS);
    return () => window.clearInterval(turn);
  }, [paused, photos.length]);

  return (
    <div className={styles.frame} style={{ "--fade": `${FADE_MS}ms` } as CSSProperties}>
      {photos.map(({ src, alt }, i) => (
        <div key={src.src} className={styles.slide} data-active={i === at || undefined} aria-hidden={i !== at}>
          {i <= reached + 1 && (
            <Image
              src={src}
              alt={alt}
              className={styles.photo}
              fill
              sizes="100vw"
              quality={PHOTO_QUALITY}
              priority={i === 0}
              placeholder="blur"
            />
          )}
        </div>
      ))}
      <div className={styles.controls}>
        <span className={styles.chip} aria-label={`Photo ${at + 1} of ${photos.length}`}>
          {at + 1}
        </span>
        <button type="button" className={styles.chip} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
