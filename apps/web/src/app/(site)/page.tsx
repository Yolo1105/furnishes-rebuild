import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { BuildLoader } from "@/features/loader/BuildLoader";
import { PlanWalk } from "@/features/plan/PlanWalk";

/** The landing: the opening loader, then the photo opening and the walk (as /test). */
export default function HomePage() {
  return (
    <>
      <BuildLoader />
      <PlanWalk intro={<PhotoIntro />} />
    </>
  );
}
