import type { StaticImageData } from "next/image";
import afternoonLivingRoom from "@/assets/afternoon-living-room.jpg";
import furnitureGallery from "@/assets/furniture-gallery.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import afternoonRoom from "@/assets/afternoon-living-room.jpg";
import staircaseCorner from "@/assets/staircase-reading-corner.jpg";
import whiteRoom from "@/assets/white-living-room.jpg";
import gardenDining from "@/assets/garden-dining-room.jpg";
import aFrameRoom from "@/assets/a-frame-living-room.jpg";
import brightRoom from "@/assets/bright-living-room.jpg";
import gallery from "@/assets/furniture-gallery.jpg";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import {
  CLAIMS,
  DESIGN_COUNT,
  OTHER_USES,
  PRODUCTS,
  STATUS,
  type UseId,
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

export const MARQUEE_END = ["Design", "Cut", "Assemble"];

export const HERO = {
  title: "Furniture cut to fit the way you live",
  lede: `Our modular designs: ${launch.length} pieces you can order first, and ${soon.length} that follow them, plus the other uses and arrangements they make: ${DESIGN_COUNT} designs in all.`,
  call: "Find your piece",
  readyMade: "See ready-made furniture",
};

export const HERO_RENDER: Marked = {
  src: readingCorner,
  alt: "A reading corner with an orange armchair, a floor mirror and wall shelves",
  spots: [
    { label: "Leather armchair", at: [39, 62], side: "left" },
    { label: "Floor mirror", at: [25, 46], side: "left" },
    { label: "Wall shelves", at: [70, 56], side: "left" },
  ],
};

/** The figures on the frosted panel over the hero render. */
export const FIGURES = [
  { value: launch.length, label: "Launch pieces" },
  { value: soon.length, label: "Coming soon" },
  { value: DESIGN_COUNT, label: "Designs in all" },
];

/** The rooms, each a photo with its name; each leads to its pieces in the finder. */
export const ROOMS_HEAD = { label: "By room", title: "Shop by room", call: "See all pieces" };

export const ROOM_TILES: readonly { use: UseId; photo: StaticImageData; line: string }[] = [
  { use: "bedroom", photo: afternoonRoom, line: "Keep what you need within reach, in a room that stays calm." },
  { use: "kitchen", photo: aFrameRoom, line: "More places to put things, where counter space runs out." },
  { use: "work", photo: gardenDining, line: "A place to work, at home or in a small office." },
  { use: "entryway", photo: staircaseCorner, line: "Somewhere for what you carry in and out." },
  { use: "living", photo: brightRoom, line: "Storage and display for the room everyone shares." },
  { use: "dividing", photo: readingCorner, line: "Give one room two jobs, without building a wall." },
];

export const ROOM_GO = "See these pieces →";

/** The ready-made line, in a band beside a photo. */
export const READY_BAND = {
  title: "Need it as it is?",
  body: "Ready-made office, storage, dining and living furniture, for when a standard size suits the space.",
  call: "See ready-made furniture",
  photo: gardenDining,
};

/** What the pieces are made with: a large photo, then a panel. */
export const MADE_WITH = {
  title: "One material, one grid",
  body: "Our customizable pieces are 18 mm birch plywood on one grid, so they line up, and can change later.",
  call: "About us",
  photo: gallery,
};

/** The next pieces: one large beside four small. */
export const NEXT_HEAD = { label: "Coming soon", title: "The pieces that follow", call: "All products", count: 5 };

/** Where to read more before buying. */
export const GUIDES_HEAD = { label: "Guides", title: "Read before you buy", call: "All ideas" };

export const GUIDES: readonly { title: string; line: string; href: string; photo: StaticImageData }[] = [
  {
    title: "How to measure before you order",
    line: "The spot, the way in, and the room to build it.",
    href: `${routes.help}#measuring`,
    photo: whiteRoom,
  },
  {
    title: "Furniture for HDB homes",
    line: "What to check in a flat, and which pieces suit.",
    href: routes.hdbHomes,
    photo: brightRoom,
  },
];

/** The orange band: the offer left, what it is right, the running photos half out of its foot. */
export const CONSULT = {
  label: "Consultations",
  title: ["Talk your room", "through with us"],
  side: `A visit of ${shown("consultLength")}`,
  body: `We come to your room, answer any questions and work out which pieces fit. It costs ${shown("consultPrice")}.`,
  call: "Book a consultation",
  small: "Furniture cut to fit",
  line: "Guided in an easy way",
  photos: [brightRoom, whiteRoom, gallery, aFrameRoom] as const,
};

/** The launch pieces in brief: words left, a room right. */
export const EXPLORE = {
  label: "Launch",
  title: "Explore the pieces we make first",
  body: "One each for the entry, the desk and the bedside, with the rest to follow.",
  call: "See detail",
};

/** The first pieces in a row of three: photo, name, normal price, what it is. */
export const DISCOVER = {
  label: "Pieces",
  title: "Start with these pieces",
  lede: "The first three pieces you can order.",
  count: 3,
  all: "All products",
  view: "View product",
};

/** The products shown full width in their rooms, each with its parts marked. */
export const IN_ROOMS: readonly (Marked & { id: string })[] = [
  {
    id: "low-cabinet",
    src: whiteRoom,
    alt: "A white living room with a sofa, a round table and two standing lamps",
    spots: [
      { label: "Cushions", at: [41, 64], side: "right" },
      { label: "Standing lamp", at: [26.6, 47], side: "left" },
      { label: "Floor plant", at: [81, 60], side: "left" },
    ],
  },
  {
    id: "kitchen",
    src: aFrameRoom,
    alt: "An open kitchen and living room under a tall triangular window",
    spots: [
      { label: "Pendant lights", at: [64, 35], side: "left" },
      { label: "Timber stairs", at: [66, 48], side: "right" },
      { label: "Tall window", at: [37, 39], side: "left" },
    ],
  },
  {
    id: "mobile-screen",
    src: gardenDining,
    alt: "A dining table and armchair in a glass room facing a garden",
    spots: [
      { label: "Dining table", at: [46, 63], side: "right" },
      { label: "Curved armchair", at: [21, 63], side: "right" },
    ],
  },
];

export const OTHER_USES_HEAD = {
  title: "Other uses",
  lede: `${OTHER_USES.length} ways to set up a piece for something else. Each follows its piece and has no price or page of its own.`,
};

/** How it works, in three numbered columns, each with a photo and its points. */
export const STEPS: readonly { title: string; photo: StaticImageData; points: readonly { head: string; body: string }[] }[] = [
  {
    title: STATUS.launch.name,
    photo: whiteRoom,
    points: [
      { head: "Order first", body: STATUS.launch.detail },
      { head: "Price", body: CLAIMS.price.detail },
    ],
  },
  {
    title: STATUS.soon.name,
    photo: readingCorner,
    points: [
      { head: "After the launch pieces", body: STATUS.soon.detail },
      { head: "Register interest", body: "Tell us which ones you want, and we let you know when each is ready." },
    ],
  },
  {
    title: "Other uses and arrangements",
    photo: aFrameRoom,
    points: [
      { head: "Other uses", body: "Kits and set-ups on a piece you already have. A coffee corner, a video backdrop, a record display." },
      { head: "Arrangements", body: "Pieces standing together, like an island from two carts. They have no price or page of their own." },
    ],
  },
];

export const STEPS_HEAD = {
  title: ["How the", "catalogue works"],
  body: "Three pieces first, with the rest to follow, and every one can be set up for more than one use.",
};

export const QUESTIONS_HEAD = {
  title: "What to know",
  photo: afternoonLivingRoom,
  photoAlt: "A living room in afternoon light",
};

export const QUESTIONS: readonly { question: string; answer: string }[] = [
  { question: "What does it cost?", answer: CLAIMS.price.detail },
  { question: "How does it arrive?", answer: CLAIMS.delivery.detail },
  { question: "Will the tall pieces tip?", answer: CLAIMS.stability.detail },
  { question: "Will it fit my room?", answer: CLAIMS.fit.detail },
  { question: "Are the pictures photographs?", answer: CLAIMS.renders.detail },
  { question: "Why is everything orange?", answer: CLAIMS.accent.detail },
  { question: "When can I have one?", answer: `${CLAIMS.leadTime.label}. ${CLAIMS.leadTime.detail}` },
  { question: "How does it go together?", answer: CLAIMS.assembly.detail },
  { question: "Where do the parts lists come from?", answer: CLAIMS.parts.detail },
  { question: "How do things hang on it?", answer: CLAIMS.hangingFace.detail },
];

export const NOTES_HEAD = {
  title: "Before you choose",
  lede: "What is still open on each piece. The tests, the limits and the choices not made yet.",
  more: "And the pieces that follow",
};

export const KITS_HEAD = {
  title: "Add-on kits",
  lede: "Parts that change a launch piece later. Another pack on the same frame, a door, a drawer, a desk top, casters. What each adds, and what it takes off.",
};

/** Hearing about new pieces: words left, a room right. */
export const NEWS = {
  title: "Hear when new pieces are ready",
  body: "Tell us which ones you want, and we let you know when each is ready.",
  call: "Tell us what you want",
  photo: staircaseCorner,
};

/** The closing photo, under the second marquee. */
export const CLOSING = {
  photo: furnitureGallery,
  photoAlt: "A gallery of wooden furniture",
  title: ["Create with", "intention"],
  body: "Not sure which piece? Draw your room first, and we will suggest the pieces that fit it.",
  call: "Design your room",
};
