import type { StaticImageData } from "next/image";
import renderBedHead from "@/assets/render-bed-head.webp";
import renderBookwall from "@/assets/render-bookwall.webp";
import renderDesk from "@/assets/render-desk.webp";
import renderEdge from "@/assets/render-edge.webp";
import renderEntry from "@/assets/render-entry.webp";
import renderKitchen from "@/assets/render-kitchen.webp";

/**
 * A run of the paragraph: words (`mark`ed ones in orange), or a picture set
 * into the line. Words end on their own punctuation, before any picture.
 */
export type Run = { words: string; mark?: boolean } | { photo: StaticImageData; alt: string };

/**
 * "Who we are", after the tour: the brand story's opening (Brand & Product
 * Story v1.1, chapter 02, in English), with a render of what each phrase
 * speaks of set into its line.
 */
export const MANIFESTO: readonly Run[] = [
  { words: "A change at home can start somewhere small: an entryway where the bag finds its place," },
  { photo: renderEntry, alt: "A Furnishes entryway piece with hooks, a shallow tray and a low shelf" },
  { words: "a bedside with the book" },
  { words: "within reach,", mark: true },
  { photo: renderBedHead, alt: "A Furnishes bed head with shelves at hand's height" },
  { words: "a desk that holds work and the things you love." },
  { photo: renderDesk, alt: "A Furnishes desk with open shelves and a side unit" },
  { words: "We design whole pieces from boards, structure and fittings," },
  { photo: renderEdge, alt: "The edge of an 18 mm Furnishes board, close up" },
  { words: "each one good to look at and to use on its own. A piece should" },
  { words: "make today better first;", mark: true },
  { words: "adding to it later is a bonus. What you already own stays" },
  { photo: renderBookwall, alt: "A Furnishes bookwall round a room's own furniture" },
  { words: "part of the home, and every choice starts from" },
  { photo: renderKitchen, alt: "A Furnishes kitchen cart beside a counter" },
  { words: "what matters to you.", mark: true },
];

/**
 * The figures under it, each one the page already stands behind: the
 * boards, the consultant, the tour's steps and how it all starts. `value`'s
 * digits roll to it, anything else in it staying still; `unit` follows it
 * at its size, softer, and `label` reads on from the unit.
 */
export const FIGURES: readonly { value: string; unit?: string; label: string }[] = [
  { value: "18", unit: "mm", label: "every board, cut to your plan." },
  { value: "24/7", label: "our AI Interior Consultant, day or night." },
  { value: "11", unit: "steps", label: "from a floor plan to your door." },
  { value: "1", unit: "chat", label: "is all it takes to begin." },
];
