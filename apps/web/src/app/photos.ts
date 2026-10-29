import type { StaticImageData } from "next/image";
import whiteLivingRoom from "@/assets/white-living-room.jpg";

/**
 * Where "Interior" and "Revolution" sit on a photo's walls, in % of the photo
 * (not the screen, so they stay put however it is cropped): `interiorEnd`,
 * where "Interior" ends, from the left; `revolutionStart`, where "Revolution"
 * starts; `middle`, the words' middle, from the top.
 */
type TitleOnWall = { interiorEnd: number; revolutionStart: number; middle: number };

/**
 * The landing's room photos, in order; with more than one they turn, each
 * numbered on the page by its place here (the first is 1). Files are the
 * Unsplash originals (Spacejoy), scaled to 3840 px on the long side.
 * `shiftLeft` / `shiftUp`: how far the photo runs past the screen's left or
 * top edge, in % of the screen's width or height, to move the room left or
 * up (0 if not given). `title`: the words on its walls, if any.
 */
export const PHOTOS: {
  src: StaticImageData;
  alt: string;
  shiftLeft?: number;
  shiftUp?: number;
  title?: TitleOnWall;
}[] = [
  {
    src: whiteLivingRoom,
    shiftLeft: 6,
    shiftUp: 13.5,
    alt: "A bright living room with a cream sofa under abstract art, orange cushions, a round wooden coffee table and tall windows onto city towers",
  },
];
