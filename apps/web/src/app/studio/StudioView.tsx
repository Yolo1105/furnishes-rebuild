"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { BOUNDS } from "@/features/walk/flat";
import { finishAt } from "@/features/walk/order";
import type { SheetFit } from "@/features/walk/WalkView";
import { FurnitureWord } from "./FurnitureWord";
import { OrderCard } from "./OrderCard";
import { RoomPhotos } from "./RoomPhotos";
import { Ruler } from "./Ruler";
import { INTRO_MS } from "./intro";
import { ROOM_PHOTOS } from "./rooms";
import { FIRST_ORDER_STEP, ROOM_NOTES, STEPS } from "./tour";
import styles from "./page.module.css";

/** The 3D walk, loaded apart so its weight never holds up the first paint. */
const WalkView = dynamic(() => import("@/features/walk/WalkView").then((m) => m.WalkView), { ssr: false });

/** The rooms that have a photo: these answer the pointer on the plan. */
const LINKED: ReadonlySet<string> = new Set(ROOM_PHOTOS.map((p) => p.room));

/** How long each photo stays before the next comes up on its own. */
const AUTOPLAY_MS = 5000;

/** Screens of scroll each step of the tour holds for, once the plan has the stage. */
const HOLD = 1;

/** The share of the first step, at its end, over which the 3D plan comes in over the 2D one, so the walls can rise as the second starts. */
const TO_3D = 0.05;

/** The share of a step's stretch, at its end, over which the scale glides on to the next step's mark. */
const GLIDE = 0.25;

/** The stretch of the first step over which the room's shading goes, as the 3D plan has none. */
const WASH_OUT = { from: 0.6, to: 0.9 };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
/** 0 to 1 over a stretch, eased. */
const over = (x: number, { from, to }: { from: number; to: number }) => smooth(clamp01((x - from) / (to - from)));

/**
 * When, through the plan taking the stage (0 to 1), each part makes its
 * change, eased, from 1 to 0 (`out`) or 0 to 1: the words clear first, the
 * photo a little after, the plan moves over most of it, its floors white (the
 * white the 3D one is drawn on) before the ruler, the tour's headline and its
 * room come in, settled just as the first room begins.
 */
