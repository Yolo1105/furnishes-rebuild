import type { StaticImageData } from "next/image";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import afternoonLivingRoom from "@/assets/afternoon-living-room.jpg";
import balconyDoors from "@/assets/balcony-doors.jpg";
import brightLivingRoom from "@/assets/bright-living-room.jpg";
import furnitureGallery from "@/assets/furniture-gallery.jpg";
import gardenDiningRoom from "@/assets/garden-dining-room.jpg";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import staircaseReadingCorner from "@/assets/staircase-reading-corner.jpg";
import { PHOTOS } from "../photos";

/**
 * The studio's room photos, in order: the landing's first, then the reading
 * corner (Spacejoy on Unsplash, 3840 px on the long side), then the rooms the
 * landing-page branch turned through, then the doors onto a deck, the dining
 * corner and the furniture gallery, then the A-frame room (all 2000 px), then
 * the sage sideboard (an earlier photo of the studio's, brought back, at 2000 px).
 *
 * `focus`: the point to keep in the middle of the half, as [x, y] in % of the
 * photo from its top left (the room's middle: its art wall, its chair and
 * shelves), as far as the photo allows; [50, 50] if not given. `zoom`: how
 * much closer than just covering the half, so the photo can move up as well
 * as across (1 if not given). `room`: the room on the floor plan it stands
 * for (a key of ROOMS in features/plan/flat), so hovering that room brings it
 * up; one photo per room, no two the same. `label: "light"`: keep the
 * label over the photo in its browns, however dark it measures behind it.
 * `ink`: the room's name over the photo in this colour, whatever is measured.
 */
export const ROOM_PHOTOS: {
  src: StaticImageData;
  alt: string;
  room: string;
  focus?: [number, number];
  zoom?: number;
  label?: "light";
  ink?: "cream" | "umber";
}[] = [
  ...PHOTOS.map(({ src, alt }) => ({ src, alt, room: "living", focus: [52, 58] as [number, number], zoom: 1.08, ink: "cream" as const })),
  {
    src: readingCorner,
    room: "bedroom3", // the small bedroom with the desk, as a study
    ink: "umber",
    focus: [70, 50],
    alt: "A reading corner with a tan leather swivel chair, a leather pouf, hanging plants and three wall shelves of books, prints and vases",
  },
  {
    src: afternoonLivingRoom,
    room: "master", // its window seat and sofa, as the bedroom's sitting corner
    ink: "cream",
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
    src: gardenDiningRoom,
    room: "kitchen", // the counter in front, the dining table off it
    focus: [45, 55],
    label: "light",
    alt: "A glass-walled dining corner with wishbone chairs round a white table, a ribbed tan armchair, and pampas grass and trees outside, a kitchen counter in front",
  },
  {
    src: balconyDoors,
    room: "yard", // the way out to the open air
    focus: [45, 55],
    alt: "Wooden doors open onto a deck with a slatted wooden chair, sheer curtains and green hills of vineyards beyond",
  },
  {
    src: furnitureGallery,
    room: "shelter", // the storeroom: furniture kept on shelves
    focus: [35, 60],
    label: "light",
    alt: "A gallery of wooden furniture, with chairs on black shelving, a round cherry table and stool on a white plinth and a timber floor",
  },
  {
    src: aFrameLivingRoom,
    room: "ensuite", // the one photo left over, until there is a photo of a bathroom
    focus: [45, 50],
    alt: "An A-frame living room with orange armchairs, a triangular window onto trees, a floating staircase and a stone kitchen island",
  },
  {
    src: sageSideboard,
    room: "bathroom", // its round mirror between two wall lights, as over a basin
    ink: "umber",
    focus: [50, 45],
    alt: "A sage green wall with a round mirror between two wall lights over a rattan sideboard, large potted plants and a patterned rug",
  },
];
