"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { LivingGradient } from "@/features/stage/LivingGradient";
import { WASH_CSS } from "@/features/stage/wash";
import styles from "./PlanWalk.module.css";
import { clamp01, smooth, stage } from "./ease";
import { BOUNDS_M } from "./flat";
import { makeRig, STOPS } from "./rig";
import { addSheet, buildFlatScene } from "./scene";
import { WalkPanel } from "./WalkPanel";

/**
 * The landing: an opening (`intro`, a photo of a room), then the flat drawn
 * as a plan over the moving orange wash, in a tall stretch of page whose
 * scroll drives one camera. Through the opening the plan comes in as one
 * room, beside the side panel, and grows into the whole flat; then the walls
 * rise out of the drawing, the camera comes down to the front door and walks
 * into the living room, and the room comes to life. The 3D canvas is clear,
 * so the wash shows round the flat and above its walls.
 */

/** How far the eased progress closes on the scroll each frame. */
const EASE = 0.12;
/** Over how much of the walk the plan's drawing notes fade, once the walls start to rise. */
const NOTES_FADE = 0.06;
/** Where in the walk each of the panel's steps from 03 (the walls) on ends: one step to a stage. */
const STEP_ENDS = [STOPS.landed, STOPS.walked, STOPS.built, STOPS.finished, 1];

/** A step is shown once its top is this far up the panel. */
const SHOW_AT = 0.55;

/**
 * This many screens of scroll go to the opening, before the walk itself (set
 * on the track as --intro-length). The camera starts closer, on the living
 * room, and pulls back to the whole flat as the opening ends.
 */
const INTRO_SCREENS = 4.5;
/** The closest the opening comes on the living room (less close if the room would not fit beside the panel). */
const INTRO_ZOOM = 1.8;
/** The living room with its walls, [x0, z0, x1, z1] m: shown alone first. */
const LIVING_ROOM = [9.3, -0.15, 16.1, 6.5] as const;
/** The whole flat, the same way. */
const FLAT = [BOUNDS_M.x0, BOUNDS_M.y0, BOUNDS_M.x1, BOUNDS_M.y1] as const;
/** Room left round the plan inside the space the panel leaves it, px. */
const BREATHE = 40;
/**
 * The opening's phases, as shares of it (0 to 1). They are the one place its
 * timing lives: PlanWalk sets the fades they drive on the sticky view
 * (--title, --photo, --plan), and the opening's CSS only reads them.
 */
/** The title, its button and the arrow fade out. */
const TITLE_GOES = { from: 0, to: 0.07 };
/** The photo fades straight to the wash beneath. */
const PHOTO_GOES = { from: 0.09, to: 0.19 };
/** The plan (the one room) fades in under it. */
const PLAN_COMES = { from: 0.15, to: 0.21 };
/** When the rest of the flat grows in round the living room, and the view pulls back. */
const WHOLE = { from: 0.6, to: 1 };
/** While the living room's furniture is drawn in, once the panel is in (till the flat grows round it). */
const FURNISH_ROOM = { from: 0.34, to: 0.58 };
/**
 * When the panel starts in and when it is all the way in, pushing the room (just shown in the middle) over to its left as it
 * comes. Both follow the scroll, so they are one move with the room's coming.
 */
const PANEL_AT = 0.21;
const PANEL_IN = 0.35;
/** How stiff the spring the panel's way in rides is, 1/s: it trails the scroll and eases in, about 4 / this seconds behind (and never lags on the way out). */
const PANEL_SPRING = 4.5;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Whether the page's opening loader has finished: it marks <html> with
 * data-loading while it plays, and the walk's 3D waits for it, so the two
 * never draw at once. Without that mark, the walk starts straight away.
 */
function useLoaderDone() {
  return useSyncExternalStore(
    (changed) => {
      const watch = new MutationObserver(changed);
      watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-loading"] });
      return () => watch.disconnect();
    },
    () => !document.documentElement.hasAttribute("data-loading"),
    () => false,
  );
}

/**
 * `intro` is laid over the walk and plays first. It must carry data-intro;
 * it is given its fades (--title, --photo) on the sticky view, and marked
 * data-scrolled once the scroll is under way, data-done once its photo has
 * gone, and data-light-under-bar while that light photo still shows.
 */
