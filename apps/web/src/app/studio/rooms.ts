import type { StaticImageData } from "next/image";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import afternoonLivingRoom from "@/assets/afternoon-living-room.jpg";
import brightLivingRoom from "@/assets/bright-living-room.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import staircaseReadingCorner from "@/assets/staircase-reading-corner.jpg";
import { PHOTOS } from "../photos";

/**
 * The studio's room photos, in order: the landing's first, then the reading
 * corner (Spacejoy on Unsplash, 3840 px on the long side), then the rooms the
 * landing-page branch turned through (2000 px).
 *
 * `focus`: the point to keep in the middle of the half, as [x, y] in % of the
 * photo from its top left (the room's middle: its art wall, its chair and
 * shelves), as far as the photo allows; [50, 50] if not given. `zoom`: how
 * much closer than just covering the half, so the photo can move up as well
 * as across (1 if not given). `room`: the room on the floor plan it stands
 * for (a key of ROOMS in features/plan/flat), so hovering that room brings it
 * up; one photo per room, no two the same.
 */
export const ROOM_PHOTOS: {
  src: StaticImageData;
  alt: string;
  room: string;
  focus?: [number, number];
  zoom?: number;
}[] = [
  ...PHOTOS.map(({ src, alt }) => ({ src, alt, room: "living", focus: [52, 58] as [number, number], zoom: 1.08 })),
  {
    src: readingCorner,
    room: "bedroom3", // the small bedroom with the desk, as a study
    focus: [70, 50],
    alt: "A reading corner with a tan leather swivel chair, a leather pouf, hanging plants and three wall shelves of books, prints and vases",
  },
  {
    src: afternoonLivingRoom,
    room: "master", // its window seat and sofa, as the bedroom's sitting corner
    focus: [45, 50],
    alt: "A cabin living room in afternoon sun, with a grey sofa under a large painting, a white coffee table, a patterned rug and a window seat",
  },
  {
    src: staircaseReadingCorner,
    room: "bedroom2", // a reading nook for the second bedroom
    focus: [55, 50],
    alt: "A reading corner under a wooden staircase, with two rattan armchairs, a floor lamp, two stools and shelves against a terracotta wall",
  },
  {
    src: brightLivingRoom,
    room: "hall", // the bicycle and bookcase by the way in
    alt: "A bright living room with a tan leather sofa, wooden block tables, a bookcase, a bicycle and a long green painting",
  },
  {
    src: aFrameLivingRoom,
    room: "kitchen", // its kitchen island, until there is a photo of a kitchen alone
    focus: [45, 50],
    alt: "An A-frame living room with orange armchairs, a triangular window onto trees, a floating staircase and a stone kitchen island",
  },
];
