import { isReal, shown } from "@/lib/facts";

/**
 * The about page's words: drafts of how Furnishes works, for approval.
 * Anything about real events, people or results rests on a fact (lib/facts)
 * and is left out till that fact is real.
 */

export const WHO_TAGLINE = "Ready-made furniture, modular designs, and modular pieces you compose, for Singapore homes and small offices.";

/** The three columns under the photo, at body size. */
export const WHO_COLUMNS = [
  "Some of our pieces are usual ready-made furniture. Others are modular, built from a family of birch panels: buy one of our finished designs, or compose your own within clear limits.",
  "A change at home can start small: a place for the bag by the door, or a bedside that keeps the book within reach. It can be bigger: a cabinet that divides a rented room.",
  `Each piece should be good on its own today; adding to it later is a bonus. If you need help choosing, we can visit your room, or answer by email within ${shown("replyTime")}.`,
] as const;

export const WORKSHOP: readonly { label: string; body: string }[] = [
  { label: "Made in", body: "China, by our partner factory, to the version you chose." },
  { label: "Material", body: "18 mm birch plywood, white matte faces." },
  { label: "Arrives", body: "Flat-packed or already built, delivered in Singapore." },
];

/** The company's story, as three steps; the first rests on the story fact. */
export const STORY: readonly { title: string; body: string }[] = [
  ...(isReal("companyStory") ? [{ title: "How we started", body: shown("companyStory") }] : []),
  { title: "What we do today", body: "We sell ready-made and modular furniture to homes and small offices in Singapore." },
  { title: "Where we are going", body: "Singapore first, with HDB families and startup offices, and further once that works well." },
];

/** Recognition, shown only once the award fact is real. */
export const RECOGNITION = isReal("award") ? shown("award") : "";

/** From order to door. */
export const MAKING_LINE = `Most pieces are made after you order. Flat-packed pieces take ${shown("leadFlatPack")}, and built pieces ${shown("leadBuilt")}.`;

export const MAKING_STEPS: readonly { title: string; body: string }[] = [
  { title: "You order", body: "You confirm the piece, its size, its finish, and flat-packed or built." },
  { title: "It is made", body: "Our partner factory in China makes it to the version you chose." },
  { title: "It is packed", body: "Each piece is packed with its parts and, if flat-packed, its steps." },
  { title: "It ships", body: "It travels from China to Singapore, and we email you when it moves." },
  { title: "It arrives", body: "Built pieces arrive ready to use. Flat-packed pieces are ready to put together." },
];

/**
 * The people behind Furnishes. `real`: whether the name is a confirmed fact;
 * only those render, and the block goes when none do.
 */
const PEOPLE: readonly { name: string; role: string; about: string; real: boolean }[] = [
  { name: "Mohan", role: "Cofounder and CTO", about: "Leads the website and the room planner.", real: true },
  { name: shown("team"), role: "", about: "", real: isReal("team") },
];

export const TEAM = PEOPLE.filter((p) => p.real && p.name);

/** Who we work with: each arrangement is talked through one by one. */
export const PARTNERS: readonly { title: string; body: string }[] = [
  { title: "Designers and space planners", body: "Tell us about a client's room, and use our pieces in your plan." },
  { title: "Shops", body: "Stock our furniture, or show a piece and send customers on to us." },
  { title: "Studios and shared spaces", body: "Have a piece in real use, where people can touch the materials and try both sides." },
];
