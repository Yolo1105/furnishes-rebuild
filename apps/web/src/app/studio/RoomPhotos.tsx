"use client";

import { type CSSProperties, useState } from "react";
import Image from "next/image";
import type { ROOM_PHOTOS } from "./rooms";
import styles from "./RoomPhotos.module.css";

/**
 * The room photos, one at a time, changed only by hand: the arrows step back
 * and forward, wrapping round, and the count shows where you are. The photo
 * in view and its neighbours are fetched; the rest wait until reached. Each
 * is cropped to fill its box, `zoom` times closer, with the room's middle
 * (`focus`) kept central.
 */
export function RoomPhotos({ photos }: { photos: typeof ROOM_PHOTOS }) {
  const count = photos.length;
  const [at, setAt] = useState(0);
  const step = (by: number) => setAt((i) => (i + by + count) % count);
  const near = (i: number) => i === at || i === (at + 1) % count || i === (at - 1 + count) % count;

  return (
    <div className={styles.frame}>
      {photos.map(({ src, alt, focus = [50, 50], zoom = 1 }, i) => (
        <div key={src.src} className={styles.slide} data-active={i === at || undefined} aria-hidden={i !== at}>
          <div
            className={styles.canvas}
            style={
              {
                "--ratio": src.width / src.height,
                "--focus-x": focus[0] / 100,
                "--focus-y": focus[1] / 100,
                "--zoom": zoom,
              } as CSSProperties
            }
          >
            {near(i) && (
              // the photo runs past its half: about the screen's width, more on phones
              <Image src={src} alt={alt} fill sizes="(orientation: portrait) 240vw, 100vw" priority={i === 0} placeholder="blur" />
            )}
          </div>
        </div>
      ))}
      {count > 1 && (
        <div className={styles.controls}>
          <button type="button" className={styles.chip} onClick={() => step(-1)} aria-label="Previous photo">
            ←
          </button>
          <span className={styles.count} aria-live="polite">
            {at + 1} / {count}
          </span>
          <button type="button" className={styles.chip} onClick={() => step(1)} aria-label="Next photo">
            →
          </button>
        </div>
      )}
    </div>
  );
}
