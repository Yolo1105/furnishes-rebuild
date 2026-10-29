"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
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
 * next and numbered from 1. The arrows (or the arrow keys) step back and
 * forward, and restart the hold. Turning stops under reduced motion, and the
 * pause button stops it on request (motion longer than 5 s needs a way to
 * stop it). A photo is only fetched once it has been shown or is next to the
 * one in view.
 */
export function PhotoRotation({ photos }: { photos: typeof PHOTOS }) {
  const count = photos.length;
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));

  const show = useCallback(
    (to: number) => {
      const i = (to + count) % count;
      setAt(i);
      setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
    },
    [count],
  );

  // a fresh hold for each photo, so one picked by hand gets its full time
  useEffect(() => {
    if (paused || count < 2 || window.matchMedia(REDUCED).matches) return;
    const turn = window.setTimeout(() => show(at + 1), HOLD_MS);
    return () => window.clearTimeout(turn);
  }, [at, paused, count, show]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") show(at - 1);
      else if (e.key === "ArrowRight") show(at + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, show]);

  const near = (i: number) => seen.has(i) || i === (at + 1) % count || i === (at - 1 + count) % count;

  return (
    <div className={styles.frame} style={{ "--fade": `${FADE_MS}ms` } as CSSProperties}>
      {photos.map(({ src, alt }, i) => (
        <div key={src.src} className={styles.slide} data-active={i === at || undefined} aria-hidden={i !== at}>
          {near(i) && (
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
        <span className={styles.chip} aria-label={`Photo ${at + 1} of ${count}`}>
          {at + 1}
        </span>
        <button type="button" className={styles.chip} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <button type="button" className={`${styles.chip} ${styles.step}`} data-side="left" onClick={() => show(at - 1)} aria-label="Previous photo">
        ←
      </button>
      <button type="button" className={`${styles.chip} ${styles.step}`} data-side="right" onClick={() => show(at + 1)} aria-label="Next photo">
        →
      </button>
    </div>
  );
}
