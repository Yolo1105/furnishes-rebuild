import type { StaticImageData } from "next/image";
import afternoonLivingRoom from "@/assets/afternoon-living-room.jpg";
import brightLivingRoom from "@/assets/bright-living-room.jpg";
import gardenDiningRoom from "@/assets/garden-dining-room.jpg";
import readingCorner from "@/assets/reading-corner.jpg";
import staircaseReadingCorner from "@/assets/staircase-reading-corner.jpg";
import whiteLivingRoom from "@/assets/white-living-room.jpg";

/**
 * The ideas on the inspiration page, each set out as a sheet: the room on an
 * HDB plan (`room`, a key of ROOMS in features/plan/flat), then a
 * stock mood photo that is not of our pieces. Ideas, not finished jobs.
 */
export const PROJECTS: readonly {
  slug: string;
  title: string;
  body: string;
  room: string;
  photo: StaticImageData;
  alt: string;
}[] = [
  {
    slug: "living-dining",
    title: "Living and dining.",
    body: "Turn the sofa to face the window. Let one long low unit take the TV, the books and the router.",
    room: "living",
    photo: whiteLivingRoom,
    alt: "A bright living room with a cream sofa under abstract art, a round wooden coffee table and tall windows",
  },
  {
    slug: "kitchen",
    title: "Kitchen.",
    body: "A second surface on casters that rolls out to the hob when two people cook.",
    room: "kitchen",
    photo: gardenDiningRoom,
    alt: "A glass-walled dining corner with wishbone chairs round a white table and a kitchen counter in front",
  },
  {
    slug: "study",
    title: "Study.",
    body: "A desk along the window wall, its cables run in the back rail, and shelves above it to the ceiling.",
    room: "bedroom3",
    photo: readingCorner,
    alt: "A reading corner with a leather swivel chair, hanging plants and three wall shelves of books",
  },
  {
    slug: "master-bedroom",
    title: "Master bedroom.",
    body: "Keep the window seat. A bench at the foot of the bed takes clothes that never reach the wardrobe.",
    room: "master",
    photo: afternoonLivingRoom,
    alt: "A cabin living room in afternoon sun, with a grey sofa, a white coffee table and a window seat",
  },
  {
    slug: "reading-room",
    title: "Reading room.",
    body: "Make the second bedroom a reading room. Two low chairs, a lamp between them, books where the bed was.",
    room: "bedroom2",
    photo: staircaseReadingCorner,
    alt: "A reading corner under a wooden staircase, with two rattan armchairs, a floor lamp and shelves",
  },
  {
    slug: "hall",
    title: "Hall.",
    body: "Give shoes, bags and the bicycle one wall by the door, so the hall stays a way through.",
    room: "hall",
    photo: brightLivingRoom,
    alt: "A bright living room with a tan leather sofa, a bookcase and a bicycle by the wall",
  },
];
