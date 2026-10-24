"use client";

import { useEffect, useRef } from "react";
import styles from "./Stage.module.css";
import { CREAM_SHARE, WASH_END, WASH_GLSL } from "./wash";

/**
 * The landing background, alive: one soft, slightly curved sweep through the
 * live site's colours, red-orange at the top, orange and amber through the
 * middle, cream at the foot. It leans a little either way, its centre drifts,
 * and its bands gently undulate, but it never turns over.
 *
 * Every frame is the same composition, slightly moved, so every frame looks
 * right: the colours always keep their order (red never meets
 * cream, which turned blends a dusty grey-pink), stripes and islands cannot
 * form, and each colour keeps roughly the same share of the screen. Free
 * blobs could not promise that; sometimes they bunched into a column or split
 * the screen in two.
 *
 * Colour comes from a heat value (1 red, 0 cream) read through the site's own
 * wash (wash.ts), stop for stop. The starting lean is random per visit;
 * the page opens on it held still and the drift picks up over INTRO_MS.
 *
 * One small WebGL shader, drawn at reduced resolution (the field is soft, so
 * nothing is lost), about 30 times a second, and only while the tab is open
 * and the canvas on screen. Without WebGL, or if the browser takes the GPU
 * back, the CSS wash under the canvas shows; with reduced motion the opening
 * frame stays still.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uAngle; // this visit's starting lean, a little either side of upright

// The live wash, stop for stop, blended the way CSS blends it (see wash.ts).
${WASH_GLSL}

// 2D simplex noise (Ashima / Stefan Gustavson, MIT).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// How far the picture bows: 0 is a straight sweep, 1 bands curved round a
// far-off point. Kept small: more raised the cream into a dome mid-screen.
const float CURVE = 0.15;
// How much the sweep undulates. Kept well under the sweep itself, so the
// order red, orange, amber, peach, cream can bend but never break.
const float WAVE = 0.12;
// Where the wash runs out of change: past this it is flat cream. The colour
// lookup stops here, so cream never forms a flat block whose edge reads as a
// shape (the white humps).
const float WASH_END = ${WASH_END.toFixed(2)};
const float CREAM_SHARE = ${CREAM_SHARE.toFixed(2)};
// How far the sweep may lean from straight up, in radians (0.3 is about 17°).
const float TILT = 0.3;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  float t = uTime;
  vec2 q = vec2(uv.x * aspect, uv.y); // keep the shapes round on any screen
  // The sweep points up (red at the top, cream at the foot) and only leans a
  // little either way, never far enough to put cream at a side.
  float angle = 1.5707963 + uAngle + TILT * snoise(vec2(t * 0.5, 3.1));
  vec2 dir = vec2(cos(angle), sin(angle));
  // Half the screen's depth along the sweep, so the top edge sits near red
  // and the bottom edge near cream whatever the lean.
  float reach = 0.5 * (abs(dir.x) * aspect + abs(dir.y));
  // The centre wanders sideways more than up and down, so the bands keep
  // their height on the page.
  vec2 centre = vec2(0.5 * aspect, 0.5) + vec2(0.25, 0.06) * vec2(snoise(vec2(t * 0.7, 8.2)), snoise(vec2(5.4, t * 0.7)));

  // Straight part, then bowed round a point far out on the cool side.
  float straight = dot(q - centre, dir) / reach;
  vec2 focus = centre - dir * 2.0 * reach;
  float bowed = (length(q - focus) - 2.0 * reach) / reach;
  float s = mix(straight, bowed, CURVE);

  // Slow undulation, wider than the screen, so the bands lean and sway as a
  // whole rather than rising into hills; a faint finer layer keeps it alive.
  s += WAVE * snoise(q * 0.45 + vec2(t * 0.6, -t * 0.45));
  s += WAVE * 0.15 * snoise(q * 1.1 + vec2(-t * 0.4, t * 0.55) + 11.0);

  // Heat 1 is the red end of the wash, 0 the cream end. The soft clamp eases
  // into both ends, and the lookup stops where the wash turns flat, so the
  // change to cream is spread over the whole lower part of the screen.
  float heat = smoothstep(-0.15, 1.15, 0.5 + 0.5 * s);
  // The very top eases into the wash's own first colour (#e83200), exactly
  // the colour the header fills with on scroll, so the two never differ.
  heat = mix(heat, 1.0, smoothstep(0.88, 1.0, uv.y));
  // And the very foot into its last colour, the paper the plan below is
  // drawn on, so the two sections meet without a seam.
  heat = mix(heat, 0.0, smoothstep(0.12, 0.0, uv.y));
  // The coolest CREAM_SHARE of the sweep is all cream.
  vec3 col = wash(min(1.0, (1.0 - heat) / (1.0 - CREAM_SHARE)) * WASH_END);

  // A trace of grain so the soft ramps never band.
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** Seconds of drift per real second: slow enough to feel, never to watch. */
const SPEED = 0.07;
/** Share of device pixels the shader draws; the browser scales it up. */
const RESOLUTION = 0.5;
/** How long the drift takes to come up to speed after the page opens. */
const INTRO_MS = 6000;
/** About 30 frames a second: the drift is too slow to need more. */
const FRAME_MS = 1000 / 30 - 2;

