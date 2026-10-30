"use client";

import { useEffect, useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { FLAT, FLOOR_AREA } from "@/features/plan/flat";
import { RoomPhotos } from "./RoomPhotos";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./page.module.css";

/** The rooms that have a photo: these answer the pointer on the plan. */
const LINKED: ReadonlySet<string> = new Set(ROOM_PHOTOS.map((p) => p.room));

/** How long each photo stays before the next comes up on its own. */
const AUTOPLAY_MS = 5000;

/**
 * The studio's two halves, kept in step: the room photos on the left, and on
 * the right the flat's plan, headed by its name and size, with "Scroll to
 * explore" at the foot. Each photo stands for one room: the photos turn on
 * their own, hovering a room on the plan brings up its photo, and the room in
 * view is shaded on the plan. The turning waits while the pointer is over the
 * photo or the plan, and is off for anyone who asks for less motion.
 */
export function StudioView() {
  const count = ROOM_PHOTOS.length;
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const showRoom = (key: string) => setAt(ROOM_PHOTOS.findIndex((p) => p.room === key));
  const hold = { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false) };

  // the next photo after a while; any change of photo starts the wait again
  useEffect(() => {
    if (held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setAt((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [at, held, count]);

  return (
    <>
      <div className={styles.photo} {...hold}>
        <RoomPhotos photos={ROOM_PHOTOS} at={at} />
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
          <p className={styles.lede}>Just describe your dream room in a chat, and design it yourself from start to finish, from 2D floor plan to 3D visualizer.</p>
        </header>
        <div className={styles.drawing} {...hold}>
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
