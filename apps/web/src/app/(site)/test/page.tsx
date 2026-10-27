import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { PlanWalk } from "@/features/plan/PlanWalk";
import aFrame from "../../../../public/rooms/a-frame-living-room.jpg";
import bright from "../../../../public/rooms/bright-living-room.jpg";
import banner1 from "../../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../../public/rooms/landing-banner-2.jpg";
import main2 from "../../../../public/rooms/landing-main-2.jpg";

/** A trial of the landing with its opening photo rotating through rooms (ours, then four of the live site's); no loader. */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={[aFrame, banner2, banner1, main2, bright]} />} />;
}
