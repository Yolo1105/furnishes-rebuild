import type { StaticImageData } from "next/image";
import archedWindowLounge from "@/assets/arched-window-lounge.jpg";
import cabinLivingRoom from "@/assets/cabin-living-room.jpg";
import galleryWallSofa from "@/assets/gallery-wall-sofa.jpg";
import greenLivingRoom from "@/assets/green-living-room.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import sunlitBedroom from "@/assets/sunlit-bedroom.jpg";
import { PHOTOS } from "../photos";

/**
 * The studio's room photos, in order: the landing's first, then the rest of
 * the set (Unsplash originals, Spacejoy, scaled to 3840 px on the long side).
 */
export const ROOM_PHOTOS: { src: StaticImageData; alt: string }[] = [
  ...PHOTOS.map(({ src, alt }) => ({ src, alt })),
  {
    src: greenLivingRoom,
    alt: "A living room with a sage green wall of framed prints, an orange sectional sofa, a glass coffee table, a patterned armchair and a small desk",
  },
  {
    src: readingCorner,
    alt: "A reading corner with a tan leather swivel chair, a leather pouf, hanging plants and three wall shelves of books, prints and vases",
  },
  {
    src: cabinLivingRoom,
    alt: "A small living room with a leather loveseat between windows, two cowhide stools, a dining table with orange chairs and dark cabinets",
  },
  {
    src: archedWindowLounge,
    alt: "A tall room with a curtained arched window, two cream armchairs, a curved orange sofa, a marble coffee table and a brass chandelier",
  },
  {
    src: sunlitBedroom,
    alt: "A sunlit bedroom with orange curtains, built-in shelves over a small desk, framed prints and a bed with a rust throw",
  },
  {
    src: galleryWallSofa,
    alt: "A living room with a gallery wall of framed prints over a cognac leather sofa, a fiddle-leaf fig, a round coffee table and a yellow ottoman",
  },
];
