import { BuildLoader } from "@/features/loader/BuildLoader";
import { PlanWalk } from "@/features/plan/PlanWalk";

export default function HomePage() {
  return (
    <>
      <BuildLoader />
      <PlanWalk />
    </>
  );
}
