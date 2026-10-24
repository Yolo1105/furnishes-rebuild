/**
 * The landing wash: the live site's orange-to-cream gradient, stop for stop,
 * kept once here and turned into both the CSS fallback and the shader's
 * colour lookup, so the two can never drift apart.
 */

/** [position 0 to 1 from the red end, colour as r, g, b]. */
const STOPS: readonly (readonly [number, readonly [number, number, number]])[] = [
  [0.0, [232, 50, 0]], // #e83200
  [0.08, [237, 63, 0]], // #ed3f00
  [0.16, [243, 77, 0]], // #f34d00
  [0.24, [249, 92, 0]], // #f95c00
  [0.32, [254, 106, 2]], // #fe6a02
  [0.38, [255, 120, 6]], // #ff7806
  [0.44, [255, 138, 16]], // #ff8a10
  [0.5, [255, 156, 24]], // #ff9c18
  [0.56, [253, 168, 56]], // #fda838
  [0.62, [250, 180, 92]], // #fab45c
  [0.68, [246, 196, 133]], // #f6c485
  // The live wash has #f2d2a6 here, a duller tan whose red dips below both
  // neighbours'. Flat it passes unseen; curved across the screen it read as a
  // grey ring. This is the clean peach halfway between its neighbours.
  [0.74, [250, 214, 178]], // #fad6b2
  [0.84, [255, 237, 223]], // #ffeddf, flat cream from here on
];

/** Where the wash stops changing: beyond it, flat cream. */
export const WASH_END = 0.84;

/** The wash as a CSS gradient, top to bottom. */
export const WASH_CSS = `linear-gradient(to bottom, ${STOPS.map(
  ([at, [r, g, b]]) => `rgb(${r} ${g} ${b}) ${at * 100}%`,
).join(", ")}, rgb(255 237 223) 100%)`;

const f = (n: number) => n.toFixed(4);

/** The wash as a GLSL function, `vec3 wash(float d)`, d = 0 at the red end. */
export const WASH_GLSL = (() => {
  const [, [r0, g0, b0]] = STOPS[0]!;
  const lines = STOPS.slice(1).map(([at, [r, g, b]], i) => {
    const from = STOPS[i]![0];
    return `  c = mix(c, vec3(${f(r / 255)}, ${f(g / 255)}, ${f(b / 255)}), clamp((d - ${f(from)}) / ${f(at - from)}, 0.0, 1.0));`;
  });
  return `vec3 wash(float d) {
  vec3 c = vec3(${f(r0 / 255)}, ${f(g0 / 255)}, ${f(b0 / 255)});
${lines.join("\n")}
  return c;
}`;
})();
