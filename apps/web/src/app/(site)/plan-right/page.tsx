import { FlatPlan } from "@/features/plan/FlatPlan";
import { Backdrop } from "@/features/stage/Backdrop";
import styles from "../plan/plan.module.css";

/** As /plan, the plan in the right half instead: the bar, the site's background and the 2D floor plan. */
export default function PlanRightPage() {
  return (
    <main className={styles.page}>
      <Backdrop />
      <FlatPlan side="right" />
    </main>
  );
}
