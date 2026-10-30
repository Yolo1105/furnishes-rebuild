"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import styles from "./ConsultPhotos.module.css";

const HOLD_MS = 5000;

/**
 * The photos under the orange band, one fading into the next, with a line of
 * words over them and a button to stop them. Still from the start for anyone
 * who asks for less motion.
 */
export function ConsultPhotos({
  photos,
  small,
  line,
}: {
  photos: readonly StaticImageData[];
  small: string;
  line: string;
}) {
  const [shown, setShown] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setShown((i) => (i + 1) % photos.length), HOLD_MS);
    return () => clearInterval(timer);
  }, [paused, photos.length]);

  return (
    <div className={styles.frame}>
      {photos.map((p, i) => (
        <Image
          key={p.src}
          className={styles.photo}
          data-shown={i === shown || undefined}
          src={p}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 86vw"
          placeholder="blur"
        />
      ))}
      <div className={styles.foot}>
        <div>
          <p className={styles.small}>{small}</p>
          <p className={styles.line}>{line}</p>
        </div>
        <button
          type="button"
          className={styles.toggle}
          data-paused={paused || undefined}
          aria-label={paused ? "Play the photos" : "Pause the photos"}
          onClick={() => setPaused((p) => !p)}
        />
      </div>
    </div>
  );
}
