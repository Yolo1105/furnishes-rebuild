import { LEAD_WEEKS } from "@/lib/facts";

/** How long pieces take to arrive in Singapore, in weeks from order: the usual wait (`from`) and the long end (`to`). */
export const LEAD_TIMES: readonly { name: string; from: number; to: number }[] = [
  { name: "Customizable, flat-packed", ...LEAD_WEEKS.flatPack },
  { name: "Customizable, built", ...LEAD_WEEKS.built },
  { name: "Ready-made furniture", ...LEAD_WEEKS.readyMade },
  { name: "Add-ons", ...LEAD_WEEKS.addOns },
];

/** The scale's end, in weeks, and the step between its numbers. */
export const WEEKS = 16;
export const WEEK_STEP = 2;
