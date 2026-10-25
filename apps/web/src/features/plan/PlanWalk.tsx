"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { LivingGradient } from "@/features/stage/LivingGradient";
import { WASH_CSS } from "@/features/stage/wash";
import { routes } from "@/lib/routes";
import button from "./InkButton.module.css";
import styles from "./PlanWalk.module.css";
import { BOUNDS } from "./flat";
import { makeRig, STOPS } from "./rig";
import { dampScroll } from "./dampScroll";
import { addSheet, buildFlatScene } from "./scene";
import { WalkPanel } from "./WalkPanel";

/**
 * The landing's first screen: the flat drawn as a plan over the moving
 * orange wash, in a tall stretch of page whose scroll drives one camera.
 * Scrolling raises the walls out of the drawing, brings the camera down to
 * the front door, and walks it into the living room. The 3D canvas is clear,
 * so the wash shows round the flat and above its walls.
 */

/** How far the eased progress closes on the scroll each frame. */
const EASE = 0.12;
/** Over how much of the walk the plan's drawing notes fade, once the walls start to rise. */
const NOTES_FADE = 0.06;
/** Where in the walk the side panel opens: once the walls are well on their way up. It stays open to the end. */
const PANEL_OPEN = STOPS.sheet + 0.06;
/** Where in the walk each of the panel's steps ends: one step to a stage. */
const STEP_ENDS = [STOPS.lifted, STOPS.landed, STOPS.walked, STOPS.built, STOPS.finished, 1];

/** How far through the stretch from a to b the walk is, 0 to 1. */
const stage = (s: number, a: number, b: number) => Math.min(1, Math.max(0, (s - a) / (b - a)));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** A step is shown once its top is this far up the panel. */
const SHOW_AT = 0.55;

/**
 * With an opening (`intro`), this many screens of scroll come before the
 * walk itself: the --intro-length in globals.css. The camera starts this
 * much closer, on the living room, and pulls back to the whole flat as the
 * opening ends.
 */
const INTRO_SCREENS = 4.5;
/** The closest the opening comes on the living room (less close if the room would not fit beside the panel). */
const INTRO_ZOOM = 1.8;
/** The living room with its walls, [x0, z0, x1, z1] m: shown alone first. */
const LIVING_ROOM = [9.3, -0.15, 16.1, 6.5] as const;
/** The whole flat, the same way. */
const FLAT = [BOUNDS.x0 / 1000, BOUNDS.y0 / 1000, BOUNDS.x1 / 1000, BOUNDS.y1 / 1000] as const;
/** Room left round the plan inside the space the panel leaves it, px. */
const BREATHE = 40;
/** Through the opening (0 to 1): when the rest of the flat grows in round the living room, and the view pulls back. */
const WHOLE = { from: 0.62, to: 0.9 };
/** Through the opening: when the photo has gone and the panel comes in on the one room. */
const ROOM_SHOWN = 0.2;
/** Through the opening: when the panel comes in, pushing the room, alone in the middle till then, over to its left. */
const PANEL_AT = 0.3;
/** How long the room takes to move aside as the panel slides in, ms: the panel's own --dur-panel. */
const PUSH_MS = 600;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * `intro`, if given, is laid over the walk and plays first: it is told how
 * far through it the scroll is with --intro (0 to 1) on the sticky view,
 * and marked data-scrolled once that is under way and data-done once past;
 * it should carry data-intro, and data-light-under-bar while it shows a
 * light picture. The walk's own title, button and cue give way to it.
 */
