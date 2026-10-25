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
import { makeRig, STOPS } from "./rig";
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
const INTRO_ZOOM = 1.8;
/** The middle of the living room, which the opening's close-up is on, m. */
const LIVING = new THREE.Vector3(12.65, 0, 3.15);
/** The living room with its walls, [x0, z0, x1, z1] m: shown alone first. */
const LIVING_ROOM = [9.3, -0.15, 16.1, 6.5] as const;
/** Through the opening (0 to 1): when the rest of the flat grows in round the living room, and the view pulls back. */
/** How far the plan sits off centre, as shares of the width, beside 01 and beside 02. */
const ASIDE = { one: 0.1, two: -0.12 };
const WHOLE = { from: 0.62, to: 0.9 };

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
    const projected = new THREE.Vector3();

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
    const steer = () => {
      const r = track.getBoundingClientRect();
      const lead = introPx();
      const run = r.height - window.innerHeight - lead; // the walk's own scroll
      const from = lead + run * PANEL_OPEN; // px scrolled when the panel opens
      const want = -r.top >= from;
      if (want !== open) {
        open = want;
        panel.toggleAttribute("data-open", open);
        // the bar turns brown while the panel is in
        document.documentElement.toggleAttribute("data-walk-panel", open);
      }
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
        const z = INTRO_ZOOM + (1 - INTRO_ZOOM) * whole;
        // the plan stands clear of the words beside it: right of centre beside
        // 01, left of it beside 02, back to the middle as the walls rise
        // (it holds until 02 has all but gone, so the two never cross)
        const notesNow = smooth(Math.min(1, (1 - smooth(stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE))) / 0.25));
        const [w, h] = [canvas.clientWidth, canvas.clientHeight];
        const d = (ASIDE.one + (ASIDE.two - ASIDE.one) * whole) * w * notesNow;
        if (z > 1.001 || Math.abs(d) > 0.5) {
          // find the living room on the whole view, not on last frame's close-up
          camera.clearViewOffset();
          camera.updateMatrixWorld();
          projected.copy(LIVING).project(camera);
          // close on the living room, the anchor sliding to the flat's middle as it pulls back
          const ax = ((projected.x + 1) / 2) * w * (1 - whole) + (w / 2) * whole;
          const ay = ((1 - projected.y) / 2) * h * (1 - whole) + (h / 2) * whole;
          camera.setViewOffset(w, h, ax - (w / 2 + d) / z, ay - h / (2 * z), w / z, h / z);
        } else camera.clearViewOffset();
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
      // each step is as long as its stage, so it is up while the stage plays
      // out; the last runs on a screen further, so it ends with the walk
      const run = track.offsetHeight - window.innerHeight - introPx();
      // (after an opening the panel has no step for the plan: its first ends with the walls)
      const ends = opening ? STEP_ENDS.slice(1) : STEP_ENDS;
      steps.forEach((step, i) => {
        const from = i ? ends[i - 1]! : PANEL_OPEN;
        const extra = i === steps.length - 1 ? panel.clientHeight : 0;
        step.style.setProperty("--step-h", `${(ends[i]! - from) * run + extra}px`);
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
      opening.toggleAttribute("data-light-under-bar", q < 0.4); // until the sketch's paper has gone
    };

    // Ease the camera towards the scroll, then stop drawing until it moves.
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      if (eased !== shown || q !== qShown) draw(eased);
      if (eased !== target) raf = requestAnimationFrame(tick);
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
