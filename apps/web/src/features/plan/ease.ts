/** The walk's easing helpers, shared by the camera (rig.ts), the scene and PlanWalk. */

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** How far through the stretch from a to b the value t is, 0 to 1. */
export const stage = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Ease in and out (smoothstep). */
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** Ease in and out more gently at the ends (smootherstep). */
export const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
