import Image from "next/image";
import Link from "next/link";
import edge from "@/assets/render-edge.webp";
import { routes } from "@/lib/routes";
import { WORKSHOP } from "./aboutCopy";
import styles from "./page.module.css";

/**
 * The workshop band, on paper: on the left the index, the headline, a line
 * on why owning the tools matters, the ruled schedule of what is in there
 * and an orange block to come and see it; on the right, running to the
 * page's edge, a close render of a panel's birch edge.
 */
export function Workshop() {
  return (
    <section className={styles.workshop} aria-labelledby="workshop-title">
      <div className={styles.workshopText}>
        <p className={styles.index}>
          <span>A-200</span>
          <span>The workshop</span>
        </p>
        <h2 id="workshop-title" className={styles.heading}>
          We own the tools, so we can change our minds late.
        </h2>
        <p className={styles.lede}>When a panel needs recutting on a Thursday, it gets recut on Thursday.</p>
        <dl className={styles.schedule}>
          {WORKSHOP.map((row) => (
            <div key={row.label} className={styles.scheduleRow}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link href={routes.contact} className={styles.block}>
          Inside the workshop
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
      <div className={styles.workshopPhoto}>
        <Image src={edge} alt="Close on a cabinet's corner: white panels, a birch-ply edge and two orange hooks" fill sizes="(max-width: 900px) 100vw, 55vw" placeholder="blur" />
      </div>
    </section>
  );
}
