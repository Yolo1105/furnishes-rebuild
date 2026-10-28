"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { clamp01, smooth } from "./ease";
import { AC_LEDGE, BAYS, BOUNDS_M, OUTER_WALL, ROOMS, sidesOf } from "./flat";
import styles from "./FlatPlan.module.css";
import { addSheet, buildFlatScene } from "./scene";

/**
 * How far a room's box reaches past its floor, m: to the far face of the
 * wall it shares with a neighbour (so each room has the whole wall, never a
 * wall sliced open), or just past an outside wall; further where what
 * stands out from that wall is the room's too (a bay window, the A/C ledge).
 */
const SHARED = 0.21; // the face is at 0.2; just past it, so the clip never lies on it and flickers
const OUTSIDE = 0.12;
const OUT_TO = (r: (typeof ROOMS)[number], side: number) => {
  const reach = [
    0,
    AC_LEDGE.x1 - (r.x + r.w), // east: the ledge, where it stands off this room
    -Math.min(...BAYS.filter((b) => b.x0 >= r.x && b.x1 <= r.x + r.w).map((b) => -(b.depth + OUTER_WALL))), // north: a bay
    0,
  ][side]!;
  const owns = side === 1 ? AC_LEDGE.y0 >= r.y && AC_LEDGE.y1 <= r.y + r.d : side === 2 && r.y === 0;
  return Math.max(OUTSIDE, owns && Number.isFinite(reach) ? reach / 1000 + 0.05 : OUTSIDE);
};

/** Each room's box on the ground, m [x0, z0, x1, z1]: what is drawn as that room. */
const PARTS = ROOMS.map((r) => {
  const [w, e, n, s] = sidesOf(r).map((side, i) => (side.inner.length ? SHARED : OUT_TO(r, i)));
  return [r.x / 1000 - w!, r.y / 1000 - n!, (r.x + r.w) / 1000 + e!, (r.y + r.d) / 1000 + s!] as const;
});

/** The flat's middle on the ground, m: the rooms move out from it. */
const MID = [(BOUNDS_M.x0 + BOUNDS_M.x1) / 2, (BOUNDS_M.y0 + BOUNDS_M.y1) / 2] as const;

/** How far apart the rooms stand, taken apart: this share of their distance from the middle. */
const SPREAD = 0.55;

/** The plan's cut through the walls, m: as the walk draws its plan. */
const CUT = 1.2;

/** Room left round the drawing, px: at its sides and foot, and below the bar. */
const BREATHE = 40;

/** How fast the drawing follows the scroll, a share a frame. */
const EASE = 0.12;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * The flat's plan taken apart into its rooms: each room on its own, with
 * its own walls, doors, windows and the furniture and fittings drawn as a
 * plan draws them, standing apart from the others in its place, so each can
 * be read alone; as the page scrolls through the track it sits in (the
 * nearest [data-assemble] round it), they slide together into the whole
 * plan. Drawn by the walk's own scene from straight above, floors unfilled
 * and with no grid, each room clipped to its box and drawn alone. It takes
 * one half of its (positioned) parent (`side`), all of it on phones held
 * upright. Without WebGL it says so instead.
 */
