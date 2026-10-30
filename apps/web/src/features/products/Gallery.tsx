"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "./catalogue";
import styles from "./Gallery.module.css";

const VIEWS = [
  { key: "room", label: "In a room" },
  { key: "studio", label: "On its own" },
] as const;

type View = (typeof VIEWS)[number]["key"];

/** A piece's renders, in its room or on its own, one fading over the other, with tabs to turn between them. */
export function Gallery({ product: p }: { product: Product }) {
  const [view, setView] = useState<View>("room");
  return (
    <div className={styles.gallery} data-view={view}>
      <Image
        className={styles.room}
        src={p.room}
        alt={`The ${p.name.toLowerCase()} in its room`}
        fill
        sizes="(max-width: 900px) 100vw, 58vw"
        placeholder="blur"
        priority
        aria-hidden={view !== "room"}
      />
      <Image
        className={styles.studio}
        src={p.studio}
        alt={`The ${p.name.toLowerCase()} on its own`}
        fill
        sizes="(max-width: 900px) 100vw, 58vw"
        aria-hidden={view !== "studio"}
      />
      <div className={styles.tabs} role="group" aria-label={`Show the ${p.name.toLowerCase()}`}>
        {VIEWS.map((v) => (
          <button key={v.key} type="button" className={styles.tab} aria-pressed={view === v.key} onClick={() => setView(v.key)}>
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
