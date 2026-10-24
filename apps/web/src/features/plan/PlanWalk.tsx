"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { LivingGradient } from "@/features/stage/LivingGradient";
import { WASH_CSS } from "@/features/stage/wash";
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

/** How far the eased progress closes on the scroll each frame. */
const EASE = 0.12;
/** Over how much of the walk the plan's drawing notes fade, once the walls start to rise. */
const NOTES_FADE = 0.12;

/** The captions, each shown over a stretch of the walk [from, to]. */
const CAPTIONS = [
  { from: 0, to: 0.1, no: "01", text: "Every home starts as a plan." },
  { from: 0.16, to: 0.4, no: "02", text: "Here it is drawn to scale: a 5-room HDB flat." },
  { from: 0.7, to: 1.01, no: "03", text: "Step inside. Everything in it you can change." },
];

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function PlanWalk() {
  const trackRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [caption, setCaption] = useState<number>(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!track || !canvas) return;

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
      sheet?.fade(1 - t * t * (3 - 2 * t));
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
      setCaption(CAPTIONS.findIndex((c) => eased >= c.from && eased < c.to));
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
      <div className={styles.sticky} style={{ backgroundImage: WASH_CSS }}>
        <LivingGradient />
        {failed ? (
          <p className={styles.fallback}>This view needs WebGL, which this browser has turned off.</p>
        ) : (
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        )}
        {CAPTIONS.map((c, i) => (
          <p key={c.no} className={styles.caption} data-on={i === caption ? "true" : undefined}>
            <span className={styles.no}>{c.no}</span>
            {c.text}
          </p>
        ))}
      </div>
    </section>
  );
}
