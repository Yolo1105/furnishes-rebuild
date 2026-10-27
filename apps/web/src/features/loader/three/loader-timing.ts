/** Loader clock — kept off the Three.js module so landing chrome can import it. */
export const LOADER_TIMING = {
  minMs: 4000,
  fallbackMs: 4250,
  dropMs: 550,
  dwellMs: 500,
  /**
   * Exit hop→collapse window (must cover lead + hop + collapse + a short tail).
   * Kept under the reference 1000ms: the whole loader runs about two thirds of
   * the live site's length.
   */
  exitMs: 520,
  /** Pause after breath before furniture starts hopping. */
  exitLeadMs: 60,
  /** Up-spring duration before pieces rush the hole. */
  exitHopMs: 160,
  /** Collapse / swallow duration. */
  exitCollapseMs: 260,
  /** Peak hop height (world units) — taller = more readable. */
  exitHopHeight: 0.95,
  /** Crossfade duration once the page under the cover has painted. */
  revealMs: 900,
} as const;
