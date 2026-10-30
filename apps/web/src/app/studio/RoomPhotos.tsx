"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { ROOM_PHOTOS } from "./rooms";
import styles from "./RoomPhotos.module.css";

/**
 * The room photos, one at a time: `at` is the one in view, labelled
 * "Interior revolution." at the bottom left, on two lines. All are fetched, so any can come up
 * at once (hovering a room on the plan brings its photo up). Each is cropped
 * to fill its box, `zoom` times closer, with the room's middle (`focus`) kept
 * central.
 */
export function RoomPhotos({ photos, at }: { photos: typeof ROOM_PHOTOS; at: number }) {
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
      <p className={styles.label}>
        <span>Interior</span>
        <span>
          rev<span className={styles.accent}>o</span>lution<span className={styles.accent}>.</span>
        </span>
      </p>
    </div>
  );
}
