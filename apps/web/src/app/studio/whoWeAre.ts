import type { StaticImageData } from "next/image";
import afternoonRoom from "@/assets/afternoon-living-room.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import gardenDining from "@/assets/garden-dining-room.jpg";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import staircaseCorner from "@/assets/staircase-reading-corner.jpg";
import aFrameRoom from "@/assets/a-frame-living-room.jpg";

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
  { words: "A change at home can start somewhere small, an entryway where the bag finds its place," },
  { photo: staircaseCorner, alt: "Two armchairs by a tall window at the foot of a staircase" },
  { words: "a bedside with the book" },
  { words: "within reach,", mark: true },
  { photo: afternoonRoom, alt: "A living room in afternoon light" },
  { words: "a desk that holds work and the things you love." },
  { photo: gardenDining, alt: "A dining table in a glass room facing a garden" },
  { words: "We design whole pieces from boards, structure and fittings," },
  { photo: sageSideboard, alt: "A sideboard against a sage wall" },
  { words: "each one good to look at and to use on its own. A piece should" },
  { words: "make today better first,", mark: true },
  { words: "adding to it later is a bonus. What you already own stays" },
  { photo: readingCorner, alt: "A reading corner with wall shelves and an orange armchair" },
  { words: "part of the home, and every choice starts from" },
  { photo: aFrameRoom, alt: "An open kitchen under a tall triangular window" },
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
  { value: "24", unit: "hours", label: "a day, our AI Interior Consultant answers." },
  { value: "11", unit: "steps", label: "from a floor plan to your door." },
  { value: "1", unit: "chat", label: "is all it takes to begin." },
];