/**
 * Drift time after `s` seconds on the page: the speed rises smoothly from
 * still to SPEED over the intro (the integral of a smoothstep), so the
 * picture starts at rest and never jolts into motion.
 */
function driftAt(s: number) {
  const T = INTRO_MS / 1000;
  if (s >= T) return SPEED * (s - T / 2);
  return SPEED * (s ** 3 / T ** 2 - s ** 4 / (2 * T ** 3));
}

export function LivingGradient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A random lean and a random point on the noise paths, so every visit differs.
    const angle = (Math.random() - 0.5) * 0.3;
    const offset = Math.random() * 1000;
    const born = performance.now();
    let raf = 0;
    let last = -Infinity;
    let onScreen = true;

    /** Program, buffer and uniforms; built again if the context is lost and restored. */
    const setup = () => {
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (process.env.NODE_ENV !== "production" && !gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn("LivingGradient shader:", gl.getShaderInfoLog(s));
        }
        return s;
      };
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.deleteProgram(prog);
        return null;
      }
      gl.useProgram(prog);

      // One triangle that covers the screen.
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(gl.getUniformLocation(prog, "uAngle"), angle);
      return { prog, buf, uRes: gl.getUniformLocation(prog, "uRes"), uTime: gl.getUniformLocation(prog, "uTime") };
    };
    let gpu: ReturnType<typeof setup> = null;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2) * RESOLUTION;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (!gpu) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(gpu.uRes, canvas.width, canvas.height);
    };
    const draw = (ms: number) => {
      if (!gpu) return;
      const s = still.matches ? 0 : Math.max(0, (ms - born) / 1000);
      gl.uniform1f(gpu.uTime, offset + driftAt(s));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.live = "true";
    };
    // The drift is slow, so a frame every FRAME_MS is as smooth as every one.
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop);
      if (ms - last < FRAME_MS) return;
      last = ms;
      draw(ms);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      // Draw now rather than on the next animation frame, which a background
      // page may not get for a long time; then keep drawing while it is seen.
      draw(performance.now());
      if (gpu && !still.matches && !document.hidden && onScreen) raf = requestAnimationFrame(loop);
    };

    // A lost context (the browser reclaiming the GPU) blanks the canvas:
    // step back to the CSS wash under it, and build again when it returns.
    const lost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      gpu = null;
      delete canvas.dataset.live;
    };
    const restored = () => {
      gpu = setup();
      resize();
      start();
    };

    // Resizing clears the canvas, so draw again at once.
    const sized = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    // Off screen, nothing is drawn.
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      start();
    });

    gpu = setup();
    sized.observe(canvas);
    seen.observe(canvas);
    resize();
    start();

    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    document.addEventListener("visibilitychange", start);
    still.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      sized.disconnect();
      seen.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      document.removeEventListener("visibilitychange", start);
      still.removeEventListener("change", start);
      if (gpu) {
        gl.deleteBuffer(gpu.buf);
        gl.deleteProgram(gpu.prog);
      }
    };
  }, []);

  return <canvas ref={ref} className={styles.living} aria-hidden="true" />;
}
