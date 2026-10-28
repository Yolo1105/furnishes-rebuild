import { Backdrop } from "@/features/stage/Backdrop";
import styles from "./draft.module.css";

/** A blank page to build on: the bar and the site's background (as on plan-right), nothing else yet. */
export default function DraftPage() {
  return (
    <div className={styles.page}>
      <Backdrop />
    </div>
  );
}
