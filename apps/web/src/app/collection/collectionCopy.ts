import type { StaticImageData } from "next/image";
import deskRender from "@/assets/render-desk.webp";
import { CLAIMS, DESIGN_COUNT, OTHER_USES, PRODUCTS, productById, STATUS, type UseId, USES } from "@/features/products/catalogue";
import { EMAIL } from "@/lib/contact";
import { isReal, shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";

/**
 * A point on a render and what stands there: `at` is [x, y] in % of the
 * render from its top left; `side`, which way its label runs from the dot;
 * `id`, the product it names, if the label should lead to it.
 */
export type Spot = { label: string; at: [number, number]; side: "left" | "right"; id?: string };

/** A render of one of our pieces with its parts marked. Only our own pieces are ever marked. */
export type Marked = { src: StaticImageData; alt: string; spots: readonly Spot[] };

const launch = PRODUCTS.filter((p) => p.status === "launch");
const soon = PRODUCTS.filter((p) => p.status === "soon");

export const HERO = {
  eyebrow: "Collection",
  title: "Find the piece that fits.",
  lede: `${launch.length} pieces you can order now, ${soon.length} in production, and the other uses and arrangements they make: ${DESIGN_COUNT} designs in all.`,
  call: "Find your piece",
  readyMade: "See ready-made furniture →",
};

/** The desk-side piece in a room, its parts marked; the desk and chair beside it are not ours, so they carry no mark. */
export const HERO_RENDER: Marked = {
  src: deskRender,
  alt: "The desk-side piece beside a desk, with books on its shelves and a steel base; a 3D render",
  spots: [
    { label: "Desk-side piece", at: [31.5, 23.5], side: "left", id: "desk" },
    { label: "Pen pot", at: [36, 40.5], side: "left", id: "desk" },
    { label: "Steel base", at: [28, 75], side: "left", id: "desk" },
  ],
};

/** The rooms, each shown by a render of the first piece made for it, and leading to its pieces in the finder. */
export const ROOMS_HEAD = { eyebrow: "By room", title: "Shop by room." };

const LINES: Record<UseId, string> = {
  bedroom: "Keep what you need within reach, in a room that stays calm.",
  kitchen: "More places to put things, where counter space runs out.",
  work: "A place to work, at home or in a small office.",
  entryway: "Somewhere for what you carry in and out.",
  living: "Storage and display for the room everyone shares.",
  dividing: "Give one room two jobs, without building a wall.",
};

export const ROOM_TILES: readonly { use: UseId; name: string; line: string; render: StaticImageData }[] = (Object.keys(USES) as UseId[]).flatMap(
  (use) => {
    const first = PRODUCTS.find((p) => p.uses.includes(use));
    return first ? [{ use, name: USES[use], line: LINES[use], render: first.room }] : [];
  },
);

/** The pieces you can order first. */
export const DISCOVER = {
  eyebrow: "Available now",
  title: "Start with these pieces.",
  lede: "One each for the entry, the desk and the bedside.",
  all: "All products →",
};

/** The ready-made line, in a band. */
export const READY_BAND = {
  eyebrow: "Ready-made",
  title: "When a standard size will do.",
  body: "Ready-made office, storage, dining and living furniture, for when a standard size suits the space.",
  call: "See ready-made furniture",
};

export const CONSULT = {
  eyebrow: "Consultations",
  title: "Talk your room through with us.",
  body: `We visit for ${shown("consultLength")}, answer your questions and work out which pieces fit. It costs ${shown("consultPrice")}.`,
  call: "Book a consultation",
};

/** What the pieces are made with. */
export const MADE_WITH = {
  eyebrow: "Materials",
  title: "One material, one grid.",
  body: "Our modular pieces are 18 mm birch plywood on one grid, so they line up and can change later.",
  call: "About us →",
};

/** Pieces in their rooms: renders of our own pieces, each leading to its page. */
export const IN_ROOMS = {
  eyebrow: "Rooms",
  title: "In their rooms.",
  call: "See more ideas →",
  ids: ["low-cabinet", "kitchen", "mobile-screen"] as const,
};

export const IN_ROOM_PIECES = IN_ROOMS.ids.flatMap((id) => productById(id) ?? []);

export const QUESTIONS_HEAD = { eyebrow: "Questions", title: "What to know." };

/** The questions, each answered from the claims; a question whose answer rests on a missing fact is left out. */
export const QUESTIONS: readonly { question: string; answer: string }[] = [
  { question: "What does it cost?", answer: CLAIMS.price.detail },
  { question: "How does it arrive?", answer: CLAIMS.delivery.detail },
  ...(isReal("stability") && isReal("weightLimits") ? [{ question: "Will the tall pieces tip?", answer: CLAIMS.stability.detail }] : []),
  { question: "Will it fit my room?", answer: CLAIMS.fit.detail },
  { question: "Are the pictures photographs?", answer: CLAIMS.renders.detail },
  { question: "Why are the add-ons orange?", answer: CLAIMS.accent.detail },
  { question: "When can I have one?", answer: CLAIMS.leadTime.detail },
  { question: "How does it go together?", answer: CLAIMS.assembly.detail },
  { question: "Where do the parts lists come from?", answer: CLAIMS.parts.detail },
  { question: "How do things hang on it?", answer: CLAIMS.hangingFace.detail },
];

/** Where to read more before buying. */
export const GUIDES: readonly { title: string; href: string }[] = [
  { title: "How to measure before you order →", href: `${routes.help}#measuring` },
  { title: "Furniture for HDB homes →", href: routes.hdbHomes },
];

export const FIND_HEAD = {
  eyebrow: "Find your piece",
  title: "Every piece, by room.",
};

export const NOTES_HEAD = {
  eyebrow: "Notes",
  title: "Before you choose.",
  lede: "What is still open on each piece you can order: the tests, the limits and the choices not made yet.",
};

export const OTHER_USES_HEAD = {
  eyebrow: "Uses",
  title: "Other uses.",
  lede: `${OTHER_USES.length} ways to set up a piece for something else. Each follows its piece and has no price or page of its own.`,
};

export const KITS_HEAD = {
  eyebrow: "Kits",
  title: "Add-on kits.",
  lede: "Parts that change a piece later: another pack on the same frame, a door, a drawer, a desk top, casters.",
};

/** How the catalogue works, in three steps. */
export const STEPS_HEAD = {
  eyebrow: "Catalogue",
  title: "How the catalogue works.",
  lede: "Three pieces first, the rest in production, and every one can be set up for more than one use.",
};

export const STEPS: readonly { title: string; body: string }[] = [
  { title: STATUS.launch.name, body: STATUS.launch.detail },
  { title: "In production", body: "Follows the first pieces. Tell us which ones you want, and we write when each is ready." },
  { title: "Other uses and arrangements", body: "Kits on a piece you have, or pieces standing together. No price or page of their own." },
];

/** Hearing about new pieces. */
export const NEWS = {
  call: "Tell us what you want",
  href: contactHref("product"),
};

/** What holds for every piece. */
export const ASSURANCES_HEAD = { eyebrow: "Every piece", title: "What holds for every piece." };

export const ASSURANCES: readonly { label: string; body: string }[] = [
  { label: "Delivery", body: shown("gstTerms") },
  { label: "Returns", body: shown("returnsTerms") },
  { label: "Support", body: `Write to ${EMAIL}. We reply within ${shown("replyTime")}.` },
];

/** The closing band. */
export const CLOSING = {
  title: "Create with intention.",
  body: "Not sure which piece? Draw your room first, and see the pieces that fit it.",
  call: "Design your room",
};