const PHASES: Record<string, { from: number; to: number; out?: boolean }> = {
  "--words": { from: 0, to: 0.25, out: true },
  "--photo": { from: 0, to: 0.4, out: true },
  "--move": { from: 0.1, to: 0.8 },
  "--plan-white": { from: 0.05, to: 0.55 },
  "--ruler-in": { from: 0.55, to: 0.85 },
  "--tour-head": { from: 0.65, to: 0.9 },
  "--tour-room": { from: 0.75, to: 1 },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The studio's two halves, kept in step: the room photos on the left, and on
 * the right the flat's plan under its heading, with "How it works?" at the
 * foot. They hold the screen for a second screen's scroll: over it the photos
 * and words fade out, the plan moves in one line to the room they leave,
 * growing as it goes, and a ruler fades in up the left, each in its own
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
  // the room in view: its photo, shaded on the plan, and in the tour its line
  const pick = ROOM_PHOTOS[at]!.room;
  const showRoom = (key: string) => setAt(ROOM_PHOTOS.findIndex((p) => p.room === key));
  const hold = { onPointerEnter: () => setHeld(true), onPointerLeave: () => setHeld(false) };
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const numeral = useRef<HTMLParagraphElement>(null);
  // where the 3D walk should be: WalkView glides there
  const walkTo = useRef<((s: number) => void) | null>(null);
  // where the 2D plan has the flat, for the 3D sheet to lie exactly over it
  const drawing = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const drawingEnd = useRef<HTMLDivElement>(null);
  const walkBox = useRef<HTMLDivElement>(null);
  const walkFit = useRef<SheetFit | null>(null);
  // whether the plan has (mostly) taken the stage, and the tour's step in view
  const [wide, setWide] = useState(false);
  // the 3D walk, made once the arrival has played, so as not to catch the plan on its way, and kept
  const [walkOn, setWalkOn] = useState(false);
  // whether the page has been scrolled at all: the photos stop turning then
  const [scrolled, setScrolled] = useState(false);
  const [stop, setStop] = useState(0);
  // where the example order is, for its card: the finish on the piece,
  // whether it is ordered, and how far on its way home
  const [finish, setFinish] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [leg, setLeg] = useState(0);
  const [built, setBuilt] = useState(false);
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

  // the 3D walk made when the browser has a moment
  useEffect(() => {
    if (!arrived || matchMedia("(orientation: portrait)").matches) return;
    const make = () => setWalkOn(true);
    if ("requestIdleCallback" in window) {
      const idle = requestIdleCallback(make, { timeout: 2000 });
      return () => cancelIdleCallback(idle);
    }
    const timer = setTimeout(make, 200);
    return () => clearTimeout(timer);
  }, [arrived]);

  // how far through the second screen's scroll, once a frame at most
  useEffect(() => {
    let pending = 0;
    const update = () => {
      // (a window with no height yet, as a hidden one's, has no place to be)
      if (!track.current || !stage.current || innerHeight === 0) return;
      const upright = matchMedia("(orientation: portrait)").matches;
      const down = -track.current.getBoundingClientRect().top;
      const p = upright ? 0 : clamp01(down / innerHeight);
      for (const [name, { from, to, out }] of Object.entries(PHASES)) {
        const done = smooth(clamp01((p - from) / (to - from)));
        stage.current.style.setProperty(name, String(out ? 1 - done : done));
      }
      setWide(p > 0.5);
      if (p > 0) setWalkOn(true);
      // the plan in one line from its place to where it ends up
      const move = upright ? 0 : over(p, PHASES["--move"]!);
      if (drawing.current && slot.current && drawingEnd.current) {
        const a = slot.current.getBoundingClientRect();
        const b = drawingEnd.current.getBoundingClientRect();
        const box = drawing.current.style;
        box.left = move ? `${move * (b.left - a.left)}px` : "";
        box.top = move ? `${move * (b.top - a.top)}px` : "";
        box.width = move ? `${a.width + move * (b.width - a.width)}px` : "";
        box.height = move ? `${a.height + move * (b.height - a.height)}px` : "";
      }
      setScrolled(down > 0);
      // any scroll ends the arrival at once
      if (down > 0 && document.documentElement.dataset.intro === "play") {
        document.documentElement.dataset.intro = "done";
        // scrolled early: the 3D walk is wanted now
        setArrived(true);
      }
      // the steps walked since the plan took the stage, with the share of the next
      const walked = Math.max(0, (down - innerHeight) / (innerHeight * HOLD));
      const i = Math.min(STEPS.length - 1, Math.floor(walked));
      setStop(i);
      // the scale holds the step's mark at its number through most of its
      // stretch, the next's gliding up to meet it over the last GLIDE of it
      const glide = i < STEPS.length - 1 ? smooth(clamp01((walked - i - (1 - GLIDE)) / GLIDE)) : 0;
      stage.current.style.setProperty("--along", String(i + glide));
      const into = walked - i;
      // the room's shading goes as the first step ends
      stage.current.style.setProperty("--plan-wash", String(upright ? 1 : 1 - over(walked, WASH_OUT)));
      // then the 3D one comes in, still, and the 2D one goes from under it;
      // with no 3D, the 2D stays
      const in3d = !upright && walkTo.current ? smooth(clamp01((walked - (1 - TO_3D)) / TO_3D)) : 0;
      stage.current.style.setProperty("--walk-in", String(in3d));
      stage.current.style.setProperty("--plan-gone", in3d === 1 ? "1" : "0");
      // (the 3D sheet laid over the plan once the plan is in its place)
      const svg = drawing.current?.querySelector("svg");
      const ctm = svg?.getScreenCTM();
      if (ctm && walkBox.current && move === 1) {
        const box = walkBox.current.getBoundingClientRect();
        const mid = new DOMPoint((BOUNDS.x0 + BOUNDS.x1) / 2, (BOUNDS.y0 + BOUNDS.y1) / 2).matrixTransform(ctm);
        walkFit.current = { x: mid.x - box.left, y: mid.y - box.top, pxPerM: ctm.a * 1000 };
      }
      const [from, to] = STEPS[i]!.walk;
      const t = clamp01(into);
      const s = from + (to - from) * t;
      walkTo.current?.(s);
      // the order's card: the checkout step places it a little past halfway,
      // the delivery step goes through its stages in turn, and the last has
      // it put together once its boards are all in
      const o = i - FIRST_ORDER_STEP;
      setFinish(finishAt(s));
      setPlaced(o > 2 || (o === 2 && t > 0.55));
      setLeg(o > 3 ? 3 : o === 3 ? Math.min(3, Math.floor(t * 4)) : 0);
      setBuilt(o === 4 && t > 0.75);
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
  // number sits) change
  useEffect(() => {
    const point = () => {
      const tour = numeral.current?.offsetParent as HTMLElement | null;
      if (!numeral.current || !stage.current || !tour) return;
      // (by layout, so where the number is rising from does not count)
      stage.current.style.setProperty("--point-y", `${tour.offsetTop + numeral.current.offsetTop + numeral.current.offsetHeight / 2}px`);
    };
    point();
    const block = numeral.current?.parentElement;
    if (!block) return;
    const watch = new ResizeObserver(point);
    watch.observe(block);
    return () => watch.disconnect();
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
          <RoomPhotos photos={ROOM_PHOTOS} at={at} onPick={(i) => showRoom(ROOM_PHOTOS[i]!.room)} hold={hold} />
        </div>
        <section className={styles.plan} aria-labelledby="flat-name">
          <header className={styles.head}>
            {/* <h2 id="flat-name" className={styles.big}>
              <span className={styles.intro}>
                Seek your <span className={styles.accent}>favorite</span> furniture.
              </span>
              <span className={styles.name}>Customize for your space.</span>
            </h2>
            <p className={styles.lede}>
              No question too small, no change too many.
              <br />
              Just chat, and our AI Interior Consultant answers right away, day or night.
            </p> */}
            <FurnitureWord />
            <div className={styles.pitch}>
              <p className={styles.pitchLine}>Ready-made and modular furniture for Singapore homes and small offices.</p>
              <div className={styles.pitchCalls}>
                <Link href={routes.collection} className={styles.pitchPrimary}>
                  See the furniture
                </Link>
                <Link href={routes.quiz} className={styles.pitchCall}>
                  Get help choosing
                </Link>
              </div>
            </div>
          </header>
          <div ref={slot} className={styles.slot}>
            <div ref={drawing} className={styles.drawing} {...hold}>
              <FloorPlan grid linked={LINKED} active={pick} onRoom={showRoom} />
            </div>
          </div>
          {/* a nudge that there is more below, and the way down to it */}
          <a className={styles.more} href="#how">
            See it in a real flat
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </section>
        <div ref={drawingEnd} className={styles.drawingEnd} />
        {/* the flat in 3D, over the plan's side, from the second step */}
        <div ref={walkBox} className={styles.walk}>
          {walkOn && <WalkView goRef={walkTo} fitRef={walkFit} />}
          {stop >= FIRST_ORDER_STEP && (
            <OrderCard step={stop - FIRST_ORDER_STEP} finish={finish} placed={placed} stage={leg} built={built} />
          )}
        </div>
        <div className={styles.ruler}>
          <Ruler rooms={STEPS.length} at={stop} />
        </div>
        {/* the tour, on the left as the plan takes the stage */}
        <div className={styles.tour} aria-hidden={!wide}>
          <h2 className={styles.tourHead}>
            <span className={styles.headLines}>
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
            <p ref={numeral} className={styles.numeral} aria-hidden="true">
              {pad(stop + 1)}
            </p>
            {/* keyed, so a room picked on the first step comes in afresh */}
            <div key={stop === 0 ? pick : "step"} className={styles.about} data-picked={stop === 0 || undefined}>
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
