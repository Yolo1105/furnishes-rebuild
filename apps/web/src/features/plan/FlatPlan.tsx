"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AC_LEDGE, BAYS, BOUNDS_M, OUTER_WALL, ROOMS, sidesOf } from "./flat";
import styles from "./FlatPlan.module.css";
import { makeRig, STOPS } from "./rig";
import { addSheet, buildFlatScene } from "./scene";

/** The flat's bounds on the ground, m: [x0, z0, x1, z1]. */
const FLAT = [BOUNDS_M.x0, BOUNDS_M.y0, BOUNDS_M.x1, BOUNDS_M.y1] as const;

/**
 * How far a room's box reaches past its floor, m, when it is picked out
 * alone: to the far face of a wall it shares (so it has the whole wall), or
 * just past an outside wall; further where what stands out from that wall is
 * the room's too (a bay window, the A/C ledge).
 */
const SHARED = 0.21; // the face is at 0.2; just past it, so the clip never lies on it and flickers
const OUTSIDE = 0.12;
const outTo = (r: (typeof ROOMS)[number], side: number) => {
  if (side === 1 && AC_LEDGE.y0 >= r.y && AC_LEDGE.y1 <= r.y + r.d) return (AC_LEDGE.x1 - (r.x + r.w)) / 1000 + 0.05;
  const bay = BAYS.find((b) => b.x0 >= r.x && b.x1 <= r.x + r.w);
  if (side === 2 && r.y === 0 && bay) return (bay.depth + OUTER_WALL) / 1000 + 0.05;
  return OUTSIDE;
};

/** Each room's box on the ground, m [x0, z0, x1, z1], by its key: what is drawn as that room. */
const BOXES = new Map(
  ROOMS.map((r) => {
    const [w, e, n, s] = sidesOf(r).map((side, i) => (side.inner.length ? SHARED : outTo(r, i)));
    return [r.key, [r.x / 1000 - w!, r.y / 1000 - n!, (r.x + r.w) / 1000 + e!, (r.y + r.d) / 1000 + s!] as const];
  }),
);

/** Room left round the plan, px: at its sides and foot, and below the bar. */
const BREATHE = 40;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * The whole flat as the walk draws it at its plan stage, held still: every
 * wall, door, window and room name, and the furniture and fittings drawn as
 * a plan draws them, every line in full ink, with no grid round it, no tile
 * joints and its floors unfilled; fitted, centred, into one half of its
 * (positioned) parent below the bar (`side`; all of it on phones held
 * upright), the page's background showing round it. With a `highlight` (a
 * room's key, flat.ts), that room stands out in full and the rest of the
 * flat sits faded behind it. Without WebGL it says so instead.
 */
export function FlatPlan({ side = "left", highlight = null }: { side?: "left" | "right"; highlight?: string | null }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLParagraphElement>(null);
  const highlightRef = useRef(highlight);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    // a canvas of its own each time: one whose context was let go (see the
    // cleanup) can't be drawn on again, as when React runs this twice
    const canvas = document.createElement("canvas");
    canvas.className = styles.canvas!;
    // under it, the whole flat, faded, while one room stands out on the canvas
    const under = document.createElement("canvas");
    under.className = `${styles.canvas} ${styles.under}`;
    holder.append(under, canvas);
    const underCtx = under.getContext("2d");

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      canvas.remove();
      under.remove();
      fallbackRef.current?.removeAttribute("hidden");
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const palette = { paper: css("--color-paper"), ink: css("--color-ink") };
    const { scene, cut, lineMats, disposables, rise, reveal, roomBox } = buildFlatScene(palette, { floors: false });
    rise(0); // a flat drawing
    const camera = new THREE.PerspectiveCamera(2, 1, 1, 500);
    camera.rotation.order = "YXZ";
    const corner = new THREE.Vector3();
    const coarse = window.matchMedia("(pointer: coarse)");

    const draw = () => {
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      if (!w || !h) return; // drawn again by the observer once it has a size
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.5 : 2));
      renderer.setSize(w, h, false);
      for (const m of lineMats) m.resolution.set(w, h);
      const o = makeRig(w / h)(STOPS.sheet);
      camera.aspect = w / h;
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      cut.constant = o.cut;
      // where the flat falls on the view, then zoom and shift it into the space below the bar
      const [x0, z0, x1, z1] = FLAT;
      const a = corner.set(x0, 0, z0).project(camera).clone();
      const b = corner.set(x1, 0, z1).project(camera);
      const [ax, bx] = [((a.x + 1) / 2) * w, ((b.x + 1) / 2) * w];
      const [ay, by] = [((1 - a.y) / 2) * h, ((1 - b.y) / 2) * h];
      const flat = { cx: (ax + bx) / 2, cy: (ay + by) / 2, w: Math.abs(bx - ax), h: Math.abs(by - ay) };
      const top = parseFloat(css("--nav-h")) + BREATHE;
      const space = { cx: w / 2, cy: (top + h - BREATHE) / 2, w: w - 2 * BREATHE, h: h - BREATHE - top };
      const z = Math.min(space.w / flat.w, space.h / flat.h);
      camera.setViewOffset(w, h, flat.cx - space.cx / z, flat.cy - space.cy / z, w / z, h / z);
      // the whole flat; then, with a room picked out, that copied under and the room alone over it
      reveal(FLAT, 1);
      renderer.render(scene, camera);
      const room = highlightRef.current && BOXES.get(highlightRef.current);
      holder.toggleAttribute("data-picked", Boolean(room));
      if (room && underCtx) {
        [under.width, under.height] = [canvas.width, canvas.height];
        underCtx.drawImage(canvas, 0, 0);
        renderer.clear();
        reveal(room, 0);
        renderer.render(scene, camera);
      }
    };
    redrawRef.current = draw;

    const sized = new ResizeObserver(draw);
    sized.observe(canvas);
    const lost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", draw);

    // the notes are drawn in the site's mono face, once it has loaded
    let alive = true;
    const font = css("--font-space-mono") || "monospace";
    document.fonts.load(`700 40px ${font}`).finally(() => {
      if (!alive) return;
      const sheet = addSheet(scene, palette, font, disposables, lineMats, roomBox, { grid: false, tiles: false, solid: true });
      sheet.fade(1);
      sheet.furnishTo(FLAT[2] + 1); // every piece, right across the flat
      draw();
    });
    draw();

    return () => {
      alive = false;
      sized.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", draw);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      under.remove();
    };
  }, []);

  // another room picked out: draw again
  useEffect(() => {
    highlightRef.current = highlight;
    redrawRef.current();
  }, [highlight]);

  return (
    <>
      <div ref={holderRef} className={styles.holder} data-side={side} role="img" aria-label="The plan of a 5-room HDB flat, furnished" />
      <p ref={fallbackRef} className={styles.fallback} hidden>
        This view needs WebGL, which this browser has turned off.
      </p>
    </>
  );
}
