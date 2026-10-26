/** Loader clock — kept off the Three.js module so landing chrome can import it. */
export const LOADER_TIMING = {
  minMs: 3000,
  fallbackMs: 3250,
  dropMs: 450,
  dwellMs: 400,
  /**
   * Exit hop→collapse window (must cover lead + hop + collapse + a short tail).
   * Kept well under the reference 1000ms: the whole loader runs about half the
   * live site's length.
   */
  exitMs: 400,
  /** Pause after breath before furniture starts hopping. */
  exitLeadMs: 40,
  /** Up-spring duration before pieces rush the hole. */
  exitHopMs: 120,
  /** Collapse / swallow duration. */
  exitCollapseMs: 200,
  /** Peak hop height (world units) — taller = more readable. */
  exitHopHeight: 0.95,
  /** Crossfade duration once the page under the cover has painted. */
  revealMs: 700,
} as const;
