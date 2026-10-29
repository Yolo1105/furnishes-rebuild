import type { StaticImageData } from "next/image";
import archedWindowLounge from "@/assets/arched-window-lounge.jpg";
import brickNook from "@/assets/brick-nook.jpg";
import cabinLivingRoom from "@/assets/cabin-living-room.jpg";
import darkEntryway from "@/assets/dark-entryway.jpg";
import galleryWallSofa from "@/assets/gallery-wall-sofa.jpg";
import greenLivingRoom from "@/assets/green-living-room.jpg";
import oliveWallSofa from "@/assets/olive-wall-sofa.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import sunlitBedroom from "@/assets/sunlit-bedroom.jpg";
import whiteLivingRoom from "@/assets/white-living-room.jpg";

/**
 * The landing's room photos, in order; each is numbered on the page by its
 * place here (the first is 1). Files are the Unsplash originals (Spacejoy),
 * scaled to 3840 px on the long side.
 */
export const PHOTOS: { src: StaticImageData; alt: string }[] = [
  {
    src: greenLivingRoom,
    alt: "A living room with a sage green wall of framed prints, an orange sectional sofa, a glass coffee table, a patterned armchair and a small desk",
  },
  {
    src: whiteLivingRoom,
    alt: "A bright living room with a cream sofa under abstract art, orange cushions, a round wooden coffee table and tall windows onto city towers",
  },
  {
    src: readingCorner,
    alt: "A reading corner with a tan leather swivel chair, a leather pouf, hanging plants and three wall shelves of books, prints and vases",
  },
  {
    src: sageSideboard,
    alt: "A sage green wall with a round mirror over a rattan sideboard, large plants, a sling chair and a patterned rug",
  },
  {
    src: oliveWallSofa,
    alt: "A living room with an olive wall, a cognac leather sofa under a large black and white painting, brass lamps and orange curtains",
  },
  {
    src: darkEntryway,
    alt: "An entryway with a charcoal wall, a round mirror on a brass shelf, a wooden storage bench with cushions, rain boots and a yellow umbrella",
  },
  {
    src: cabinLivingRoom,
    alt: "A small living room with a leather loveseat between windows, two cowhide stools, a dining table with orange chairs and dark cabinets",
  },
  {
    src: brickNook,
    alt: "A brick-walled window nook with a white armchair, a log side table with a lamp and a rubber plant, between dark kitchen cabinets",
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
