import type { StaticImageData } from "next/image";
import bedsideAfter from "@/assets/before-after/bedside-after.webp";
import bedsideBefore from "@/assets/before-after/bedside-before.webp";
import bookwallAfter from "@/assets/before-after/bookwall-after.webp";
import bookwallBefore from "@/assets/before-after/bookwall-before.webp";
import entryAfter from "@/assets/before-after/entry-after.webp";
import entryBefore from "@/assets/before-after/entry-before.webp";
import kitchenAfter from "@/assets/before-after/kitchen-after.webp";
import kitchenBefore from "@/assets/before-after/kitchen-before.webp";
import workCartAfter from "@/assets/before-after/work-cart-after.webp";
import workCartBefore from "@/assets/before-after/work-cart-before.webp";
import dividerRender from "@/assets/catalogue/scene/divider.webp";
import mobileScreenRender from "@/assets/catalogue/scene/mobile-screen.webp";
import entryRender from "@/assets/render-entry.webp";
import { ARRANGEMENTS, OTHER_USES, priceFrom, productById, USES, type UseId } from "@/features/products/catalogue";
import { isReal, shown } from "@/lib/facts";
import { routes } from "@/lib/routes";

/**
 * Everyday cases: a corner of a home, how it is now and what a piece does
 * for it (from the brand story's scenes and the "things you stop noticing"
 * list). `piece`: the catalogue piece the card leads to.
 */
const CASE_LIST: readonly { kind: string; title: string; body: string; piece: string }[] = [
  { kind: "The entryway", title: "Give that chair back.", body: "Coats and bags pile on the chair by the door. One panel with hooks and a shoe shelf takes them.", piece: "entry" },
  { kind: "The bedside", title: "What you use, within reach.", body: "Phone on the floor, glass on a book. A small block with a top and one open compartment.", piece: "bedside" },
  { kind: "The workspace", title: "The desk comes back.", body: "Monitor, charger, cables. An organiser stands beside the desk and nothing attaches to it.", piece: "desk" },
  { kind: "The kitchen", title: "More counter when you cook.", body: "Rice cooker and kettle share the only free stretch. A worktop on wheels rolls in, then out.", piece: "kitchen" },
  { kind: "Low cabinets", title: "The long empty wall.", body: "A TV, then things piling on the floor. Three low bays, open, with doors, or both.", piece: "low-cabinet" },
  { kind: "Screens on wheels", title: "What the camera sees.", body: "One side a quiet backdrop for calls, the other for hanging or storage. Roll it where needed.", piece: "mobile-screen" },
  { kind: "A shared room", title: "One room, two people.", body: "A line down the middle nobody can see. A two-sided bookcase makes it real.", piece: "bookwall" },
  { kind: "A whole room", title: "One room, more than one way.", body: "Work on one side, living and storage on the other, with light still coming through.", piece: "divider" },
];

/** The cases whose piece is in the catalogue, each with the piece. */
export const CASES = CASE_LIST.flatMap((c) => {
  const product = productById(c.piece);
  return product ? [{ ...c, product }] : [];
});

/** Everyday problems, in the visitor's words: the room, the design that answers it, and the problem. */
const STREET: readonly (readonly [UseId, string, string])[] = [
  ["entryway", "entry", "Coats pile up on the chair by the door"],
  ["entryway", "console", "Post and keys need somewhere by the door"],
  ["kitchen", "kitchen", "The counter is too short when I cook"],
  ["kitchen", "spice-face", "Bottles and jars crowd the counter"],
  ["kitchen", "kitchen-screen", "The open kitchen splashes the sofa"],
  ["living", "bookwall", "Books and records with no wall to live on"],
  ["living", "sofa-back", "The sofa has its back to the whole room"],
  ["living", "device-cabinet", "The router and all the chargers"],
  ["bedroom", "bedside", "Phone and book on the floor by the bed"],
  ["bedroom", "bed-head", "The bed and the living room are the same room"],
  ["bedroom", "bath-cart", "Towels on the bathroom floor"],
  ["work", "desk", "One table for eating and for working"],
  ["work", "video-background", "The bed is behind me on every call"],
  ["work", "work-cart", "The printer lives on the floor"],
  ["dividing", "divider", "Two children, one room, no line between them"],
  ["dividing", "grille", "A room of their own, with the light still coming through"],
  ["dividing", "mobile-screen", "A screen between two desks"],
];

