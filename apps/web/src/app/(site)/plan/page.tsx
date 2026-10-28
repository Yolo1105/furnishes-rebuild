import { FlatPlan } from "@/features/plan/FlatPlan";
import { Backdrop } from "@/features/stage/Backdrop";
import styles from "./plan.module.css";

/** The flat's plan alone: the bar, the site's background and the 2D floor plan, nothing else. */
export default function PlanPage() {
  return (
    <main className={styles.page}>
      <Backdrop />
      <FlatPlan />
    </main>
  );
}
