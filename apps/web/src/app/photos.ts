import type { StaticImageData } from "next/image";
import whiteLivingRoom from "@/assets/white-living-room.jpg";

/**
 * The landing's room photos, in order; with more than one they turn, each
 * numbered on the page by its place here (the first is 1). Files are the
 * Unsplash originals (Spacejoy), scaled to 3840 px on the long side.
 * `shiftLeft` / `shiftUp`: how far the photo runs past the screen's left or
 * top edge, in % of the screen's width or height, to move the room left or
 * up (0 if not given).
 */
export const PHOTOS: { src: StaticImageData; alt: string; shiftLeft?: number; shiftUp?: number }[] = [
  {
    src: whiteLivingRoom,
    shiftLeft: 6,
    shiftUp: 6,
    alt: "A bright living room with a cream sofa under abstract art, orange cushions, a round wooden coffee table and tall windows onto city towers",
  },
];
