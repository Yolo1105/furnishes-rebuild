import type { StaticImageData } from "next/image";
import afternoonLivingRoom from "@/assets/afternoon-living-room.jpg";
import lowCabinetScene from "@/assets/catalogue/scene/low-cabinet.webp";
import mobileScreenScene from "@/assets/catalogue/scene/mobile-screen.webp";
import furnitureGallery from "@/assets/furniture-gallery.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import renderBookwall from "@/assets/render-bookwall.webp";
import renderKitchen from "@/assets/render-kitchen.webp";
import renderSofaBack from "@/assets/render-sofa-back.webp";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import {
  ARRANGEMENTS,
  CLAIMS,
  DESIGN_COUNT,
  MATERIALS,
  OTHER_USES,
  PRODUCTS,
  STATUS,
} from "@/features/products/catalogue";

/**
 * A point on a render and what stands there: `at` is [x, y] in % of the
 * render from its top left (not of the frame, so it holds however the frame
 * crops it); `side`, which way its label runs from the dot; `id`, the
 * product it names, if the label should lead to it.
 */
export type Spot = { label: string; at: [number, number]; side: "left" | "right"; id?: string };

/** A large render (2000 × 1600) with the points marked on it. */
export type Marked = { src: StaticImageData; alt: string; spots: readonly Spot[] };

const launch = PRODUCTS.filter((p) => p.status === "launch");
const soon = PRODUCTS.filter((p) => p.status === "soon");

export const HERO = {
  title: "Furniture cut to fit the way you live",
  lede: `${launch.length} launch pieces, being made and tested now, and ${soon.length} that follow them, plus the other uses and arrangements they make: ${DESIGN_COUNT} designs in all.`,
  call: "Find your piece",
};

export const HERO_RENDER: Marked = {
  src: renderBookwall,
  alt: "The double-sided bookshelf wall in a room with a peach wall, books on its shelves and a chair beside it",
  spots: [
    { label: "Double-sided bookshelf wall", at: [50, 38], side: "right", id: "bookwall" },
    { label: "18 mm birch edge", at: [31, 45], side: "left" },
    { label: "Centre panel", at: [48.5, 55], side: "left" },
  ],
};

/** The figures on the frosted panel over the hero render. */
export const FIGURES = [
  { value: launch.length, label: "Launch pieces" },
  { value: soon.length, label: "Coming soon" },
  { value: DESIGN_COUNT, label: "Designs in all" },
];

/** The marquee over the top of the page, and the one over the closing photo. */
export const MARQUEE_TOP = ["The collection", "Birch plywood", "Made to order"];
export const MARQUEE_END = ["Design", "Cut", "Assemble"];

export const INTRO = {
  photo: readingCorner,
  photoAlt: "A reading corner with a chair, a lamp and shelves",
  line: "Everyday furniture from one sheet of birch, made for small homes.",
};

/** The band after the hero: a promise left, the open price right, a render under them. */
export const BAND = {
  title: ["Made and tested first,", "priced after"],
  noteTitle: CLAIMS.price.label,
  note: CLAIMS.price.detail,
  kicker: "Behind-the-sofa divider",
  caption: "One frame, many uses",
  src: renderSofaBack,
  alt: "The behind-the-sofa divider standing behind a sofa, a lamp on its top",
};

/** The row under the band: a word, a turning ring of words, a sentence. */
export const RING = {
  word: "Furnishes",
  ring: "made to order · birch plywood · flat-packed · ",
  badge: "18 mm",
  body: "Every piece reuses a frame the launch pieces prove, so a hook, a shelf or a top from one fits the next, and the family grows with your home.",
};

export const PICKS_HEAD = {
  title: "Launch pieces",
  lede: STATUS.launch.detail,
};

