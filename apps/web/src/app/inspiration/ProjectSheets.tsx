"use client";

import Image from "next/image";
import { type FocusEvent, useEffect, useRef, useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { type Box, FLAT, ROOMS, type Room, WALL } from "@/features/plan/flat";
import { routes } from "@/lib/routes";
import { ArrowLink } from "../studio/ArrowLink";
import { ROOM_PHOTOS } from "../studio/rooms";
import { PROJECTS } from "./projects";
import styles from "./ProjectSheets.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** The drawn sheet's shape, width to height: the photo's, so the two trade places cleanly. */
const ASPECT = 1.6;

/** Paper round a room on its drawn sheet, mm: room for the dimension lines and a little of the rooms next door. */
const PAPER = 1200;

/** How far out from a room's wall its dimension lines run, mm. */
const DIM_OUT = 750;

/** Screens wider than this hold the sheets still and run them across as the page scrolls; narrower ones stack them. */
const PINNED = "(min-width: 800px)";

/** A room with paper round it, widened or deepened to the sheet's shape. */
function frameOf(r: Room): Box {
  let w = r.w + 2 * PAPER;
  let h = r.d + 2 * PAPER;
  if (w / h < ASPECT) w = h * ASPECT;
  else h = w / ASPECT;
  const [cx, cy] = [r.x + r.w / 2, r.y + r.d / 2];
  return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
}

/**
 * Over a room's part of the plan: the rooms round it faded back to the
 * paper, the room washed in orange, and its width along its north side and
 * its depth down its west, as an architect dimensions them: a line with
 * slashed ends and the length on it, in mm.
 */
function Dimensions({ room: r, frame: [f0, g0, f1, g1] }: { room: Room; frame: Box }) {
  const top = r.y - DIM_OUT;
  const left = r.x - DIM_OUT;
  const tick = (x: number, y: number) => `M${x - 70} ${y + 70}L${x + 70} ${y - 70}`;
  const [h0, k0, h1, k1] = [r.x - WALL, r.y - WALL, r.x + r.w + WALL, r.y + r.d + WALL];
  return (
    <g className={styles.dims}>
      <path className={styles.fade} fillRule="evenodd" d={`M${f0} ${g0}H${f1}V${g1}H${f0}ZM${h0} ${k0}V${k1}H${h1}V${k0}Z`} />
      <rect className={styles.wash} x={r.x} y={r.y} width={r.w} height={r.d} />
      <path
        d={[
          `M${r.x} ${top}H${r.x + r.w}`,
          `M${r.x} ${top - 150}V${r.y - 200}M${r.x + r.w} ${top - 150}V${r.y - 200}`,
          tick(r.x, top),
          tick(r.x + r.w, top),
          `M${left} ${r.y}V${r.y + r.d}`,
          `M${left - 150} ${r.y}H${r.x - 200}M${left - 150} ${r.y + r.d}H${r.x - 200}`,
          tick(left, r.y),
          tick(left, r.y + r.d),
        ].join("")}
      />
      <text x={r.x + r.w / 2} y={top} fontSize={170}>
        {r.w}
      </text>
      <text x={left} y={r.y + r.d / 2} fontSize={170} transform={`rotate(-90 ${left} ${r.y + r.d / 2})`}>
        {r.d}
      </text>
    </g>
  );
}

/**
 * The ideas, set out like the sheets of a drawing set. On wider
 * screens the section holds the screen while the page scrolls, and the
 * sheets run across it from right to left: first the intro, then a sheet for
 * each idea, then a count and a call, with which sheet is in view at the
 * top right and how far along at the foot. Each sheet shows its room on the
 * plan (its part of it, dimensioned) or as a mood photo, and
 * either can be turned to; under it, its name, its words and its title block.
 */
export function ProjectSheets() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [views, setViews] = useState(() => PROJECTS.map((p) => p.view));
  const [current, setCurrent] = useState(0);

  // Run the rail across as the page scrolls past the section, one pixel down for one across.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const rail = railRef.current;
    if (!section || !stage || !rail) return;
    const wide = window.matchMedia(PINNED);
    let run = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const sheets = [...rail.querySelectorAll<HTMLElement>("[data-sheet]")];
      if (wide.matches) {
        const along = Math.min(run, Math.max(0, -section.getBoundingClientRect().top));
        section.style.setProperty("--x", `${along}px`);
        section.style.setProperty("--along", run ? String(along / run) : "0");
      }
      // the sheet nearest the middle of the screen, across or down
      const mid = wide.matches ? window.innerWidth / 2 : window.innerHeight / 2;
      let best = 0;
      let bestOff = Infinity;
      sheets.forEach((s, i) => {
        const b = s.getBoundingClientRect();
        const off = Math.abs((wide.matches ? b.left + b.width / 2 : b.top + b.height / 2) - mid);
        if (off < bestOff) [best, bestOff] = [i, off];
      });
      setCurrent(best);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      run = wide.matches ? Math.max(0, rail.scrollWidth - stage.clientWidth) : 0;
      section.style.setProperty("--run", `${run}px`);
      if (!wide.matches) {
        section.style.removeProperty("--x");
        section.style.removeProperty("--along");
      }
      schedule();
    };

    const resized = new ResizeObserver(measure);
    resized.observe(stage);
    resized.observe(rail);
    wide.addEventListener("change", measure);
    window.addEventListener("scroll", schedule, { passive: true });
    measure();
    return () => {
      resized.disconnect();
      wide.removeEventListener("change", measure);
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  /** A sheet off the screen that takes the keyboard's focus is scrolled into the middle. */
  const bringIntoView = (e: FocusEvent<HTMLElement>) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !window.matchMedia(PINNED).matches) return;
    const sheet = e.currentTarget;
    const run = section.offsetHeight - window.innerHeight;
    const x = Math.min(run, Math.max(0, sheet.offsetLeft - (stage.clientWidth - sheet.offsetWidth) / 2));
    const top = section.getBoundingClientRect().top + window.scrollY + x;
    if (Math.abs(top - window.scrollY) > 1) window.scrollTo({ top });
  };

  const turn = (i: number, view: "plan" | "photo") => setViews((v) => v.map((old, j) => (j === i ? view : old)));

  return (
    <section ref={sectionRef} className={styles.projects} aria-labelledby="projects-title">
      <div ref={stageRef} className={styles.stage}>
        <p className={styles.counter} aria-hidden="true">
          {pad(current + 1)} of {pad(PROJECTS.length)} sheets
        </p>

        <div ref={railRef} className={styles.rail}>
          <div className={styles.intro}>
            <p className={styles.index}>
              <span>Ideas for your home</span>
            </p>
            <div className={styles.introBody}>
              <h1 id="projects-title" className={styles.title}>
                Ideas for your home
              </h1>
              <p className={styles.lede}>
                These are ideas, not finished jobs. Each shows a room on an example HDB plan, then a mood photo. The furniture in the photos is not ours.
              </p>
              <ArrowLink href={routes.products}>See the furniture</ArrowLink>
            </div>
          </div>

          <ol className={styles.sheets}>
            {PROJECTS.map((p, i) => {
              const room = ROOMS.find((r) => r.key === p.room);
              const frame = room && frameOf(room);
              const photo = ROOM_PHOTOS.find((ph) => ph.room === p.room);
              const view = views[i];
              const sheetNo = pad(i + 1);
              return (
                <li key={p.slug} className={styles.sheet} data-sheet onFocus={bringIntoView}>
                  <div className={styles.figure} data-view={view}>
                    {photo && (
                      <Image
                        className={styles.photo}
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 800px) 100vw, 46vw"
                        placeholder="blur"
                        aria-hidden={view !== "photo"}
                      />
                    )}
                    {room && frame && (
                      <div className={styles.drawing} aria-hidden={view !== "plan"}>
                        <FloorPlan frame={frame} label={`Plan of the ${room.name.toLowerCase()}, ${room.w} by ${room.d} mm`}>
                          <Dimensions room={room} frame={frame} />
                        </FloorPlan>
                      </div>
                    )}
                    <div className={styles.tabs} role="group" aria-label={`Show ${p.title} as`}>
                      {(["plan", "photo"] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          className={styles.tab}
                          aria-pressed={view === v}
                          onClick={() => turn(i, v)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.caption}>
                    <div>
                      <h2 className={styles.name}>{p.title}</h2>
                      <p className={styles.body}>{p.body}</p>
                    </div>
                    <dl className={styles.block}>
                      <dt className="visually-hidden">Status</dt>
                      <dd>Concept</dd>
                      <dt className="visually-hidden">Flat</dt>
                      <dd>
                        {FLAT.name} {FLAT.kind}
                      </dd>
                      {room && (
                        <>
                          <dt className="visually-hidden">Floor area</dt>
                          <dd>{((room.w * room.d) / 1e6).toFixed(1)} m²</dd>
                        </>
                      )}
                      <dt className="visually-hidden">Sheet</dt>
                      <dd className={styles.sheetNo}>{sheetNo}</dd>
                    </dl>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.end}>
            <p className={styles.count}>{pad(PROJECTS.length)} ideas so far</p>
            <ArrowLink href={routes.contact}>Talk to us about yours</ArrowLink>
          </div>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressBar} />
        </div>
      </div>
    </section>
  );
}
