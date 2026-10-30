"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { BOUNDS } from "@/features/walk/flat";
import { finishAt } from "@/features/walk/order";
import { type SheetFit, WalkView } from "@/features/walk/WalkView";
import { OrderCard } from "./OrderCard";
import { RoomPhotos } from "./RoomPhotos";
import { Ruler } from "./Ruler";
import { INTRO_MS } from "./intro";
import { ROOM_PHOTOS } from "./rooms";
import { FIRST_ORDER_STEP, FIRST_ROOM, ROOM_NOTES, STEPS } from "./tour";
import styles from "./page.module.css";

/** The rooms that have a photo: these answer the pointer on the plan. */
const LINKED: ReadonlySet<string> = new Set(ROOM_PHOTOS.map((p) => p.room));

/** How long each photo stays before the next comes up on its own. */
const AUTOPLAY_MS = 5000;

/** Screens of scroll each step of the tour holds for, once the plan has the stage. */
const HOLD = 1;

/** The share of the second step, at its start, over which the 2D plan gives way to the 3D one. */
const TO_3D = 0.2;

/** The share of a step's stretch, at its end, over which the scale glides on to the next step's mark. */
const GLIDE = 0.25;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * When, through the plan taking the stage (0 to 1), each part makes its
 * change, eased, from 1 to 0 (`out`) or 0 to 1: the words clear first, the
 * photo a little after, the split moves over most of it, then the ruler, the
 * tour's headline and its room come in, settled just as the first room begins.
 */
