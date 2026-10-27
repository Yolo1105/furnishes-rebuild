import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { ROOMS } from "@/features/intro/rooms";
import { BuildLoader } from "@/features/loader/BuildLoader";
import { PlanWalk } from "@/features/plan/PlanWalk";

/** The landing: the opening loader, then the photo opening, turning through rooms, and the walk. */
export default function HomePage() {
  return (
    <>
      <BuildLoader />
      <PlanWalk intro={<PhotoIntro photos={ROOMS} />} />
    </>
  );
}
