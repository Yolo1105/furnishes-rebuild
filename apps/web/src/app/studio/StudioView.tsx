"use client";

import { useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { FLAT, FLOOR_AREA } from "@/features/plan/flat";
import { RoomPhotos } from "./RoomPhotos";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./page.module.css";

/** The rooms that have a photo: these answer the pointer on the plan. */
const LINKED: ReadonlySet<string> = new Set(ROOM_PHOTOS.flatMap((p) => (p.room ? [p.room] : [])));

/**
 * The studio's two halves, kept in step: the room photos on the left, and on
 * the right the flat's plan, headed by its name and size, with "Scroll to
 * explore" at the foot. Hovering a room on the plan brings up its photo (the
 * one in view stays if it already shows that room); the arrows still step
 * through them all, and the room in view is shaded on the plan.
 */
export function StudioView() {
  const count = ROOM_PHOTOS.length;
  const [at, setAt] = useState(0);
  const showRoom = (key: string) =>
    setAt((i) => (ROOM_PHOTOS[i]?.room === key ? i : Math.max(0, ROOM_PHOTOS.findIndex((p) => p.room === key))));

  return (
    <>
      <div className={styles.photo}>
        <RoomPhotos photos={ROOM_PHOTOS} at={at} onStep={(by) => setAt((i) => (i + by + count) % count)} />
      </div>
      <section className={styles.plan} aria-labelledby="flat-name">
        <header className={styles.head}>
          <h2 id="flat-name" className={styles.big}>
            {FLAT.name}
          </h2>
          <p className={`${styles.big} ${styles.end}`}>
            {FLOOR_AREA} m<sup>2</sup>
          </p>
          <p className={styles.small}>{FLAT.rooms}</p>
          <p className={`${styles.small} ${styles.end}`}>Sleeps {FLAT.sleeps}</p>
          <p className={styles.lede}>Just describe your dream room in a chat, and design it yourself from start to finish, from 2D floor plan to 3D visualizer.</p>
        </header>
        <div className={styles.drawing}>
          <FloorPlan linked={LINKED} active={ROOM_PHOTOS[at]?.room} onRoom={showRoom} />
        </div>
        {/* a nudge that there is more below */}
        <p className={styles.more}>
          Scroll to explore
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </p>
      </section>
    </>
  );
}
