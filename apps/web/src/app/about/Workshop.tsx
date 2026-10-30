import Image from "next/image";
import Link from "next/link";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import { routes } from "@/lib/routes";
import { WORKSHOP } from "./aboutCopy";
import styles from "./page.module.css";

/**
 * The workshop band: on the left the index, the headline, a line on why
 * owning the tools matters, the ruled schedule of what is in there and an
 * orange block to come and see it; on the right, a sideboard against a sage wall.
 */
export function Workshop() {
  return (
    <section className={styles.workshop} aria-labelledby="workshop-title">
      <div>
        <p className={styles.index}>
          <span>The workshop</span>
        </p>
        <h2 id="workshop-title" className={styles.heading}>
          We own the tools, so we can change our minds late.
        </h2>
        <p className={styles.lede}>When a panel needs recutting on a Thursday, it gets recut on Thursday.</p>
        <dl className={styles.schedule}>
          {WORKSHOP.map((row) => (
            <div key={row.label} className={styles.scheduleRow}>
              <dt className={styles.label}>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link href={routes.contact} className={styles.block}>
          Inside the workshop
        </Link>
      </div>
      <div className={styles.workshopPhoto}>
        <Image src={sageSideboard} alt="A sideboard against a sage wall" fill sizes="(max-width: 900px) 100vw, 40vw" placeholder="blur" />
      </div>
    </section>
  );
}
