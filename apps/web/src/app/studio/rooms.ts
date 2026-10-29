import type { StaticImageData } from "next/image";
import archedWindowLounge from "@/assets/arched-window-lounge.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import { PHOTOS } from "../photos";

/**
 * The studio's room photos, in order: the landing's first, then the rest of
 * the set (Unsplash originals, Spacejoy, scaled to 3840 px on the long side).
 */
export const ROOM_PHOTOS: { src: StaticImageData; alt: string }[] = [
  ...PHOTOS.map(({ src, alt }) => ({ src, alt })),
  {
    src: readingCorner,
    alt: "A reading corner with a tan leather swivel chair, a leather pouf, hanging plants and three wall shelves of books, prints and vases",
  },
  {
    src: archedWindowLounge,
    alt: "A tall room with a curtained arched window, two cream armchairs, a curved orange sofa, a marble coffee table and a brass chandelier",
  },
];
