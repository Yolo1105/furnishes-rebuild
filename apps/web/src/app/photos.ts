import type { StaticImageData } from "next/image";
import whiteLivingRoom from "@/assets/white-living-room.jpg";

/**
 * The landing's room photos, in order; with more than one they turn, each
 * numbered on the page by its place here (the first is 1). Files are the
 * Unsplash originals (Spacejoy), scaled to 3840 px on the long side.
 */
export const PHOTOS: { src: StaticImageData; alt: string }[] = [
  {
    src: whiteLivingRoom,
    alt: "A bright living room with a cream sofa under abstract art, orange cushions, a round wooden coffee table and tall windows onto city towers",
  },
];