const PHASES: Record<string, { from: number; to: number; out?: boolean }> = {
  "--words": { from: 0, to: 0.35, out: true },
  "--photo": { from: 0, to: 0.6, out: true },
  "--shift": { from: 0.1, to: 0.85 },
  "--ruler-in": { from: 0.5, to: 0.9 },
  "--tour-head": { from: 0.6, to: 0.95 },
  "--tour-room": { from: 0.72, to: 1 },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The studio's two halves, kept in step: the room photos on the left, and on
 * the right the flat's plan under its heading, with "How it works?" at the
 * foot. They hold the screen for a second screen's scroll: over it the photos
 * and words fade out, the plan's half widens from 45% to 70% with the plan
 * growing to fill it, and a ruler fades in up the left, each in its own
 * stretch of the way (PHASES; upright screens skip this). Then, still held,
 * the tour's steps (tour.ts STEPS), HOLD screens each, their number, headline
 * and words on the left, the scale sliding so the step's mark meets its
 * number. The first is the plan: picking a room on it shades the room and
 * brings up its line. From the second the plan turns 3D (WalkView) and the
 * scroll walks it: the walls go up, the camera steps inside, the room comes
 * to life. Each photo stands for one room: the photos
 * turn on their own, hovering a room on the plan brings up its photo, and the
 * room in view is shaded on the plan. The turning waits while the pointer is
 * over the plan (where it picks rooms), stops once the page is scrolled, and
 * is off for anyone who asks for less motion.
 */
export function StudioView() {
  const count = ROOM_PHOTOS.length;
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  // the room picked on the plan: its photo comes up, and in the tour its line
  const [pick, setPick] = useState(FIRST_ROOM);
  const showRoom = (key: string) => {
    setAt(ROOM_PHOTOS.findIndex((p) => p.room === key));
    setPick(key);
  };
  const hold = { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false) };
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const numeral = useRef<HTMLParagraphElement>(null);
  // where the 3D walk should be: WalkView glides there
  const walkTo = useRef<((s: number) => void) | null>(null);
  // where the 2D plan has the flat, for the 3D sheet to lie exactly over it
  const drawing = useRef<HTMLDivElement>(null);
  const walkBox = useRef<HTMLDivElement>(null);
  const walkFit = useRef<SheetFit | null>(null);
  // whether the plan has (mostly) taken the stage, and the tour's step in view
  const [wide, setWide] = useState(false);
  // the 3D walk, made the first time the plan takes the stage and kept
  const [walkOn, setWalkOn] = useState(false);
  // whether the page has been scrolled at all: the photos stop turning then
  const [scrolled, setScrolled] = useState(false);
  const [stop, setStop] = useState(0);
  // where the example order is, for its card: the finish on the piece,
  // whether it is ordered, and how far on its way home
  const [finish, setFinish] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [leg, setLeg] = useState(0);
  // whether the arrival has played (intro.ts): the photos wait for it to turn
  const [arrived, setArrived] = useState(false);

  // the arrival marked done once it has played, or at once if it is not playing
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") {
      setArrived(true);
      return;
    }
    // left to run even if the page is left first, so the arrival never plays again on a later page
    setTimeout(() => {
      if (root.dataset.intro === "play") root.dataset.intro = "done";
      setArrived(true);
    }, INTRO_MS);
  }, []);

  // how far through the second screen's scroll, once a frame at most
  useEffect(() => {
    let pending = 0;
    const update = () => {
      if (!track.current || !stage.current) return;
      const upright = matchMedia("(orientation: portrait)").matches;
      const down = -track.current.getBoundingClientRect().top;
      const p = upright ? 0 : clamp01(down / innerHeight);
      for (const [name, { from, to, out }] of Object.entries(PHASES)) {
        const done = smooth(clamp01((p - from) / (to - from)));
        stage.current.style.setProperty(name, String(out ? 1 - done : done));
      }
      setWide(p > 0.5);
      if (p > 0.5) setWalkOn(true);
      setScrolled(down > 0);
      // any scroll ends the arrival at once
      if (down > 0 && document.documentElement.dataset.intro === "play") document.documentElement.dataset.intro = "done";
      // the steps walked since the plan took the stage, with the share of the next
      const walked = Math.max(0, (down - innerHeight) / (innerHeight * HOLD));
      const i = Math.min(STEPS.length - 1, Math.floor(walked));
      setStop(i);
      // the scale holds the step's mark at its number through most of its
      // stretch, the next's gliding up to meet it over the last GLIDE of it
      const glide = i < STEPS.length - 1 ? smooth(clamp01((walked - i - (1 - GLIDE)) / GLIDE)) : 0;
      stage.current.style.setProperty("--along", String(i + glide));
      // the 2D plan gives way to the 3D one as the second step starts, which
      // then plays the step's stretch of the walk; with no 3D, the 2D stays
      const in3d = !upright && walkTo.current ? smooth(clamp01((walked - 1) / TO_3D)) : 0;
      stage.current.style.setProperty("--walk-in", String(in3d));
      // (held on the plan till the 2D has given way)
      const svg = drawing.current?.querySelector("svg");
      const ctm = svg?.getScreenCTM();
      if (ctm && walkBox.current) {
        const box = walkBox.current.getBoundingClientRect();
        const mid = new DOMPoint((BOUNDS.x0 + BOUNDS.x1) / 2, (BOUNDS.y0 + BOUNDS.y1) / 2).matrixTransform(ctm);
        walkFit.current = { x: mid.x - box.left, y: mid.y - box.top, pxPerM: ctm.a * 1000 };
      }
      const [from, to] = STEPS[i]!.walk;
      const t = clamp01(i === 1 ? (walked - i - TO_3D) / (1 - TO_3D) : walked - i);
      const s = from + (to - from) * t;
      walkTo.current?.(s);
      // the order's card: the checkout step places it a little past halfway,
      // the delivery step goes through its stages in turn
      const o = i - FIRST_ORDER_STEP;
      setFinish(finishAt(s));
      setPlaced(o > 2 || (o === 2 && t > 0.55));
      setLeg(o > 3 ? 3 : o === 3 ? Math.min(3, Math.floor(t * 4)) : 0);
    };
    const schedule = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(pending);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  // the scale's room mark level with the middle of the big number, wherever
  // the layout puts it: again whenever the room's words (and so where the
  // number sits) change, and once it has risen in
  useEffect(() => {
    const point = () => {
      if (!numeral.current || !stage.current) return;
      const r = numeral.current.getBoundingClientRect();
      const top = stage.current.getBoundingClientRect().top;
      stage.current.style.setProperty("--point-y", `${r.top + r.height / 2 - top}px`);
    };
    point();
    const number = numeral.current;
    const block = number?.parentElement;
    if (!number || !block) return;
    const watch = new ResizeObserver(point);
    watch.observe(block);
    // and once the number has risen into place
    number.addEventListener("animationend", point);
    return () => {
      watch.disconnect();
      number.removeEventListener("animationend", point);
    };
  }, [stop]);

  // the next photo after a while; any change of photo starts the wait again
  useEffect(() => {
    if (!arrived || held || scrolled || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setAt((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [at, held, scrolled, count, arrived]);

  const step = STEPS[stop]!;
  // the first step tells the room picked; the rest, what they show
  const note = stop === 0 ? ROOM_NOTES[pick] : { name: step.label, line: step.body };

  return (
    <div
      ref={track}
      className={styles.track}
      style={{ "--steps": STEPS.length, "--hold": `${HOLD * 100}svh` } as CSSProperties}
    >
      <div ref={stage} className={styles.split} data-wide={wide || undefined} data-walking={stop > 0 || undefined}>
        <div className={styles.photo}>
          <RoomPhotos photos={ROOM_PHOTOS} at={at} faded={wide} />
        </div>
        <section className={styles.plan} aria-labelledby="flat-name">
          <header className={styles.head}>
            <h2 id="flat-name" className={styles.big}>
              <span className={styles.intro}>
                Seek your <span className={styles.accent}>favorite</span> furniture.
              </span>
              <span className={styles.name}>Customize for your space.</span>
            </h2>
            <p className={styles.lede}>
              No question too small, no change too many.
              <br />
              Just chat, and our AI Interior Consultant answers right away, day or night.
            </p>
          </header>
          <div ref={drawing} className={styles.drawing} {...hold}>
            <FloorPlan linked={LINKED} active={wide ? pick : ROOM_PHOTOS[at]?.room} onRoom={showRoom} />
          </div>
          {/* a nudge that there is more below, and the way down to it */}
          <a className={styles.more} href="#how">
            How it works?
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </section>
        {/* the flat in 3D, over the plan's side, from the second step */}
        <div ref={walkBox} className={styles.walk}>
          {walkOn && <WalkView goRef={walkTo} fitRef={walkFit} />}
          {stop >= FIRST_ORDER_STEP && (
            <OrderCard step={stop - FIRST_ORDER_STEP} finish={finish} placed={placed} stage={leg} />
          )}
        </div>
        <div className={styles.ruler}>
          <Ruler rooms={STEPS.length} at={stop} />
        </div>
        {/* the tour, on the left as the plan takes the stage */}
        <div className={styles.tour} aria-hidden={!wide}>
          <h2 className={styles.tourHead}>
            {/* keyed, so each step's headline comes in afresh */}
            <span key={stop} className={styles.headLines}>
              <span className={styles.tourLead}>{step.lead}</span>
              {step.soft.length > 0 && (
                <span className={styles.tourSoft}>
                  {step.soft.map((line, i) => (
                    <span key={line}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </h2>
          <div className={styles.tourRoom} aria-live="polite">
            <p ref={numeral} key={stop} className={styles.numeral} aria-hidden="true">
              {pad(stop + 1)}
            </p>
            {/* keyed, so each room's or step's words come in afresh */}
            <div key={stop === 0 ? pick : `step-${stop}`} className={styles.about}>
              <h3 className={styles.roomName}>{note?.name}</h3>
              <p className={styles.roomLine}>{note?.line}</p>
            </div>
          </div>
        </div>
      </div>
      {/* where "How it works?" leads: the plan at its widest */}
      <span id="how" className={styles.how} />
    </div>
  );
}