export function PlanWalk({ intro }: { intro: ReactNode }) {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const introEndRef = useRef<HTMLDivElement>(null);
  const loaderDone = useLoaderDone();

  useEffect(() => {
    if (!loaderDone) return;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    const introEnd = introEndRef.current;
    const opening = sticky?.querySelector<HTMLElement>("[data-intro]");
    const scroller = panel?.querySelector<HTMLElement>("[data-scroller]");
    if (!track || !sticky || !canvas || !panel || !introEnd || !opening || !scroller) return;
    const steps = [...panel.querySelectorAll<HTMLElement>("[data-step]")];
    const dots = [...panel.querySelectorAll("[data-dot]")];
    /** How many pixels of scroll the opening takes, before the walk: measured, so it is the track's own (vh, not the visible height, on phones). */
    const introPx = () => introEnd.offsetTop;
    let q = 0; // how far through the opening, 0 to 1
    let qEased = q; // the same, closing on it a share each frame as the walk's camera does, so the opening glides too
    // the opening has put the plan up, so the walk's scroll starts where the walls start to rise
    const walkFrom = STOPS.sheet;
    let qShown = -1;
    const corner = new THREE.Vector3();
    // the space for the plan, px (set on resize): the whole screen, and what the panel leaves it
    type Space = { cx: number; cy: number; w: number; h: number };
    let full: Space = { cx: 0, cy: 0, w: 1, h: 1 };
    let beside: Space = full;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // no WebGL: the sticky view says so in place of the canvas (see .fallback)
      sticky.toggleAttribute("data-no-webgl", true);
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
    const coarse = window.matchMedia("(pointer: coarse)");
    let target = 0;
    let shown = -1;
    let eased = 0;
    // how far in the panel is, 0 to 1: it chases the scroll on a spring
    let enter = 0;
    let enterSpeed = 0;
    let enterShown = -1;
    let ticked = 0; // the last frame's time
    let raf = 0;
    let sheet: ReturnType<typeof addSheet> | null = null;

    let open = false;
    let stepTops: number[] = []; // each step's top in the panel's scroll, measured on resize

    /**
     * Where the panel opens and where each of its steps ends, as px of page
     * scroll. It comes in on the one room: its first step ends as the rest
     * of the flat starts to grow in, its second once the walls start to
     * rise; from there, one step to each of the walk's stages.
     */
    const panelStops = () => {
      const lead = introPx();
      const run = track.offsetHeight - window.innerHeight - lead; // the walk's own scroll
      const at = (s: number) => lead + (run * (s - walkFrom)) / (1 - walkFrom);
      return [lead * PANEL_AT, lead * WHOLE.from, at(STOPS.sheet + 0.02), ...STEP_ENDS.map(at)];
    };
    /**
     * Open or close the panel, scroll its steps, and show each as it comes
     * up. This follows the page's own scroll, not the eased camera: the
     * steps move one for one with the scroll, however fast, as if the
     * panel scrolled natively.
     */
    const steer = () => {
      const r = track.getBoundingClientRect();
      const from = panelStops()[0]!; // px scrolled when the panel opens
      const want = -r.top >= from;
      if (want !== open) {
        open = want;
        panel.toggleAttribute("data-open", open);
        // the bar turns brown while the panel is in
        document.documentElement.toggleAttribute("data-walk-panel", open);
      }
      // half a panel behind the page, so each step takes over from the last
      // just as its stage starts in the room, not a screen before
      const y = Math.min(
        Math.max(0, -r.top - from - panel.clientHeight / 2),
        Math.max(0, scroller.scrollHeight - scroller.clientHeight),
      );
      scroller.scrollTop = y;
      let up = 0;
      steps.forEach((step, i) => {
        const shown = open && stepTops[i]! - y < panel.clientHeight * SHOW_AT;
        step.toggleAttribute("data-shown", shown);
        if (shown) up = i;
      });
      dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === up));
    };

    const draw = (s: number) => {
      // nothing to draw into yet (a hidden or zero-size view): sizes of 0
      // would make the camera's aspect NaN, and the scene can't render that
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      const o = rig(s);
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
      camera.updateProjectionMatrix();
      // the panel's way in (its top end leading, as when it slides), following
      // the scroll a little behind, the room it pushes aside moving with it
      const scrub = enter < 1;
      panel.toggleAttribute("data-scrub", scrub);
      if (scrub) {
        const [top, foot] = [enter / 0.8, (enter - 0.2) / 0.8].map((t) => smooth(clamp01(t)));
        panel.style.setProperty("--lead", `${(1 - top!) * 100}%`);
        panel.style.setProperty("--trail", `${(1 - foot!) * 100}%`);
      } else {
        panel.style.removeProperty("--lead");
        panel.style.removeProperty("--trail");
      }
      enterShown = enter;
      // close on the living room through the opening, pulling back to the whole flat as it ends
      const whole = smooth(stage(qEased, WHOLE.from, WHOLE.to));
      // the living room alone, then the rest of the flat growing in round it
      reveal(LIVING_ROOM, whole);
      // the plan fits beside the panel (the one room, then the flat), then,
      // over the whole of the walls' rise, comes to frame as the walk does,
      // the panel over it: in step with the camera's own move across to the
      // living room, so the two never pull the view opposite ways
      const hold = 1 - smooth(stage(s, STOPS.sheet + 0.04, STOPS.lifted));
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
      const p = smooth(enter);
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
      cut.constant = o.cut;
      // the room come to life: the bookcase built once the camera is at it,
      // then the materials, then the second layout
      later.build(stage(s, STOPS.walked + 0.05, STOPS.built));
      later.sweep(stage(s, STOPS.built + 0.02, STOPS.finished));
      later.layout(smooth(stage(s, STOPS.finished + 0.04, STOPS.laid)));
      const notes = 1 - smooth(stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE));
      sheet?.fade(notes);
      // the one room's furniture is drawn in across it once the panel is in
      const [x0, , x1] = LIVING_ROOM;
      sheet?.furnishTo(x0 + (x1 + 1 - x0) * smooth(stage(qEased, FURNISH_ROOM.from, FURNISH_ROOM.to)));
      // as the plan's symbols fade, the pieces they stand for rise out of the floor
      rise(1 - notes);
      renderer.render(scene, camera);
      shown = s;
      qShown = qEased;
      // the opening's own fades, on the eased progress too
      sticky.style.setProperty("--title", (1 - stage(qEased, TITLE_GOES.from, TITLE_GOES.to)).toFixed(3));
      sticky.style.setProperty("--photo", (1 - stage(qEased, PHOTO_GOES.from, PHOTO_GOES.to)).toFixed(3));
      sticky.style.setProperty("--plan", stage(qEased, PLAN_COMES.from, PLAN_COMES.to).toFixed(3));
      opening.toggleAttribute("data-done", qEased >= PHOTO_GOES.to);
      opening.toggleAttribute("data-light-under-bar", qEased < PHOTO_GOES.to);
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return; // sized again by the observer once it has a size
      // a little less sharp on touch screens (phones, tablets), to spare their GPUs and batteries
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.5 : 2));
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
      stepTops = steps.map((step) => step.offsetTop);
      steer();
      draw(eased);
    };

    /** Scroll progress through the walk, from where the opening leaves it to 1 at its end. */
    const read = () => {
      const r = track.getBoundingClientRect();
      const lead = introPx();
      const run = r.height - window.innerHeight - lead;
      const t = run > 0 ? clamp01((-r.top - lead) / run) : 0;
      return walkFrom + t * (1 - walkFrom);
    };

    /** Follow the opening with the scroll: how far through it, and what of it is still showing. */
    const playIntro = () => {
      q = clamp01(-track.getBoundingClientRect().top / introPx());
      opening.toggleAttribute("data-scrolled", q > 0.01);
    };

    // Ease the camera towards the scroll, then stop drawing until it moves.
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      qEased = still.matches ? q : qEased + (q - qEased) * EASE;
      if (Math.abs(q - qEased) < 1e-4) qEased = q;
      // the panel's way in chases the scroll on its spring
      const now = performance.now();
      const dt = Math.min(1 / 30, (now - ticked) / 1000);
      ticked = now;
      const goal = stage(q, PANEL_AT, PANEL_IN);
      enterSpeed += (PANEL_SPRING * PANEL_SPRING * (goal - enter) - 2 * PANEL_SPRING * enterSpeed) * dt;
      enter += enterSpeed * dt;
      // on the way back it never lags: it is out by the time the photo returns
      if (enter > goal) [enter, enterSpeed] = [goal, Math.min(0, enterSpeed)];
      if (still.matches || (Math.abs(goal - enter) < 1e-3 && Math.abs(enterSpeed) < 1e-2))
        [enter, enterSpeed] = [goal, 0];
      if (eased !== shown || qEased !== qShown || enter !== enterShown) draw(eased);
      if (eased !== target || qEased !== q || enter !== goal) raf = requestAnimationFrame(tick);
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
    // if the browser drops the 3D context (a GPU reset, too many tabs), three
    // rebuilds it on its return; draw again then
    const lost = (e: Event) => e.preventDefault();
    const restored = () => resize();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);

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
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss(); // free the context now, not when the browser gets round to it
    };
  }, [loaderDone]);

  return (
    <section
      ref={trackRef}
      className={styles.track}
      style={{ "--intro-length": `${INTRO_SCREENS * 100}vh` } as CSSProperties}
      aria-label="A walk through a home, from its plan"
    >
      {/* where the opening's scroll ends and the walk's begins (measured, see introPx) */}
      <div ref={introEndRef} className={styles.introEnd} aria-hidden="true" />
      {/* The wash in CSS until its canvas draws, as on every stage. */}
      <div ref={stickyRef} className={styles.sticky} style={{ backgroundImage: WASH_CSS }}>
        <LivingGradient />
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <p className={styles.fallback}>This view needs WebGL, which this browser has turned off.</p>

        {intro}

        {/* last, so it slides in over the opening */}
        <WalkPanel ref={panelRef} />
      </div>
    </section>
  );
}
