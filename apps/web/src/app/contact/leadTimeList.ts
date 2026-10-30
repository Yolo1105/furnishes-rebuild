/**
 * How long things take to arrive in Singapore, in weeks from order: the
 * usual wait (`from`) and the long end (`to`), or a word where there is no
 * wait to speak of. Stand-in figures till the studio's own are set.
 */
export const LEAD_TIMES: readonly ({ name: string } & ({ from: number; to: number } | { note: string }))[] = [
  { name: "Upholstery", from: 10, to: 14 },
  { name: "Custom cabinetry", from: 8, to: 12 },
  { name: "Stone", note: "Back to normal" },
];

/** When the figures were last checked. */
export const LEAD_TIMES_AS_OF = "2026-10-01";

/** The scale's end, in weeks, and the step between its numbers. */
export const WEEKS = 16;
export const WEEK_STEP = 2;
