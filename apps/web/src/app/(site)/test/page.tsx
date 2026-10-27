import { type IntroPhoto, PhotoIntro } from "@/features/intro/PhotoIntro";
import { PlanWalk } from "@/features/plan/PlanWalk";
import aFrame from "../../../../public/rooms/a-frame-living-room.jpg";
import bright from "../../../../public/rooms/bright-living-room.jpg";
import banner1 from "../../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../../public/rooms/landing-banner-2.jpg";
import main2 from "../../../../public/rooms/landing-main-2.jpg";

/** Ours, then four of the live site's: what each room is, and the inks that read under the bar, the title and the small words. */
const ROOMS: IntroPhoto[] = [
  { src: aFrame, caption: "A-frame living room", ink: { bar: "rust", title: "cream", small: "rust" } },
  { src: banner2, caption: "Dining room by the water", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: banner1, caption: "Living room, afternoon sun", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: main2, caption: "Reading corner", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: bright, caption: "Living room, garden side", ink: { bar: "rust", title: "rust", small: "rust" } },
];

/** A trial of the landing with its opening photo rotating through rooms; no loader. */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={ROOMS} />} />;
}
