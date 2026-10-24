"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LivingGradient } from "@/features/stage/LivingGradient";
import { WASH_CSS } from "@/features/stage/wash";
import { routes } from "@/lib/routes";
import { CEILING, floorOf, ROOMS } from "./flat";
import styles from "./PlanWalk.module.css";
import { makeRig, STOPS } from "./rig";
import { addSheet, buildFlatScene } from "./scene";

/**
 * The landing's first screen: the flat drawn as a plan over the moving
 * orange wash, in a tall stretch of page whose scroll drives one camera.
 * Scrolling raises the walls out of the drawing, brings the camera down to
 * the front door, and walks it into the living room. The 3D canvas is clear,
 * so the wash shows round the flat and above its walls.
 */

/** The flat's floor area, every room's clear floor added up, m². */
const AREA = ROOMS.reduce((sum, r) => {
  const f = floorOf(r);
  return sum + ((f.x1 - f.x0) * (f.y1 - f.y0)) / 1e6;
}, 0);

/** The spec sheet beside the plan, as a drawing's side panel has it. */
const SPEC = [
  ["Flat", "5-room HDB"],
  ["Floor area", `≈ ${Math.round(AREA)} m²`],
  ["Bedrooms", "3"],
  ["Bathrooms", "2"],
  ["Ceiling", `${(CEILING / 1000).toFixed(1)} m`],
] as const;

/** How far the eased progress closes on the scroll each frame. */
const EASE = 0.12;
/** Over how much of the walk the plan's drawing notes fade, once the walls start to rise. */
const NOTES_FADE = 0.12;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function PlanWalk() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    if (!track || !sticky || !canvas) return;

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

    const draw = (s: number) => {
      const o = rig(s);
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
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

    // Ease the camera towards the scroll, then stop drawing until it moves.
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      if (eased !== shown) draw(eased);
      if (eased !== target) raf = requestAnimationFrame(tick);
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

        <div className={styles.pitch}>
          <p className={styles.kicker}>Furnishes · 5-room HDB</p>
          <h1 className={styles.headline}>Every home starts as a plan.</h1>
          <p className={styles.lede}>
            Scroll to walk into this one. Every piece in it is made to measure, and yours to change.
          </p>
          <Link href={routes.studio} className={styles.cta}>
            Design your room
          </Link>
          <p className={styles.scroll} aria-hidden="true">
            Scroll ↓
          </p>
        </div>

        <aside className={styles.spec} aria-label="About this flat">
          <dl className={styles.rows}>
            {SPEC.map(([term, value]) => (
              <div key={term} className={styles.row}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.keyTitle}>Key</p>
          <ul className={styles.key}>
            <li>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 14V2M3 2a12 12 0 0 1 12 12" />
              </svg>
              Door, and its swing
            </li>
            <li>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 4.5h13v7h-13zM1.5 4.5l13 7M1.5 11.5l13-7" />
              </svg>
              Built-in wardrobe
            </li>
            <li>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1 5.5h14M1 10.5h14M5.5 1v14M10.5 1v14" />
              </svg>
              Grid, 1 m
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
