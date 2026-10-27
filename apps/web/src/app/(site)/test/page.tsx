import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { ROOMS } from "@/features/intro/rooms";
import { PlanWalk } from "@/features/plan/PlanWalk";

/** A trial of the landing's opening with nothing on its photos but the bar, to design the words afresh; no loader. */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={ROOMS} bare />} />;
}
