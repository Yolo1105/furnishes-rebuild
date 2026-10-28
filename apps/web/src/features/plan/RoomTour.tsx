"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Backdrop } from "@/features/stage/Backdrop";
import { clamp01, smooth } from "./ease";
import { FlatPlan } from "./FlatPlan";
import styles from "./RoomTour.module.css";
import { TOUR } from "./tour";

/** Screens of scroll each room holds for. */
const HOLD = 0.7;

/** The scale's fine ticks between one room's mark and the next's. */
const TICKS = 5;

/** The share of a room's stretch, at its end, over which the scale glides on to the next room's mark. */
const GLIDE = 0.25;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A walk round the flat, room by room, as the page scrolls: on the left the
 * room's number, name and a line on it; on the right the plan, that room
 * picked out in full and the rest of the flat faded behind it; and down the
 * far left a scale with a mark for each room, sliding as the walk goes so
 * the room in view's mark meets a pointer that runs to its big number.
 */
export function RoomTour() {
  const trackRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLParagraphElement>(null);
  const [at, setAt] = useState(0);

  // the room the scroll is in: each holds for HOLD screens
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const read = () => {
      const step = window.innerHeight * HOLD;
      const along = Math.max(0, -track.getBoundingClientRect().top) / step; // rooms walked, with the share of the next
      const i = Math.min(TOUR.length - 1, Math.floor(along));
      setAt(i);
      // the ruler holds the room's mark at the pointer through most of its
      // stretch, the next's gliding up to meet it over the last GLIDE of it
      const glide = i < TOUR.length - 1 ? smooth(clamp01((along - i - (1 - GLIDE)) / GLIDE)) : 0;
      viewRef.current?.style.setProperty("--along", String(i + glide));
      point();
    };
    // the pointer, level with the middle of the big number, wherever the layout puts it
    function point() {
      const [view, numeral] = [viewRef.current, numeralRef.current];
      if (!view || !numeral) return;
      const r = numeral.getBoundingClientRect();
      view.style.setProperty("--point-y", `${r.top + r.height / 2 - view.getBoundingClientRect().top}px`);
    }
    const sized = new ResizeObserver(point);
    if (numeralRef.current) sized.observe(numeralRef.current);
    read();
    point();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      sized.disconnect();
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
      <div ref={viewRef} className={styles.view}>
        <Backdrop />
        <div className={styles.words}>
          <h1 className={styles.headline}>
            Start at the door,
            <span className={styles.soft}>and walk through every room.</span>
          </h1>

          <div className={styles.room} aria-live="polite">
            <p ref={numeralRef} className={styles.numeral} aria-hidden="true">
              {pad(at + 1)}
            </p>
            {/* keyed, so each room's words come in afresh */}
            <div key={room.key} className={styles.about}>
              <h2 className={styles.name}>{room.name}</h2>
              <p className={styles.line}>{room.line}</p>
            </div>
          </div>

        </div>
        {/* a scale down the far left, sliding so the room in view's mark meets the pointer at its number */}
        <div className={styles.ruler} aria-hidden="true">
          {Array.from({ length: (TOUR.length - 1) * TICKS + 1 }, (_, t) => (
            <span key={t} className={styles.tick} style={{ "--t": t / TICKS } as CSSProperties} />
          ))}
          {TOUR.map((r, i) => (
            <span key={r.key} className={styles.mark} data-on={i === at || undefined} style={{ "--i": i } as CSSProperties}>
              {pad(i + 1)}
            </span>
          ))}
        </div>
        <span className={styles.pointer} aria-hidden="true" />
        <FlatPlan side="right" highlight={room.key} />
      </div>
    </section>
  );
}
