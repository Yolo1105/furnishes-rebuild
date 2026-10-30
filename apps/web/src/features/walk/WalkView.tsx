"use client";

import { type RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { smooth, stage } from "./ease";
import { finishAt, ORDER } from "./order";
import { makeRig, STOPS } from "./rig";
import { addSheet, buildFlatScene } from "./scene";
import styles from "./WalkView.module.css";

/** How far the eased walk closes on where it is told to be each frame. */
const EASE = 0.12;
/** Over how much of the walk the plan's drawing notes fade, once the walls start to rise. */
const NOTES_FADE = 0.06;
/**
 * How far right, as a share of the canvas's width, the picture moves once the
 * walls start to rise: the rig's views look a little right of what they show,
 * to leave room for a panel on the right, and here the panel is on the left.
 */
const SHIFT = 0.12;

/**
 * Where a drawing of the flat already on the page puts it, in the canvas's
 * pixels: the flat's middle (BOUNDS's) and how many pixels a metre is.
 */
export type SheetFit = { x: number; y: number; pxPerM: number };

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * The flat in 3D, from its plan to the room come to life (the landing-page
 * branch's walk, on its own): one camera, set by the walk's progress (rig.ts,
 * 0 to 1). The holder sets where the walk should be through `goRef` and the
 * camera glides there; it draws only while it moves. `goRef` is empty while
 * there is no 3D to show (no WebGL, or the context lost), so the holder can
 * keep to its 2D plan. Given `fitRef`, the sheet lies exactly over that
 * drawing, and the camera eases from there to its own views as the walls
 * rise. The canvas is clear, so the page's background shows
 * round the flat.
 */
export function WalkView({
  goRef,
  fitRef,
}: {
  goRef: RefObject<((s: number) => void) | null>;
  fitRef?: RefObject<SheetFit | null>;
}) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    // a canvas of its own each time: one whose context was let go cannot be drawn in again
    const canvas = document.createElement("canvas");
    canvas.className = styles.canvas!;
    holder.append(canvas);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      // no WebGL: the plan stays as drawn in 2D
      canvas.remove();
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const palette = { paper: css("--color-cream"), ink: css("--color-umber") };
    const { scene, cut, roomBox, lineMats, disposables, rise, later } = buildFlatScene(palette);
    const camera = new THREE.PerspectiveCamera(2, 1, 1, 500);
    camera.rotation.order = "YXZ";
    let rig = makeRig(1);
    // what the rig was made for, so it is made again only when that changes
    let rigFor = "";
    let sheet: ReturnType<typeof addSheet> | null = null;

    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");
    let target = STOPS.sheet;
    let eased = target;
    let shown = -1;
    let raf = 0;

    const draw = (s: number) => {
      // nothing to draw into yet: a size of 0 would make the camera's aspect NaN
      if (!canvas.clientWidth || !canvas.clientHeight) return;
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      const fit = fitRef?.current;
      const sheetFrame = fit ? h / fit.pxPerM : undefined;
      if (rigFor !== `${w}x${h} ${sheetFrame}`) {
        rig = makeRig(w / h, sheetFrame);
        rigFor = `${w}x${h} ${sheetFrame}`;
      }
      const o = rig(s);
      camera.position.set(o.x, o.y, o.z);
      camera.rotation.set(o.pitch, o.yaw, 0);
      camera.fov = o.fov;
      camera.near = o.near;
      camera.far = o.far;
      // the flat's middle where the drawing has it on the sheet, moving to
      // SHIFT right of the middle as the walls rise
      const k = smooth(stage(s, STOPS.sheet, STOPS.lifted));
      const [fx, fy] = fit ? [fit.x - w / 2, fit.y - h / 2] : [0, 0];
      camera.setViewOffset(w, h, -(fx * (1 - k) + SHIFT * w * k), -fy * (1 - k), w, h);
      camera.updateProjectionMatrix();
      cut.constant = o.cut;
      // the room come to life: the bookcase built once the camera is at it,
      // then the materials, then the second layout
      later.build(stage(s, STOPS.walked + 0.05, STOPS.built));
      later.sweep(stage(s, STOPS.built + 0.02, STOPS.finished));
      later.layout(smooth(stage(s, STOPS.finished + 0.04, STOPS.laid)));
      // then the piece ordered for it: drawn in once the camera is at its
      // wall, stood up in each finish in turn, back to its lines once ordered,
      // and brought home once the camera is back from over the flat
      later.order(
        smooth(stage(s, STOPS.away + 0.06, STOPS.picked)),
        smooth(stage(s, STOPS.picked, STOPS.picked + 0.04)) * (1 - smooth(stage(s, STOPS.ordered, STOPS.ordered + 0.04))),
        stage(s, STOPS.sent + 0.08, STOPS.home - 0.02),
        ORDER.finishes[finishAt(s)]!.color,
      );
      // as the plan's symbols fade, the pieces they stand for rise out of the floor
      const notes = 1 - smooth(stage(s, STOPS.sheet, STOPS.sheet + NOTES_FADE));
      sheet?.fade(notes);
      rise(1 - notes);
      renderer.render(scene, camera);
      shown = s;
    };

    const resize = () => {
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      if (!w || !h) return;
      // a little less sharp on touch screens, to spare their GPUs and batteries
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse.matches ? 1.5 : 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      for (const m of lineMats) m.resolution.set(w, h);
      draw(eased);
    };

    // glide the camera towards where it is told to be, then stop drawing till it moves
    const tick = () => {
      raf = 0;
      eased = still.matches ? target : eased + (target - eased) * EASE;
      if (Math.abs(target - eased) < 1e-4) eased = target;
      if (eased !== shown) draw(eased);
      if (eased !== target) raf = requestAnimationFrame(tick);
    };
    const go = (s: number) => {
      target = s;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    goRef.current = go;

    const sized = new ResizeObserver(resize);
    sized.observe(canvas);
    // if the browser drops the 3D context, there is no 3D till three rebuilds it on its return
    const lost = (e: Event) => {
      e.preventDefault();
      goRef.current = null;
      canvas.toggleAttribute("data-lost", true);
    };
    const restored = () => {
      goRef.current = go;
      canvas.toggleAttribute("data-lost", false);
      resize();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);

    // the plan's notes are drawn in the site's mono face, once it has loaded,
    // in full ink with no grid or tile joints, as the 2D plan draws them
    let alive = true;
    const font = css("--font-space-mono") || "monospace";
    document.fonts.load(`700 40px ${font}`).finally(() => {
      if (!alive) return;
      sheet = addSheet(scene, palette, font, disposables, lineMats, roomBox, { grid: false, tiles: false, solid: true });
      sheet.furnishTo(Infinity);
      resize();
    });
    resize();

    return () => {
      alive = false;
      goRef.current = null;
      cancelAnimationFrame(raf);
      sized.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [goRef, fitRef]);

  return <div ref={holderRef} className={styles.holder} aria-hidden="true" />;
}