export function FlatPlan({ side = "left" }: { side?: "left" | "right" }) {
  const holderRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    const track = holder?.closest<HTMLElement>("[data-assemble]");
    if (!holder || !track) return;
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
    renderer.autoClear = false;

    const palette = { paper: css("--color-paper"), ink: css("--color-ink") };
    // a plan: floors unfilled, so the page shows through them
    const { scene, cut, lineMats, disposables, rise, reveal, roomBox } = buildFlatScene(palette, { floors: false });
    cut.constant = CUT;
    rise(0); // the furniture and fittings drawn as symbols, not standing

    // straight down on the flat's middle, north up
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 500);
    camera.up.set(0, 0, -1);
    camera.position.set(MID[0], 100, MID[1]);
    camera.lookAt(MID[0], 0, MID[1]);
    camera.updateMatrixWorld();

    /** Where room i stands, taken apart by `apart` (0 together, 1 fully apart): its shift on the ground, m. */
    const shift = (i: number, apart: number) => {
      const [x0, z0, x1, z1] = PARTS[i]!;
      return [((x0 + x1) / 2 - MID[0]) * SPREAD * apart, ((z0 + z1) / 2 - MID[1]) * SPREAD * apart] as const;
    };

    /** The extent on screen (camera units) of every room's box, standing, at `apart`. */
    const corner = new THREE.Vector3();
    const toView = camera.matrixWorldInverse;
    const extent = (apart: number) => {
      let [l, r, b, t] = [Infinity, -Infinity, Infinity, -Infinity];
      PARTS.forEach(([x0, z0, x1, z1], i) => {
        const [sx, sz] = shift(i, apart);
        for (const x of [x0, x1]) for (const z of [z0, z1]) {
          corner.set(x + sx, 0, z + sz).applyMatrix4(toView);
          [l, r, b, t] = [Math.min(l, corner.x), Math.max(r, corner.x), Math.min(b, corner.y), Math.max(t, corner.y)];
        }
      });
      return { l, r, b, t };
    };

    const coarse = window.matchMedia("(pointer: coarse)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let shown = 0;
    let raf = 0;

    const draw = () => {
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      if (!w || !h) return; // drawn again by the observer once it has a size
      const apart = 1 - smooth(shown);
      // fit the drawing as it stands now into the space below the bar
      const top = parseFloat(css("--nav-h")) + BREATHE;
      const [sw, sh] = [w - 2 * BREATHE, h - top - BREATHE];
      const { l, r, b, t } = extent(apart);
      const scale = Math.max((r - l) / sw, (t - b) / sh); // camera units a px
      const [mx, my] = [(l + r) / 2, (b + t) / 2];
      // the space's middle is (BREATHE + sw / 2, top + sh / 2) px from the top left
      const [ox, oy] = [(BREATHE + sw / 2 - w / 2) * scale, (h / 2 - (top + sh / 2)) * scale];
      camera.left = mx - ox - (w / 2) * scale;
      camera.right = mx - ox + (w / 2) * scale;
      camera.top = my - oy + (h / 2) * scale;
      camera.bottom = my - oy - (h / 2) * scale;
      camera.updateProjectionMatrix();

      renderer.clear();
      const base = camera.position.clone();
      for (let i = 0; i < PARTS.length; i++) {
        const [sx, sz] = shift(i, apart);
        // this room alone, moved out by moving the camera the other way
        reveal(PARTS[i]!, 0);
        camera.position.set(base.x - sx, base.y, base.z - sz);
        camera.updateMatrixWorld();
        renderer.clearDepth();
        renderer.render(scene, camera);
      }
      camera.position.copy(base);
      camera.updateMatrixWorld();
    };

    const resize = () => {
      const [w, h] = [canvas.clientWidth, canvas.clientHeight];
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.5 : 2));
      renderer.setSize(w, h, false);
      for (const m of lineMats) m.resolution.set(w, h);
      draw();
    };

    /** How far the page has scrolled through the track: 0 taken apart, 1 together. */
    const read = () => {
      const r = track.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      return run > 0 ? clamp01(-r.top / run) : 1;
    };
    const tick = () => {
      raf = 0;
      shown = still.matches ? target : shown + (target - shown) * EASE;
      if (Math.abs(target - shown) < 1e-4) shown = target;
      draw();
      if (shown !== target) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = read();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const sized = new ResizeObserver(resize);
    sized.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    const lost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", resize);

    // the room names are drawn in the site's mono face, once it has loaded
    let alive = true;
    const font = css("--font-space-mono") || "monospace";
    document.fonts.load(`700 40px ${font}`).finally(() => {
      if (!alive) return;
      const sheet = addSheet(scene, palette, font, disposables, lineMats, roomBox, false); // no ground grid
      sheet.fade(1); // the plan's notes, door swings and symbols
      sheet.furnishTo(BOUNDS_M.x1 + 1);
      resize();
    });
    target = shown = read();
    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      sized.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", resize);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  return (
    <>
      <div ref={holderRef} className={styles.holder} data-side={side} role="img" aria-label="The plan of a 5-room HDB flat taken apart into its rooms, coming together as the page scrolls" />
      <p ref={fallbackRef} className={styles.fallback} hidden>
        This view needs WebGL, which this browser has turned off.
      </p>
    </>
  );
}
