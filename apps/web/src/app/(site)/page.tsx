import { type IntroPhoto, PhotoIntro } from "@/features/intro/PhotoIntro";
import { BuildLoader } from "@/features/loader/BuildLoader";
import { PlanWalk } from "@/features/plan/PlanWalk";
import aFrame from "../../../public/rooms/a-frame-living-room.jpg";
import bright from "../../../public/rooms/bright-living-room.jpg";
import banner1 from "../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../public/rooms/landing-banner-2.jpg";
import main2 from "../../../public/rooms/landing-main-2.jpg";

/** The rooms the opening turns through, the dining room first: what each is, and the inks that read under the bar, the title and the small words. */
const ROOMS: IntroPhoto[] = [
  { src: banner2, caption: "Dining room by the water", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: banner1, caption: "Living room, afternoon sun", ink: { bar: "cream", top: "split", title: "cream", small: "cream" } },
  { src: main2, caption: "Reading corner", ink: { bar: "cream", top: "split", title: "cream", small: "cream" } },
  { src: bright, caption: "Living room, garden side", ink: { bar: "rust", title: "rust", small: "rust" } },
  { src: aFrame, caption: "A-frame living room", ink: { bar: "rust", title: "rust", small: "rust" } },
];

/** The landing: the opening loader, then the photo opening, turning through rooms, and the walk. */
export default function HomePage() {
  return (
    <>
      <BuildLoader />
      <PlanWalk intro={<PhotoIntro photos={ROOMS} />} />
    </>
  );
}
