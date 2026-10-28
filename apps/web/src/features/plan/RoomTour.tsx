"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Backdrop } from "@/features/stage/Backdrop";
import { routes } from "@/lib/routes";
import { FlatPlan } from "./FlatPlan";
import styles from "./RoomTour.module.css";
import { TOUR } from "./tour";

/** Screens of scroll each room holds for. */
const HOLD = 0.7;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A walk round the flat, room by room, as the page scrolls: on the left the
 * room's number, name and a line on it, with tabs for every room along the
 * foot; on the right the plan, that room picked out in full and the rest of
 * the flat faded behind it. The tabs jump to a room.
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

  /** Scroll to room i: the start of its stretch of the track. */
  const go = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight * HOLD + 1, behavior: "smooth" });
  };

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
              <Link href={routes.studio} className={styles.see}>
                See this room <span aria-hidden="true">→</span>
              </Link>
              <p className={styles.cue}>
                Scroll to walk through <span aria-hidden="true">↓</span>
              </p>
            </div>
          </div>

          <nav className={styles.tabs} aria-label="Rooms">
            <span className={styles.progress} style={{ "--at": (at + 1) / TOUR.length } as CSSProperties} aria-hidden="true" />
            {TOUR.map((r, i) => (
              <button
                key={r.key}
                type="button"
                className={styles.tab}
                data-on={i === at || undefined}
                aria-current={i === at ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span className={styles.tabNo}>{pad(i + 1)}</span>
                {r.short}
              </button>
            ))}
          </nav>
        </div>
        <FlatPlan side="right" highlight={room.key} />
      </div>
    </section>
  );
}
