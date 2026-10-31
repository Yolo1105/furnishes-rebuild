import { shown } from "@/lib/facts";
import type { ContactTopic } from "@/lib/routes";

/** The enquiry's words, step by step: what it is about, when, how to reach the sender, then a check before sending. */
export const STEPS = [
  { name: "Topic", title: "What can we help with?", lede: "Pick one or more." },
  { name: "Timing", title: "When do you need it?", lede: "Pick the closest." },
  { name: "Details", title: "Where do we reach you?", lede: "We only use this to answer you." },
  { name: "Review", title: "Check it, then send.", lede: `This opens your email app with your answers written in, ready to send. We reply within ${shown("replyTime")}.` },
] as const;

/** The kinds of enquiry, each with what it leads to. A link can pick one with `?topic=` and its id. */
export const SCOPES: readonly { id: ContactTopic; name: string; runs: string }[] = [
  { id: "product", name: "A product question", runs: "By email" },
  { id: "room", name: "Advice on a room", runs: "By email" },
  { id: "visit", name: "A visit to my room", runs: shown("consultLength") },
  { id: "office", name: "An office or bulk order", runs: "A quote" },
  { id: "custom", name: "A custom size or design", runs: "A quote" },
  { id: "order", name: "Help with an order", runs: "By email" },
];

export const ROOM_COUNTS = ["1", "2 to 3", "4 or more"] as const;

export const STARTS = ["As soon as we can", "In one to three months", "In three to six months", "Just planning ahead"] as const;

/** What happens once it is sent: each step, and how long until the next (none after the last). */
export const AFTER: readonly { title: string; line: string; until?: string }[] = [
  {
    title: "Send your email",
    line: "Your answers are written in for you, so our first reply is already about what you need.",
    until: shown("replyTime"),
  },
  { title: "We reply by email", line: "We answer your question, or send a quote if you asked for one.", until: "Varies" },
  { title: "If you asked for a visit", line: `We agree a time to come to your room, ${shown("consultPrice")}.` },
];
