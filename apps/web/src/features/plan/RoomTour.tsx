"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Backdrop } from "@/features/stage/Backdrop";
import { FlatPlan } from "./FlatPlan";
import styles from "./RoomTour.module.css";
import { TOUR } from "./tour";

/** Screens of scroll each room holds for. */
const HOLD = 0.7;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A walk round the flat, room by room, as the page scrolls: on the left the
 * room's number, name and a line on it; on the right the plan, that room
 * picked out in full and the rest of the flat faded behind it.
 */
export function RoomTour() {
  const trackRef = useRef<HTMLElement>(null);
  const [at, setAt] = useState(0);

  // the room the scroll is in: each holds for HOLD screens
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const read = () => {
      const step = window.innerHeight * HOLD;
      const i = Math.floor(Math.max(0, -track.getBoundingClientRect().top) / step);
      setAt(Math.min(TOUR.length - 1, i));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const room = TOUR[at]!;
  return (
    <section
      ref={trackRef}
      className={styles.track}
      style={{ "--rooms": TOUR.length, "--hold": `${HOLD * 100}vh` } as CSSProperties}
      aria-label="A walk round the flat, room by room"
    >
      <div className={styles.view}>
        <Backdrop />
        <div className={styles.words}>
          <h1 className={styles.headline}>
            Start at the door,
            <span className={styles.soft}> and walk through every room.</span>
          </h1>

          <div className={styles.room} aria-live="polite">
            <p className={styles.numeral} aria-hidden="true">
              {pad(at + 1)}
            </p>
            {/* keyed, so each room's words come in afresh */}
            <div key={room.key} className={styles.about}>
              <h2 className={styles.name}>{room.name}</h2>
              <p className={styles.line}>{room.line}</p>
            </div>
          </div>

        </div>
        <FlatPlan side="right" highlight={room.key} />
      </div>
    </section>
  );
}
