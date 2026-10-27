import { type IntroPhoto, PhotoIntro } from "@/features/intro/PhotoIntro";
import { PlanWalk } from "@/features/plan/PlanWalk";
import aFrame from "../../../../public/rooms/a-frame-living-room.jpg";
import banner1 from "../../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../../public/rooms/landing-banner-2.jpg";
import bright from "../../../../public/rooms/bright-living-room.jpg";
import main2 from "../../../../public/rooms/landing-main-2.jpg";

/** Ours, then four of the live site's (its cabin from above swapped for a brighter room: it has no plain area), each with where its plain area is and how dark it is. */
const ROOMS: IntroPhoto[] = [
  { src: aFrame, spot: "left", tone: "ink" },
  { src: banner2, spot: "bottom", tone: "light" },
  { src: banner1, spot: "bottom", tone: "light" },
  { src: main2, spot: "right", tone: "ink" },
  { src: bright, spot: "left", tone: "ink" },
];

/** A trial of the landing with its opening photo rotating through rooms, the title moving to each one's plain area; no loader. */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={ROOMS} />} />;
}
