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
import { ACTIVITIES, ARRANGEMENTS, OTHER_USES, productById, USES, type UseId } from "@/features/products/catalogue";

/** Everyday problems, from the street: the room, the design that answers it, and the problem in the visitor's words. */
const STREET: readonly (readonly [UseId, string, string])[] = [
  ["entryway", "entry", "Coats pile up on the chair by the door"],
  ["entryway", "coat-stand", "No hallway: coats land on the chair by the door"],
  ["entryway", "console", "Post and keys need somewhere by the door"],
  ["kitchen", "kitchen", "The counter is too short when I cook"],
  ["kitchen", "spice-face", "Bottles and jars crowd the counter"],
  ["kitchen", "coffee", "The kitchen wall has nothing on it"],
  ["kitchen", "island", "More counter when three of us cook"],
  ["kitchen", "kitchen-screen", "The open kitchen splashes the sofa"],
  ["living", "bookwall", "Books and records with no wall to live on"],
  ["living", "drop-leaf", "There is no desk in the flat"],
  ["living", "sofa-back", "The sofa has its back to the whole room"],
  ["living", "device-cabinet", "The router and all the chargers"],
  ["living", "shape-l", "One big room and no corners in it"],
  ["bedroom", "bedside", "Phone and book on the floor by the bed"],
  ["bedroom", "bed-head", "The bed and the living room are the same room"],
  ["bedroom", "bed-screen", "Something between the bed and the rest, that rolls away"],
  ["bedroom", "shape-t", "Two bedsides on one wall"],
  ["bedroom", "fitting", "A mirror to dress by"],
  ["bedroom", "bath-cart", "Towels on the bathroom floor"],
  ["work", "desk", "One table for eating and for working"],
  ["work", "video-background", "The bed is behind me on every call"],
  ["work", "phone-booth", "Three desks in a row and three calls at once"],
  ["work", "two-desks", "Two of us working back to back"],
  ["work", "workstation-wall", "A desk that is part of the wall"],
  ["work", "work-cart", "The printer lives on the floor"],
  ["work", "tool-screen", "Tools on one side, a whiteboard on the other"],
  ["work", "standing-desk", "A standing desk on the screen itself"],
  ["dividing", "divider", "Two children, one room, no line between them"],
  ["dividing", "grille", "A room of their own, with the light still coming through"],
  ["dividing", "wheeled-partition", "Move the wall when there is a party"],
  ["dividing", "mobile-screen", "A screen between two desks"],
];

/** The piece to see for a design: itself, or the piece its other use or arrangement is built on. */
function pieceFor(id: string): string | undefined {
  if (productById(id)) return id;
  return OTHER_USES.find((u) => u.id === id)?.parents[0] ?? ARRANGEMENTS.find((a) => a.id === id)?.members[0]?.product;
}

/** The problems by room, each leading to its piece. */
export const PROBLEMS = (Object.entries(USES) as [UseId, string][]).map(([use, room]) => ({
  use,
  room,
  items: STREET.filter(([u]) => u === use).flatMap(([, design, line]) => {
    const id = pieceFor(design);
    return id ? [{ line, id }] : [];
  }),
}));

/** What it can do: each action, leading to the pieces that do it. */
export const ACTIONS = Object.entries(ACTIVITIES).map(([id, { name }]) => ({ id, name }));

/** Needs you may not have noticed: how a corner is now, what it could be, and the piece it would take. */
export const REVEALS = [
  { id: "entry", title: "That chair by the door", now: "A chair nobody sits on, wearing a coat and holding a bag.", could: "One panel with hooks and a shoe shelf beside it. The chair goes back to being a chair." },
  { id: "desk", title: "The desk you already like", now: "The desk is fine. The desk is also under a monitor, a charger, headphones and three cables.", could: "An organiser stands beside it. Nothing attaches to the desk. The desktop comes back." },
  { id: "bedside", title: "The last thing at night", now: "A phone on the floor. A glass on a book. A lamp on a box.", could: "A 40 cm block with a top and one open compartment." },
  { id: "kitchen", title: "Thirty centimetres of counter", now: "The rice cooker, the kettle and the chopping board share the only free stretch.", could: "A trolley with a worktop rolls in when you cook and out when you don't." },
  { id: "bookwall", title: "One room, two people", now: "A bed on each side and a line down the middle nobody can see.", could: "A double-sided bookcase makes the line real, with books on both sides." },
  { id: "mobile-screen", title: "What the camera sees", now: "The call sees the laundry rack, the bed, the door.", could: "A mobile screen with a quiet face rolls behind your chair, with storage on your side." },
  { id: "low-cabinet", title: "The long empty wall", now: "A TV and a lot of nothing. Things pile on the floor beside it.", could: "Three bays low along the wall. Open, doors, or both." },
  { id: "work-cart", title: "A corner with nothing in it yet", now: "You've just moved in. The corner is waiting for a desk.", could: "Start with what you need today, and add to it as the corner fills up." },
].flatMap((r) => {
  const product = productById(r.id);
  return product ? [{ ...r, product }] : [];
});

const SWAPS: readonly { id: string; line: string; before: StaticImageData; after: StaticImageData }[] = [
  { id: "entry", line: "Coats pile up on the chair by the door", before: entryBefore, after: entryAfter },
  { id: "bedside", line: "Phone and book on the floor by the bed", before: bedsideBefore, after: bedsideAfter },
  { id: "work-cart", line: "The printer lives on the floor", before: workCartBefore, after: workCartAfter },
  { id: "kitchen", line: "The counter is too short when I cook", before: kitchenBefore, after: kitchenAfter },
  { id: "bookwall", line: "Books and records with no wall to live on", before: bookwallBefore, after: bookwallAfter },
];

/** The same room before and after a piece, with the piece's name. */
export const BEFORE_AFTER = SWAPS.flatMap((s) => {
  const product = productById(s.id);
  return product ? [{ ...s, name: product.name }] : [];
});