/** The piece to see for a design: itself, or the piece its other use or arrangement is built on. */
function pieceFor(id: string): string | undefined {
  if (productById(id)) return id;
  return OTHER_USES.find((u) => u.id === id)?.parents[0] ?? ARRANGEMENTS.find((a) => a.id === id)?.members[0]?.product;
}

/** The problems by room, each leading to its piece. */
export const PROBLEMS = (Object.entries(USES) as [UseId, string][])
  .map(([use, room]) => ({
    use,
    room,
    items: STREET.filter(([u]) => u === use).flatMap(([, design, line]) => {
      const id = pieceFor(design);
      return id ? [{ line, href: `${routes.products}/${id}` }] : [];
    }),
  }))
  .filter((r) => r.items.length > 0);

/** By the kind of answer you want: what to choose, and where to find it. */
export const GUIDE: readonly { title: string; body: string; call: string; href: string }[] = [
  {
    title: "One small thing bothers you",
    body: `A small modular piece made for just that problem, from ${priceFrom("bedside")}.`,
    call: "See the small pieces",
    href: `${routes.collection}?width=narrow#find`,
  },
  {
    title: "One room has to do two jobs",
    body: "A tall two-sided cabinet splits it at the size you need. It hides and stores, but doesn't block sound.",
    call: "See the dividers",
    href: `${routes.collection}?use=dividing#find`,
  },
  {
    title: "Your layout keeps changing",
    body: "Carts and screens on wheels, for a counter that follows you or a team's changing work area.",
    call: "See what moves",
    href: `${routes.collection}?activity=move#find`,
  },
  {
    title: "Standard sizes don't fit the spot",
    body: "A modular piece, sized in steps to the space you have.",
    call: "Find your size",
    href: `${routes.collection}#find`,
  },
  {
    title: "A standard size is all you need",
    body: "Ready-made furniture, ordered as it is.",
    call: "See the furniture",
    href: routes.products,
  },
];

/** Where the furniture is used, and what to think about in each place. */
export const PLACES: readonly { name: string; line: string; points: readonly string[]; href: string; render: StaticImageData; alt: string }[] = [
  {
    name: "HDB homes",
    line: "Pieces for the small spots that bother you, sized for a flat.",
    points: [
      "By the door: bags, shoes and keys with nowhere to go.",
      "If the way in is tight, choose flat-packed: its largest box is smaller than the piece.",
      ...(isReal("hdbRules") ? [`Check HDB's rules before you drill. ${shown("hdbRules")}`] : []),
    ],
    href: routes.hdbHomes,
    render: entryRender,
    alt: "The entry piece by a front door, with hooks and a shoe shelf; a 3D render",
  },
  {
    name: "Rented and shared rooms",
    line: "Tall cabinets that split one room in two, at the size you need.",
    points: [
      "Holds books and belongings as it divides.",
      "Measure where windows, doors and fans are, so it doesn't block them.",
      "Check with your landlord before you drill.",
    ],
    href: routes.roomDividers,
    render: dividerRender,
    alt: "A tall two-sided divider cabinet splitting a room; a 3D render",
  },
  {
    name: "Startup offices",
    line: "Desks and chairs for a growing team, and screens that move with a project.",
    points: [
      "Start with what the team needs now, and add a piece when someone joins.",
      "A corner for calls gives privacy from view, not from sound.",
      ...(isReal("officeTerms") ? [shown("officeTerms")] : []),
    ],
    href: routes.workspaces,
    render: mobileScreenRender,
    alt: "A screen on wheels beside a desk; a 3D render",
  },
];

const SWAPS: readonly { id: string; line: string; before: StaticImageData; after: StaticImageData }[] = [
  { id: "entry", line: "Coats pile up on the chair by the door.", before: entryBefore, after: entryAfter },
  { id: "bedside", line: "Phone and book on the floor by the bed.", before: bedsideBefore, after: bedsideAfter },
  { id: "kitchen", line: "The counter is too short when I cook.", before: kitchenBefore, after: kitchenAfter },
  { id: "bookwall", line: "Books and records with no wall to live on.", before: bookwallBefore, after: bookwallAfter },
  { id: "work-cart", line: "The printer lives on the floor.", before: workCartBefore, after: workCartAfter },
];

/** The same room before and after a piece, with the piece's name. */
export const BEFORE_AFTER = SWAPS.flatMap((s) => {
  const product = productById(s.id);
  return product ? [{ ...s, name: product.name }] : [];
});
