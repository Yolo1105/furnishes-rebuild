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
    if (count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") show(at - 1);
      else if (e.key === "ArrowRight") show(at + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [at, count, show]);

  const near = (i: number) => seen.has(i) || i === (at + 1) % count || i === (at - 1 + count) % count;

  return (
    <div className={styles.frame} style={{ "--fade": `${FADE_MS}ms` } as CSSProperties}>
      {photos.map(({ src, alt, shiftLeft = 0, shiftUp = 0, title }, i) => (
        <div
          key={src.src}
          className={styles.slide}
          data-active={i === at || undefined}
          aria-hidden={i !== at}
          // how far it runs past the left and top edges, so the room sits further left and up
          style={{ "--shift-left": `${shiftLeft}%`, "--shift-up": `${shiftUp}%` } as CSSProperties}
        >
          {/* the photo at its own shape, just covering the box, so the words keep their place on it */}
          <div className={styles.canvas} style={{ "--ratio": src.width / src.height } as CSSProperties}>
            {near(i) && (
              <Image
                src={src}
                alt={alt}
                fill
                sizes={`${100 + shiftLeft}vw`}
                quality={PHOTO_QUALITY}
                priority={i === 0}
                placeholder="blur"
              />
            )}
            {title && (
              // the page's h1 carries the words for screen readers
              <p className={styles.title} aria-hidden="true">
                <span
                  className={styles.word}
                  style={{ right: `${100 - title.interiorEnd}%`, top: `${title.middle}%` }}
                >
                  Interior
                </span>
                <span className={styles.word} style={{ left: `${title.revolutionStart}%`, top: `${title.middle}%` }}>
                  Revolution
                </span>
              </p>
            )}
          </div>
        </div>
      ))}
      {/* upright phones see only the photo's middle, not its walls: the words stack under the bar instead */}
      {photos[at]?.title && (
        <p className={styles.stacked} aria-hidden="true">
          Interior
          <br />
          Revolution
        </p>
      )}
      {count > 1 && <Controls at={at} count={count} paused={paused} onPause={() => setPaused((p) => !p)} onStep={(by) => show(at + by)} />}
    </div>
  );
}

/** The number, the pause button and the arrows: only when there is more than one photo. */
function Controls({
  at,
  count,
  paused,
  onPause,
  onStep,
}: {
  at: number;
  count: number;
  paused: boolean;
  onPause: () => void;
  onStep: (by: number) => void;
}) {
  return (
    <>
      <div className={styles.controls}>
        <span className={styles.chip} aria-label={`Photo ${at + 1} of ${count}`}>
          {at + 1}
        </span>
        <button type="button" className={styles.chip} onClick={onPause} aria-pressed={paused}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <button type="button" className={`${styles.chip} ${styles.step}`} data-side="left" onClick={() => onStep(-1)} aria-label="Previous photo">
        ←
      </button>
      <button type="button" className={`${styles.chip} ${styles.step}`} data-side="right" onClick={() => onStep(1)} aria-label="Next photo">
        →
      </button>
    </>
  );
}
