import type { StaticImageData } from "next/image";
import bedHead from "@/assets/render-bed-head.webp";
import lowConsole from "@/assets/render-console.webp";
import entry from "@/assets/render-entry.webp";
import kitchen from "@/assets/render-kitchen.webp";
import sofaBack from "@/assets/render-sofa-back.webp";
import workCart from "@/assets/render-work-cart.webp";

/**
 * The about page's words, ported from furnishes_prod's about page
 * (content/site/about-page.ts, about-hero.ts) on the org repo, with its
 * stock photos swapped for our own renders. Its blog is left out. The
 * workshop band's words and figures came from a reference the user sent.
 * The projects' awards and the team's names are prod's as they stand:
 * confirm both before the page goes live.
 */

/** The headline, its highlighted words in the Furnishes orange. */
export const WHO_HEADLINE: readonly { text: string; highlight?: boolean }[] = [
  { text: "Fusing " },
  { text: "passion", highlight: true },
  { text: " and " },
  { text: "craft", highlight: true },
  { text: ": every space tells a story with Furnishes." },
];

export const WHO_TAGLINE = "Honest materials, careful detail: rooms that feel like yours.";

export const WHO_LEAD = "We understand that good design goes beyond aesthetics. We listen first to what matters, then we shape light and layout to how you live, work and rest.";

export const WHO_COLUMNS = [
  "Furnishes draws on a wide spectrum of design traditions and contemporary practice. From the clarity of minimalism and the richness of natural materials to the rigor of space planning, our roots run deep in both craft and function.",
  "This blend of influence fuels interiors that are as livable as they are distinctive, balancing rhythm, restraint and refinement. It is in this intersection that Furnishes creates something lasting: spaces shaped by care and expertise.",
] as const;

export const WORKSHOP: readonly { label: string; value: string }[] = [
  { label: "CNC routers", value: "2 · bed 3.1 × 2.1 m" },
  { label: "Paint shop", value: "12 m spray booth" },
  { label: "Fabric print", value: "3.2 m wide, in-house" },
  { label: "Storage", value: "180 racked bays" },
  { label: "People", value: "30 · 14 makers and fitters" },
];

export const PROJECTS_HEADLINE = "A recognition of design excellence shaped by dedication, innovation and lasting influence.";

/** `images`: renders shown when the row is opened; rows without them do not open. */
export const PROJECTS: readonly {
  year: string;
  award: string;
  project: string;
  result: string;
  images?: readonly { src: StaticImageData; alt: string }[];
}[] = [
  {
    year: "2024",
    award: "Scandinavian Design Awards, Residential",
    project: "Nordic Retreat House",
    result: "Winner",
    images: [
      { src: entry, alt: "An entry unit by the door: hooks, a shelf and a shoe tray" },
      { src: kitchen, alt: "A kitchen cart with jars on top, against a tiled wall" },
      { src: bedHead, alt: "A bed head with shelves and a lamp, under a sloping roof" },
    ],
  },
  {
    year: "2023",
    award: "ArchDaily Interior Excellence, Public Spaces",
    project: "Oslo Civic Pavilion",
    result: "Honorable mention",
    images: [
      { src: lowConsole, alt: "A low console against a sunlit wall" },
      { src: sofaBack, alt: "A shelf unit standing behind a sofa" },
      { src: workCart, alt: "A work cart on castors" },
    ],
  },
  { year: "2022", award: "Global Design Awards, Eco Innovation", project: "Forestline Studio", result: "Finalist" },
  { year: "2021", award: "Nordic Design Week, Innovation & Craftsmanship", project: "Haven Workspace", result: "Winner" },
];

export const TEAM_HEADLINE = "A team united by vision, craft and timeless design.";

/** The line beside the team's headline: the four roles, as the members below. */
export const TEAM_LINE = "A creative director, a 3D lead, a researcher and an architect.";

/** Where the studio is, for each card's "Based in": Furnishes Pte Ltd's home. */
const STUDIO_BASE = "Singapore";

/**
 * `about`: set as the card's focus. `credentials`: boxed in orange when
 * given; prod lists none, so the row is left out till someone has one.
 */
export const TEAM: readonly { name: string; role: string; about: string; credentials?: string; basedIn: string }[] = [
  {
    name: "Elizabeth",
    role: "Creative Director",
    about: "Leads visual direction and narrative across projects, balancing brand, materials and spatial storytelling.",
    basedIn: STUDIO_BASE,
  },
  {
    name: "Mohan",
    role: "3D Visualization Lead",
    about: "Turns concepts into accurate renders and walkthroughs so clients can see light, scale and detail before build.",
    basedIn: STUDIO_BASE,
  },
  {
    name: "Henry",
    role: "Design Researcher",
    about: "Surfaces user needs, benchmarks and trends to inform layouts, ergonomics and long-term adaptability.",
    basedIn: STUDIO_BASE,
  },
  {
    name: "Jessica",
    role: "Principal Architect",
    about: "Owns planning, code coordination and technical resolution from early studies through construction support.",
    basedIn: STUDIO_BASE,
  },
];

/**
 * A piece's days from order to door, for the timeline after the workshop.
 * Stand-in copy for a made-to-order piece till the workshop's own schedule
 * is set; sourced pieces run longer (contact's lead times).
 */
export const MAKING_HEADLINE = { lead: "Twenty-one days.", soft: "From board to your door." };

export const MAKING_LINE =
  "Most pieces are made after you order. This is where yours will be on each day, and we email when it moves.";

export const MAKING_DAYS: readonly { day: number; title: string; body: string }[] = [
  { day: 1, title: "Board chosen", body: "We pick the ash, oak or walnut for your piece from the boards in the workshop." },
  { day: 6, title: "Cut and joined", body: "Mortise and tenon, dowels where they hide, no metal brackets." },
  { day: 9, title: "Oiled by hand", body: "Three coats, rubbed in a day apart, then left to cure." },
  { day: 14, title: "Upholstered", body: "Your fabric, stretched and stitched over wool and foam." },
  { day: 21, title: "At your door", body: "Two people carry it in, unwrap it and take the packaging away." },
];