export function PlanWalk({ intro }: { intro?: ReactNode } = {}) {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!track || !sticky || !canvas || !panel) return;
    const scroller = panel.firstElementChild as HTMLElement;
    const steps = [...scroller.firstElementChild!.children] as HTMLElement[];
    const dots = [...panel.lastElementChild!.children];
    const opening = sticky.querySelector<HTMLElement>("[data-intro]");
    /** How many pixels of scroll the opening takes, before the walk. */
    const introPx = () => (opening ? window.innerHeight * INTRO_SCREENS : 0);
    let q = opening ? 0 : 1; // how far through the opening, 0 to 1
    let qShown = -1;
    const corner = new THREE.Vector3();
    // the space for the plan, px (set on resize): the whole screen, and what the panel leaves it
    type Space = { cx: number; cy: number; w: number; h: number };
    let full: Space = { cx: 0, cy: 0, w: 1, h: 1 };
    let beside: Space = full;
    // how far the room has been pushed aside by the panel, 0 to 1: it moves with
    // the panel's slide, in time, not with the scroll
    const push = { from: 0, to: 0, start: -Infinity };
    const pushNow = (now = performance.now()) => {
      const t = Math.min(1, (now - push.start) / PUSH_MS);
      return push.from + (push.to - push.from) * (still.matches ? 1 : t * t * t * (t * (t * 6 - 15) + 10));
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const palette = { paper: css("--color-paper"), ink: css("--color-ink") };
    const { scene, cut, roomBox, lineMats, disposables, rise, later, reveal } = buildFlatScene(palette);
    const camera = new THREE.PerspectiveCamera(2, 1, 1, 500);
    camera.rotation.order = "YXZ";
    let rig = makeRig(1);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let shown = -1;
    let eased = 0;
    let raf = 0;
    let sheet: ReturnType<typeof addSheet> | null = null;

    let open = false;

    /**
     * Open or close the panel, scroll its steps, and show each as it comes
     * up. This follows the page's own scroll, not the eased camera: the
     * steps move one for one with the scroll, however fast, as if the
     * panel scrolled natively.
     */
    /**
     * Where the panel opens and where each of its steps ends, as px of page
     * scroll. After an opening it comes in on the one room: its first step
     * ends as the rest of the flat starts to grow in, its second once the
     * walls start to rise; from there, one step to each of the walk's stages.
     */
    const panelStops = () => {
      const lead = introPx();
      const run = track.offsetHeight - window.innerHeight - lead; // the walk's own scroll
      const at = (s: number) => lead + run * s;
      if (!opening) return [at(PANEL_OPEN), ...STEP_ENDS.map(at)];
      return [lead * PANEL_AT, lead * WHOLE.from, at(STOPS.sheet + 0.02), ...STEP_ENDS.slice(1).map(at)];
    };
    /**
     * Where the page comes to rest, px of scroll: one section to a scroll.
     * After an opening: the photo, then the room beside the panel (01: one
     * scroll shows the room and the panel pushing it aside, as one move), the
     * whole flat (02); then for the walk, each of its stages
     * played out, its own step still up in the panel.
     */
    const sections = () => {
      const lead = introPx();
      const run = track.offsetHeight - window.innerHeight - lead;
      const at = (s: number) => lead + run * s;
      const walk = [STOPS.lifted, STOPS.walked - 0.01, STOPS.built - 0.005, STOPS.finished - 0.005, STOPS.laid, 1].map(
        at,
      );
      if (!opening) return [0, at(STOPS.sheet), at(PANEL_OPEN + 0.02), ...walk];
      return [0, lead * (PANEL_AT + 0.08), lead * (WHOLE.to + 0.03), ...walk];
    };
    const steer = () => {
      const r = track.getBoundingClientRect();
      const from = panelStops()[0]!; // px scrolled when the panel opens
      const want = -r.top >= from;
      if (want !== open) {
        open = want;
        panel.toggleAttribute("data-open", open);
        Object.assign(push, { from: pushNow(), to: open ? 1 : 0, start: performance.now() });
        if (!raf) raf = requestAnimationFrame(tick);
        // the bar turns brown while the panel is in
        document.documentElement.toggleAttribute("data-walk-panel", open);
      }
      // once the photo is coming back, the panel is already gone and the room
      // back in the middle: nothing still sliding shows over the photo
      const snap = Boolean(opening) && q < ROOM_SHOWN + 0.02;
      panel.toggleAttribute("data-snap", snap);
      if (snap) Object.assign(push, { from: 0, to: 0, start: -Infinity });
      const y = Math.min(Math.max(0, -r.top - from), Math.max(0, scroller.scrollHeight - scroller.clientHeight));
      scroller.scrollTop = y;
      let up = 0;
      steps.forEach((step, i) => {
        const shown = open && step.offsetTop - y < panel.clientHeight * SHOW_AT;
        step.toggleAttribute("data-shown", shown);
        if (shown) up = i;
      });
      dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === up));
    };

    const draw = (s: number) => {
      const o = rig(s);
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
      camera.updateProjectionMatrix();
      if (opening) {
        // close on the living room through the opening, pulling back to the whole flat as it ends
        const whole = smooth(stage(q, WHOLE.from, WHOLE.to));
        // the living room alone, then the rest of the flat growing in round it
        reveal(LIVING_ROOM, whole);
        // the plan fits beside the panel (the one room, then the flat), then,
        // as the walls rise, frames as the walk does, the panel over it
        const hold = smooth(Math.min(1, (1 - smooth(stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE))) / 0.25));
        const [w, h] = [canvas.clientWidth, canvas.clientHeight];
        // where the living room and the flat fall on the whole view, not on last frame's close-up
        camera.clearViewOffset();
        camera.updateMatrixWorld();
        const box = ([x0, z0, x1, z1]: readonly [number, number, number, number]) => {
          const [a, b] = [corner.set(x0, 0, z0).project(camera).clone(), corner.set(x1, 0, z1).project(camera)];
          const [ax, bx] = [((a.x + 1) / 2) * w, ((b.x + 1) / 2) * w];
          const [ay, by] = [((1 - a.y) / 2) * h, ((1 - b.y) / 2) * h];
          return { cx: (ax + bx) / 2, cy: (ay + by) / 2, w: Math.abs(bx - ax), h: Math.abs(by - ay) };
        };
        const [room, flat] = [box(LIVING_ROOM), box(FLAT)];
        // alone in the middle, then pushed aside as the panel comes in
        const p = pushNow();
        const mix = (k: keyof Space) => full[k] + (beside[k] - full[k]) * p;
        const free = { cx: mix("cx"), cy: mix("cy"), w: mix("w"), h: mix("h") };
        const fit = (b: { w: number; h: number }) => Math.min(free.w / b.w, free.h / b.h);
        const zRoom = Math.min(INTRO_ZOOM, fit(room));
        const zFlat = 1 + (Math.min(1, fit(flat)) - 1) * hold;
        const z = zRoom + (zFlat - zRoom) * whole;
        // centred on the living room, then on the flat, in the middle of the free space
        const [ax, ay] = [room.cx + (flat.cx - room.cx) * whole, room.cy + (flat.cy - room.cy) * whole];
        const [tx, ty] = [free.cx + (w / 2 - free.cx) * (1 - hold), free.cy + (h / 2 - free.cy) * (1 - hold)];
        const [bx, by] = [ax + (w / 2 - ax) * (1 - hold), ay + (h / 2 - ay) * (1 - hold)];
        if (Math.abs(z - 1) > 0.001 || hold > 0.001) camera.setViewOffset(w, h, bx - tx / z, by - ty / z, w / z, h / z);
      }
      cut.constant = o.cut;
      // the room come to life: the bookcase built once the camera is at it,
      // then the materials, then the second layout
      later.build(stage(s, STOPS.walked + 0.05, STOPS.built));
      later.sweep(stage(s, STOPS.built + 0.02, STOPS.finished));
      later.layout(smooth(stage(s, STOPS.finished + 0.04, STOPS.laid)));
      const t = stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE);
      const notes = 1 - t * t * (3 - 2 * t);
      sheet?.fade(notes);
      // the plan opens empty; the furniture is drawn in with the first scroll
      // (after an opening, the plan arrives furnished)
      sheet?.furnish(opening ? 1 : smooth(stage(s, STOPS.sheet * 0.12, STOPS.sheet * 0.85)));
      // as the plan's symbols fade, the pieces they stand for rise out of the floor
      rise(1 - notes);
      // the page's own words beside the plan go with the plan's notes
      sticky.style.setProperty("--notes", notes.toFixed(3));
      sticky.toggleAttribute("data-walking", notes < 0.02);
      // the title goes as the walk reaches the front door (the panel's step 03)
      sticky.style.setProperty("--title", (1 - smooth(stage(s, STOPS.landed - 0.03, STOPS.landed))).toFixed(3));
      renderer.render(scene, camera);
      shown = s;
      qShown = q;
      canvas.dataset.progress = s.toFixed(3);
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      rig = makeRig(w / h);
      for (const m of lineMats) m.resolution.set(w, h);
      // the space the panel leaves the plan: left of it, or above it where it rises from the foot
      const pr = panel.getBoundingClientRect();
      const atFoot = pr.top > h * 0.25;
      const space = (x1: number, y1: number): Space => {
        const [x0, y0] = [BREATHE, parseFloat(css("--nav-h")) + BREATHE / 2];
        return { cx: (x0 + x1 - BREATHE) / 2, cy: (y0 + y1 - BREATHE) / 2, w: x1 - BREATHE - x0, h: y1 - BREATHE - y0 };
      };
      full = space(w, h);
      beside = space(atFoot ? w : pr.left, atFoot ? pr.top : h);
      // each step is as long as its stage, so it is up while the stage plays
      // out; the last runs on a screen further, so it ends with the walk
      const stops = panelStops();
      steps.forEach((step, i) => {
        const extra = i === steps.length - 1 ? panel.clientHeight : 0;
        step.style.setProperty("--step-h", `${stops[i + 1]! - stops[i]! + extra}px`);
      });
      steer();
      draw(eased);
    };

    /** Scroll progress through the walk, 0 at its start (after any opening) to 1 at its end. */
    const read = () => {
      const r = track.getBoundingClientRect();
      const lead = introPx();
      const run = r.height - window.innerHeight - lead;
      return run > 0 ? Math.min(1, Math.max(0, (-r.top - lead) / run)) : 0;
    };

    /** Follow the opening with the scroll: how far through it, and what of it is still showing. */
    const playIntro = () => {
      if (!opening) return;
      q = Math.min(1, Math.max(0, -track.getBoundingClientRect().top / introPx()));
      sticky.style.setProperty("--intro", q.toFixed(4));
      opening.toggleAttribute("data-scrolled", q > 0.01);
      opening.toggleAttribute("data-done", q >= 0.42); // the photo and its sketch have gone
      opening.toggleAttribute("data-light-under-bar", q < ROOM_SHOWN); // until the photo has gone
    };

    // Ease the camera towards the scroll, then stop drawing until it moves.
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      const pushing = opening && performance.now() - push.start < PUSH_MS + 50;
      if (eased !== shown || q !== qShown || pushing) draw(eased);
      if (eased !== target || pushing) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      playIntro();
      steer();
      target = read();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const sized = new ResizeObserver(resize);
    sized.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    // a scroll moves the page on a section, with some weight
    const undamp = dampScroll(sections);

    // The plan's notes are drawn in the site's mono face, once it has loaded;
    // sizing again gives their lines the canvas's resolution.
    let alive = true;
    const font = css("--font-space-mono") || "monospace";
    document.fonts.load(`700 40px ${font}`).finally(() => {
      if (!alive) return;
      sheet = addSheet(scene, palette, font, disposables, lineMats, roomBox);
      resize();
    });

    playIntro();
    target = read();
    eased = target;
    resize();

    return () => {
      alive = false;
      document.documentElement.removeAttribute("data-walk-panel");
      cancelAnimationFrame(raf);
      sized.disconnect();
      window.removeEventListener("scroll", onScroll);
      undamp();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className={intro ? `${styles.track} ${styles.withIntro}` : styles.track}
      aria-label="A walk through a home, from its plan"
    >
      {/* The wash in CSS until its canvas draws, as on every stage. */}
      <div ref={stickyRef} className={styles.sticky} style={{ backgroundImage: WASH_CSS }}>
        <LivingGradient />
        {failed ? (
          <p className={styles.fallback}>This view needs WebGL, which this browser has turned off.</p>
        ) : (
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        )}

        {intro ?? (
          <>
            <HeroTitle />

            <Link href={routes.studio} className={`${button.button} ${styles.cta}`}>
              Design your room
            </Link>

            <p className={styles.cue} aria-hidden="true">
              Scroll
              <svg viewBox="0 0 16 24">
                <path d="M8 2v19M2 15l6 6 6-6" />
              </svg>
            </p>
          </>
        )}

        {/* last, so it slides in over the button and the cue */}
        <WalkPanel ref={panelRef} afterOpening={Boolean(intro)} />
      </div>
    </section>
  );
}
