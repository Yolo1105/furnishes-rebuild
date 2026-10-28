import { FlatPlan } from "@/features/plan/FlatPlan";
import { Backdrop } from "@/features/stage/Backdrop";
import styles from "../plan/plan.module.css";

/** As /plan, the flat in the right half instead. */
export default function PlanRightPage() {
  return (
    <main className={styles.track} data-assemble>
      <div className={styles.page}>
        <Backdrop />
        <FlatPlan side="right" />
      </div>
    </main>
  );
}
