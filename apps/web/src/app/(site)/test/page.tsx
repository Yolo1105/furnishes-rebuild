import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { ROOMS } from "@/features/intro/rooms";
import { PlanWalk } from "@/features/plan/PlanWalk";

/**
 * A trial of the landing: the opening as on the home page, and the walk on
 * paper with its panel on the site's background; no loader.
 */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro photos={ROOMS} />} swapGrounds />;
}
