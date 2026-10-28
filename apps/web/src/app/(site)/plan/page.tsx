import { FlatPlan } from "@/features/plan/FlatPlan";
import { Backdrop } from "@/features/stage/Backdrop";
import styles from "./plan.module.css";

/** The flat taken apart into its rooms, in the left half, coming together as the page scrolls: the bar, the site's background and the flat, nothing else. */
export default function PlanPage() {
  return (
    <main className={styles.track} data-assemble>
      <div className={styles.page}>
        <Backdrop />
        <FlatPlan />
      </div>
    </main>
  );
}
