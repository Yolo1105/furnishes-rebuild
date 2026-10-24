"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
const NOTES_FADE = 0.12;
/**
 * The stretch of the walk the side panel is open for: in as the walls start
 * to rise, out just before the camera lands at the front door, so the walk
 * in is the whole screen.
 */
const PANEL = { open: STOPS.sheet + 0.02, close: STOPS.landed - 0.06 };
/** A step is shown once its top is this far up the panel. */
const SHOW_AT = 0.55;
/** How long the view takes to move aside for the panel, ms: the panel's own slide. */
const REFRAME_MS = 650;
/** How much of the free side the moved-aside view fills: a little under, so the flat stays whole. */
const REFRAME_FILL = 0.95;

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

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
    const content = panel.firstElementChild as HTMLElement;
    const steps = [...content.children] as HTMLElement[];
    const dots = [...panel.querySelectorAll("li")];

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
    const { scene, cut, lineMats, disposables } = buildFlatScene(palette);
    const camera = new THREE.PerspectiveCamera(2, 1, 1, 500);
    camera.rotation.order = "YXZ";
    let rig = makeRig(1);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let shown = -1;
    let eased = 0;
    let raf = 0;
    let sheet: ReturnType<typeof addSheet> | null = null;

    // The view moving aside for the panel, 0 (whole screen) to 1 (the free side).
    let open = false;
    const aside = { from: 0, to: 0, start: 0 };
    const asideAt = (now: number) => {
      const t = still.matches ? 1 : clamp01((now - aside.start) / REFRAME_MS);
      return aside.from + (aside.to - aside.from) * easeInOutQuart(t);
    };
    const moving = (now: number) => !still.matches && now - aside.start < REFRAME_MS;

    /** Shrink and shift the picture so it sits whole in the part of the screen the panel leaves. */
    const frameAside = (w: number, h: number, a: number) => {
      if (a <= 0) return camera.clearViewOffset();
      const wide = w >= h;
      const free = wide ? w - panel.offsetWidth : h - panel.offsetHeight;
      const k = 1 - a * (1 - Math.min(1, (free / (wide ? w : h)) * REFRAME_FILL));
      const [cx, cy] = wide ? [w / 2 - a * (w - free) / 2, h / 2] : [w / 2, h / 2 - a * (h - free) / 2];
      camera.setViewOffset(w * k, h * k, (w * k) / 2 - cx, (h * k) / 2 - cy, w, h);
    };

    /** Open or close the panel, scroll its steps with the walk, and show each as it comes up. */
    const steer = (s: number, now: number) => {
      const want = s >= PANEL.open && s < PANEL.close;
      if (want !== open) {
        open = want;
        panel.toggleAttribute("data-open", open);
        Object.assign(aside, { from: asideAt(now), to: open ? 1 : 0, start: now });
      }
      const p = clamp01((s - PANEL.open) / (PANEL.close - PANEL.open - NOTES_FADE / 2));
      const y = p * Math.max(0, content.scrollHeight - panel.clientHeight);
      content.style.transform = `translateY(${-y}px)`;
      let up = 0;
      steps.forEach((step, i) => {
        const shown = open && step.offsetTop - y < panel.clientHeight * SHOW_AT;
        step.toggleAttribute("data-shown", shown);
        if (shown) up = i;
      });
      dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === up));
    };

    const draw = (s: number) => {
      const now = performance.now();
      steer(s, now);
      const o = rig(s);
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
      frameAside(canvas.clientWidth, canvas.clientHeight, asideAt(now));
      camera.updateProjectionMatrix();
      cut.constant = o.cut;
      const t = Math.min(1, Math.max(0, (s - STOPS.sheet) / NOTES_FADE));
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
      draw(eased);
    };

    /** Scroll progress through the track, 0 at its top to 1 at its end. */
    const read = () => {
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    };

    // Ease the camera towards the scroll, then stop drawing until it moves
    // (or the view is still moving aside for the panel).
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      const now = performance.now();
      if (eased !== shown || moving(now)) draw(eased);
      if (eased !== target || moving(performance.now())) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
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
