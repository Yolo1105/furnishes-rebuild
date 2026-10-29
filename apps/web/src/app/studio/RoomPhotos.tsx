"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { ROOM_PHOTOS } from "./rooms";
import styles from "./RoomPhotos.module.css";

/**
 * The room photos, one at a time: `at` is the one in view, and the arrows ask
 * for the one before or after (`onStep`); the count shows where you are. All
 * are fetched, so any can come up at once (hovering a room on the plan brings
 * its photo up). Each is cropped to fill its box, `zoom` times closer, with
 * the room's middle (`focus`) kept central.
 */
export function RoomPhotos({
  photos,
  at,
  onStep,
}: {
  photos: typeof ROOM_PHOTOS;
  at: number;
  onStep: (by: number) => void;
}) {
  const count = photos.length;

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
            {/* the photo runs past its half: about the screen's width, more on phones */}
            <Image src={src} alt={alt} fill sizes="(orientation: portrait) 240vw, 100vw" priority={i === 0} placeholder="blur" />
          </div>
        </div>
      ))}
      {count > 1 && (
        <div className={styles.controls}>
          <button type="button" className={styles.chip} onClick={() => onStep(-1)} aria-label="Previous photo">
            ←
          </button>
          <span className={styles.count} aria-live="polite">
            {at + 1} / {count}
          </span>
          <button type="button" className={styles.chip} onClick={() => onStep(1)} aria-label="Next photo">
            →
          </button>
        </div>
      )}
    </div>
  );
}