/** The products shown full width in their rooms, each with its parts marked. */
export const IN_ROOMS: readonly (Marked & { id: string })[] = [
  {
    id: "low-cabinet",
    src: lowCabinetScene,
    alt: "The low cabinet against a peach wall, books on its shelves and a lamp on its top",
    spots: [
      { label: "One long top", at: [74, 39], side: "left" },
      { label: "Three segments", at: [48, 52], side: "right" },
      { label: "Steel legs", at: [37, 84], side: "left" },
    ],
  },
  {
    id: "kitchen",
    src: renderKitchen,
    alt: "The kitchen prep cart against a tiled wall, jars on its shelf",
    spots: [
      { label: "Two tiers", at: [48, 50], side: "right" },
      { label: "Casters", at: [35, 79], side: "left" },
    ],
  },
  {
    id: "mobile-screen",
    src: mobileScreenScene,
    alt: "The mobile screen on casters beside a desk and chair",
    spots: [
      { label: "Shelves on the working side", at: [62, 45], side: "right" },
      { label: "Caster base", at: [53, 79], side: "left" },
    ],
  },
];

export const OTHER_USES_HEAD = {
  title: "Other uses",
  lede: `${OTHER_USES.length} ways to set up a piece for something else. Each follows its piece and has no price or page of its own.`,
};

export const ARRANGEMENTS_HEAD = {
  title: ["Around it"],
  lede: `${ARRANGEMENTS.length} arrangements: pieces standing together, never a product of their own.`,
};

/** The photo half and the panel beside it. */
export const MATERIAL_PANEL = {
  photo: sageSideboard,
  photoAlt: "A sideboard against a sage wall",
  title: "Materials",
  body: MATERIALS.body,
  small: `${MATERIALS.open} ${CLAIMS.accent.detail}`,
  call: "Learn more",
};

/** How it works, in numbered rows, each with its points. */
export const STEPS: readonly { title: string; points: readonly { head: string; body: string }[] }[] = [
  {
    title: STATUS.launch.name,
    points: [
      { head: "Being made now", body: STATUS.launch.detail },
      ...launch.map((p) => ({ head: p.name, body: p.line })),
    ],
  },
  {
    title: STATUS.soon.name,
    points: [
      { head: "After the launch pieces", body: STATUS.soon.detail },
      { head: "Register interest", body: "Tell us which ones you want, and we let you know when each is ready." },
    ],
  },
  {
    title: "Other uses and arrangements",
    points: [
      { head: "Other uses", body: "Kits and set-ups on a piece you already have: a coffee corner, a video backdrop, a record display." },
      { head: "Arrangements", body: "Pieces standing together, like an island from two carts. They have no price or page of their own." },
    ],
  },
];

export const STEPS_HEAD = {
  title: ["How the", "catalogue works"],
  body: "Three pieces first, made and tested in real homes. The rest follow on the frames they prove, and every one can be set up for more than one use.",
};

export const QUESTIONS_HEAD = {
  title: "What to know",
  photo: afternoonLivingRoom,
  photoAlt: "A living room in afternoon light",
};

export const QUESTIONS: readonly { question: string; answer: string }[] = [
  { question: "Why is there no price?", answer: CLAIMS.price.detail },
  { question: "How does it arrive?", answer: CLAIMS.delivery.detail },
  { question: "Will the tall pieces tip?", answer: CLAIMS.stability.detail },
  { question: "Will it fit my room?", answer: CLAIMS.fit.detail },
  { question: "Are the pictures photographs?", answer: CLAIMS.renders.detail },
  { question: "Why is everything orange?", answer: CLAIMS.accent.detail },
  { question: "When can I have one?", answer: `${CLAIMS.leadTime.label}. ${CLAIMS.leadTime.detail}` },
  { question: "How does it go together?", answer: CLAIMS.assembly.detail },
  { question: "Where do the parts lists come from?", answer: CLAIMS.parts.detail },
  { question: "How do things hang on it?", answer: CLAIMS.hangingFace.detail },
  { question: "Why do some pictures look different?", answer: CLAIMS.conceptRenders.detail },
];

export const NOTES_HEAD = {
  title: "Before you choose",
  lede: "What is still open on each piece: the tests, the limits and the choices not made yet.",
  more: "And the pieces that follow",
};

export const KITS_HEAD = {
  title: "Add-on kits",
  lede: "Parts that change a launch piece later: another pack on the same frame, a door, a drawer, a desk top, casters. What each adds, and what it takes off.",
  materials: "What the parts are made of",
};

/** The closing photo, under the second marquee. */
export const CLOSING = {
  photo: furnitureGallery,
  photoAlt: "A gallery of wooden furniture",
  title: ["Create with", "intention"],
  body: "Not sure which piece? Draw your room first, and we will suggest the pieces that fit it.",
  call: "Design your room",
};
