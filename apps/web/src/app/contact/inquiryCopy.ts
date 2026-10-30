/**
 * The inquiry's words, step by step: what the work is, when it starts, how
 * to reach the sender, then a check before sending. Stand-in copy till the
 * studio's own terms are set.
 */
export const STEPS = [
  { name: "Scope", title: "What are we planning?", lede: "Pick one or more." },
  { name: "Timing", title: "When should the work start?", lede: "Pick the closest." },
  { name: "Details", title: "Where do we reach you?", lede: "We only use this to answer you." },
  { name: "Review", title: "Check it, then send.", lede: "We answer inside one business day." },
] as const;

/** The kinds of work, each with how long it usually runs. */
export const SCOPES: readonly { name: string; runs: string }[] = [
  { name: "Consultation", runs: "90 minutes" },
  { name: "Single room", runs: "3 to 5 weeks" },
  { name: "Whole home", runs: "4 to 7 months" },
  { name: "Small commercial", runs: "4 to 8 months" },
  { name: "Renovation drawings", runs: "6 to 10 weeks" },
  { name: "Colour and material consult", runs: "2 weeks" },
];

export const ROOM_COUNTS = ["1", "2 to 3", "4 or more"] as const;

export const STARTS = ["As soon as we can", "In one to three months", "In three to six months", "Just planning ahead"] as const;

/**
 * What happens once it is sent: each step, and how long until the next
 * (none after the last).
 */
export const AFTER: readonly { title: string; line: string; until?: string }[] = [
  {
    title: "Send the form",
    line: "Scope and timing first, so our first answer is already about your project.",
    until: "1 business day",
  },
  { title: "We answer", line: "Inside one business day, and we book the visit with you.", until: "Varies" },
  { title: "One 90-minute visit", line: "We measure the rooms and walk through them with you.", until: "3 days" },
  { title: "Written summary", line: "Within three days. What to do first, in order, whether you hire us or not." },
];
