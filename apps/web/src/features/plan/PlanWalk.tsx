"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

/** The title's second word, a shade fainter than its first. */
const ECHOES = [0.9];


const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function PlanWalk() {
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

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const palette = { paper: css("--color-paper"), ink: css("--color-ink") };
    const { scene, cut, lineMats, disposables, later } = buildFlatScene(palette);
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
      const run = r.height - window.innerHeight;
      const from = run * PANEL_OPEN; // px scrolled when the panel opens
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
      cut.constant = o.cut;
      // the room come to life: the bookcase built once the camera is at it,
      // then the materials, then the second layout
      later.build(stage(s, STOPS.walked + 0.05, STOPS.built));
      later.sweep(stage(s, STOPS.built + 0.02, STOPS.finished));
      later.layout(smooth(stage(s, STOPS.finished + 0.04, STOPS.laid)));
      const t = stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE);
      const notes = 1 - t * t * (3 - 2 * t);
      sheet?.fade(notes);
      // the page's own words beside the plan go with the plan's notes
      sticky.style.setProperty("--notes", notes.toFixed(3));
      sticky.toggleAttribute("data-walking", notes < 0.02);
      renderer.render(scene, camera);
      shown = s;
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
      const run = track.offsetHeight - window.innerHeight;
      steps.forEach((step, i) => {
        const from = i ? STEP_ENDS[i - 1]! : PANEL_OPEN;
        const extra = i === steps.length - 1 ? panel.clientHeight : 0;
        step.style.setProperty("--step-h", `${(STEP_ENDS[i]! - from) * run + extra}px`);
      });
      steer();
      draw(eased);
    };

    /** Scroll progress through the track, 0 at its top to 1 at its end. */
    const read = () => {
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    };

    // Ease the camera towards the scroll, then stop drawing until it moves.
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      if (eased !== shown) draw(eased);
      if (eased !== target) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
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
      sheet = addSheet(scene, palette, font, disposables, lineMats);
      resize();
    });

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
    <section ref={trackRef} className={styles.track} aria-label="A walk through a home, from its plan">
      {/* The wash in CSS until its canvas draws, as on every stage. */}
      <div ref={stickyRef} className={styles.sticky} style={{ backgroundImage: WASH_CSS }}>
        <LivingGradient />
        {failed ? (
          <p className={styles.fallback}>This view needs WebGL, which this browser has turned off.</p>
        ) : (
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        )}

        <h1 className={styles.title} aria-label="Interior Revolution">
          <span className={styles.titleMain}>Interior</span>
          {ECHOES.map((o, i) => (
            <span key={i} className={styles.titleEcho} style={{ "--echo": o, "--i": i + 1 } as CSSProperties} aria-hidden="true">
              Revolution
            </span>
          ))}
        </h1>

        <Link href={routes.studio} className={`${button.button} ${styles.cta}`}>
          Design your room
        </Link>

        <p className={styles.cue} aria-hidden="true">
          Scroll
          <svg viewBox="0 0 16 24">
            <path d="M8 2v19M2 15l6 6 6-6" />
          </svg>
        </p>

        {/* last, so it slides in over the button and the cue */}
        <WalkPanel ref={panelRef} />
      </div>
    </section>
  );
}
