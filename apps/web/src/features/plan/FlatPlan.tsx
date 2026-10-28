"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { BOUNDS_M } from "./flat";
import styles from "./FlatPlan.module.css";
import { makeRig, STOPS } from "./rig";
import { addSheet, buildFlatScene } from "./scene";

/** The flat's bounds on the ground, m: [x0, z0, x1, z1]. */
const FLAT = [BOUNDS_M.x0, BOUNDS_M.y0, BOUNDS_M.x1, BOUNDS_M.y1] as const;

/** Room left round the plan, px: at its sides and foot, and below the bar. */
const BREATHE = 40;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * The whole flat as the walk draws it at its plan stage, held still: every
 * wall, door, window and room name, and the furniture and fittings drawn as
 * a plan draws them, with no grid round it; fitted, centred, into the left
 * half of its (positioned) parent below the bar (all of it on phones held
 * upright), the page's background showing round it. Without WebGL it says
 * so instead.
 */
export function FlatPlan() {
  const holderRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    // a canvas of its own each time: one whose context was let go (see the
    // cleanup) can't be drawn on again, as when React runs this twice
    const canvas = document.createElement("canvas");
    canvas.className = styles.canvas!;
    holder.append(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      canvas.remove();
      fallbackRef.current?.removeAttribute("hidden");
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const palette = { paper: css("--color-paper"), ink: css("--color-ink") };
    const { scene, cut, lineMats, disposables, rise, reveal, roomBox } = buildFlatScene(palette);
    // the whole flat, as a flat drawing
    reveal(FLAT, 1);
    rise(0);
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
      renderer.render(scene, camera);
    };

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
      const sheet = addSheet(scene, palette, font, disposables, lineMats, roomBox, false); // no ground grid
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
    };
  }, []);

  return (
    <>
      <div ref={holderRef} className={styles.holder} role="img" aria-label="The plan of a 5-room HDB flat, furnished" />
      <p ref={fallbackRef} className={styles.fallback} hidden>
        This view needs WebGL, which this browser has turned off.
      </p>
    </>
  );
}
