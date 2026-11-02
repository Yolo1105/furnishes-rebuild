"use client";

import Image, { type StaticImageData } from "next/image";
import { type ReactNode, useState } from "react";
import styles from "./Gallery.module.css";

/** One view of a piece: a render, or a drawing (its dimensions) with a small version for its thumbnail. */
export type View = { kind: "image"; src: StaticImageData; alt: string } | { kind: "drawing"; label: string; main: ReactNode; thumb: ReactNode };

/** At most this many thumbnails under the main view. */
const MAX = 5;

/**
 * A piece's gallery: the chosen view large at 4:5, a row of square thumbnails
 * under it (a click shows that one), and one line under them. Sticky beside
 * the buy panel on wide screens; the sticky box is the outer one, so the
 * image's own frame stays `position: relative`.
 */
export function Gallery({ views, note, className = "" }: { views: readonly View[]; note?: ReactNode; className?: string }) {
  const shown = views.slice(0, MAX);
  const [current, setCurrent] = useState(0);
  const view = shown[current] ?? shown[0]!;

  return (
    <div className={`${styles.gallery} ${className}`.trim()}>
      <div className={`media-portrait ${styles.main}`}>
        {view.kind === "image" ? (
          <Image key={view.src.src} src={view.src} alt={view.alt} fill sizes="(max-width: 1023px) 100vw, 55vw" placeholder="blur" priority={current === 0} />
        ) : (
          <div className={styles.drawing}>{view.main}</div>
        )}
      </div>
      {shown.length > 1 && (
        <ul className={styles.thumbs} aria-label="Views">
          {shown.map((v, i) => (
            <li key={v.kind === "image" ? v.src.src : v.label}>
              <button
                type="button"
                className={`media-square ${styles.thumb}`}
                aria-pressed={i === current}
                aria-label={v.kind === "image" ? v.alt : v.label}
                onClick={() => setCurrent(i)}
              >
                {v.kind === "image" ? <Image src={v.src} alt="" fill sizes="120px" /> : <span className={styles.drawing}>{v.thumb}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {note && <p className="meta">{note}</p>}
    </div>
  );
}
