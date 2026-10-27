import { type IntroPhoto, PhotoIntro } from "@/features/intro/PhotoIntro";
import { PlanWalk } from "@/features/plan/PlanWalk";
import aFrame from "../../../../public/rooms/a-frame-living-room.jpg";
import banner1 from "../../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../../public/rooms/landing-banner-2.jpg";
import bright from "../../../../public/rooms/bright-living-room.jpg";
import main2 from "../../../../public/rooms/landing-main-2.jpg";

/**
 * Ours, then four of the live site's (its cabin from above swapped for a
 * brighter room: it has no calm area), each with the side of its foot calm
 * enough for the title, and the inks that read where the words fall.
 */
const ROOMS: IntroPhoto[] = [
  { src: aFrame, side: "right", ink: { title: "ink", details: "ink" } },
  {
    src: banner2,
    side: "right",
    ink: { title: "light", details: "light" },
    bar: { start: "light", end: "light" },
    phoneBar: { start: "light", end: "light" },
  },
  {
    src: banner1,
    side: "left",
    ink: { title: "light", details: "light" },
    bar: { start: "light", end: "ink" },
    phoneBar: { start: "ink", end: "light" },
  },
  {
    src: main2,
    side: "left",
    ink: { title: "light", details: "ink" },
    bar: { start: "light", end: "ink" },
    phoneBar: { start: "light", end: "light" },
  },
  { src: bright, side: "left", ink: { title: "ink", details: "ink" }, phoneBar: { start: "light", end: "ink" } },
];

/** A trial of the landing with its opening photo rotating through rooms, the words laid out for each; no loader. */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={ROOMS} />} />;
}
