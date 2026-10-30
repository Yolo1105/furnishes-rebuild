import { FINISH } from "./finishes";
import { STOPS } from "./rig";

/**
 * The piece ordered at the end of the walk, an example (no stock or price
 * behind it): a Furnishes low cabinet for the living room's west wall, by
 * the way to the hall, and the finishes tried on it in turn.
 */
export const ORDER = {
  name: "Furnishes low cabinet",
  size: "120 × 40 × 72 cm",
  made: "18 mm boards, put together in your home",
  finishes: [
    { name: "Furnishes orange", color: FINISH.furnishes },
    { name: "Oak", color: FINISH.oak },
    { name: "Walnut", color: FINISH.walnut },
  ],
} as const;

/** The finish on it at walk progress `s`: each in turn while it is made yours, the last kept. */
export function finishAt(s: number): number {
  const n = ORDER.finishes.length;
  const t = (s - STOPS.picked) / (STOPS.made - STOPS.picked);
  return Math.min(n - 1, Math.max(0, Math.floor(t * n)));
}
