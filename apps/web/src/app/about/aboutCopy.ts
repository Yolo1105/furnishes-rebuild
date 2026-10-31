import type { StaticImageData } from "next/image";
import afternoonRoom from "@/assets/afternoon-living-room.jpg";
import staircaseCorner from "@/assets/staircase-reading-corner.jpg";
import aFrameRoom from "@/assets/a-frame-living-room.jpg";
import whiteRoom from "@/assets/white-living-room.jpg";
import brightRoom from "@/assets/bright-living-room.jpg";
import gallery from "@/assets/furniture-gallery.jpg";
import { marked, shown } from "@/lib/facts";

/**
 * The about page's words: drafts of how Furnishes works, for approval.
 * Anything about real events, people or results is a marked placeholder
 * (lib/facts) till it can be shown to be true.
 */

/** The headline, its highlighted words in the Furnishes orange. */
export const WHO_HEADLINE: readonly { text: string; highlight?: boolean }[] = [
  { text: "Furniture that " },
  { text: "fits", highlight: true },
  { text: " how you " },
  { text: "live", highlight: true },
  { text: " and work." },
];

export const WHO_TAGLINE = "Ready-made furniture, and pieces you can adjust to your space.";

export const WHO_LEAD = "Furnishes sells furniture for Singapore homes and small offices. Some pieces are ready to buy as they are. Others are built from a family of birch panels, so you can change the size, the finish and the add-ons within clear limits.";

export const WHO_COLUMNS = [
  "A change at home can start with something small: a place for the bag by the door, or a bedside that keeps the book within reach. It can also be bigger: a tall cabinet that divides a rented room, or a work area that changes as a team grows.",
  "Each piece should be good on its own today, and adding to it later is a bonus. If you need help choosing, we can come to your room for a consultation, and the AI assistant can help once you sign in.",
] as const;

export const WORKSHOP: readonly { label: string; value: string }[] = [
  { label: "Made in", value: "China" },
  { label: "Factory", value: shown("supplierName") },
  { label: "Material", value: "18 mm birch plywood, white matte faces" },
  { label: "Arrives", value: "Flat-packed or already built" },
  { label: "Delivered to", value: "Singapore" },
];

export const PROJECTS_HEADLINE = "Recognition";

/** Placeholder rows till recognition can be shown. `images`: mood photos shown when the row is opened; rows without them do not open. */
const UNPROVEN = { year: marked("award", "year"), award: shown("award"), project: marked("award", "project"), result: marked("award", "result") };

export const PROJECTS: readonly {
  year: string;
  award: string;
  project: string;
  result: string;
  images?: readonly { src: StaticImageData; alt: string }[];
}[] = [
  {
    ...UNPROVEN,
    images: [
      { src: staircaseCorner, alt: "A mood photo of two armchairs by a tall window, not a Furnishes project" },
      { src: aFrameRoom, alt: "A mood photo of an open kitchen under a triangular window, not a Furnishes project" },
      { src: afternoonRoom, alt: "A mood photo of a living room in afternoon light, not a Furnishes project" },
    ],
  },
  {
    ...UNPROVEN,
    images: [
      { src: whiteRoom, alt: "A mood photo of a white living room, not a Furnishes project" },
      { src: brightRoom, alt: "A mood photo of a bright living room, not a Furnishes project" },
      { src: gallery, alt: "A mood photo of a gallery of wooden furniture, not a Furnishes project" },
    ],
  },
  UNPROVEN,
  UNPROVEN,
];

export const TEAM_HEADLINE = "Who is behind Furnishes.";

export const TEAM_LINE = "The people you are buying from.";

/** Where the company is, for each card's "Based in". */
const BASE = "Singapore";

/**
 * `about`: set as the card's focus. `initial`: the portrait frame's letter,
 * where the name has none yet. `credentials`: boxed in orange when given.
 */
export const TEAM: readonly { name: string; role: string; about: string; initial?: string; credentials?: string; basedIn: string }[] = [
  {
    name: "Mohan",
    role: "Cofounder and CTO",
    about: "Leads the website, the 3D view and the AI assistant.",
    basedIn: BASE,
  },
  {
    name: shown("team"),
    role: marked("team", "role"),
    about: marked("team", "about this person"),
    initial: "?",
    basedIn: BASE,
  },
];

/** From order to door, for the timeline after the factory. */
export const MAKING_HEADLINE = { lead: "From order", soft: "to your home." };

export const MAKING_LINE = `Most pieces are made after you order. Flat-packed pieces take ${shown("leadFlatPack")}, and built pieces ${shown("leadBuilt")}.`;

export const MAKING_DAYS: readonly { day: number; title: string; body: string }[] = [
  { day: 1, title: "You order", body: "You confirm the piece, its size, its finish and whether it comes flat-packed or built." },
  { day: 2, title: "It is made", body: "Our partner factory in China makes it to the version you chose." },
  { day: 3, title: "It is packed", body: "Each piece is packed with its parts and, if it is flat-packed, its steps." },
  { day: 4, title: "It ships", body: "It travels from China to Singapore, and we email you when it moves." },
  { day: 5, title: "It arrives", body: "Built pieces arrive ready to use. Flat-packed pieces are ready to put together." },
];
