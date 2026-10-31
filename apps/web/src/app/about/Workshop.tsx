import Image from "next/image";
import Link from "next/link";
import sageSideboard from "@/assets/sage-sideboard.jpg";
import { routes } from "@/lib/routes";
import { WORKSHOP } from "./aboutCopy";
import styles from "./page.module.css";

/**
 * How it is made: on the left the index, the headline, a line, the ruled
 * schedule of the facts and an orange block to ask more; on the right, a mood photo.
 */
export function Workshop() {
  return (
    <section className={styles.workshop} aria-labelledby="workshop-title">
      <div>
        <p className={styles.index}>
          <span>How it is made</span>
        </p>
        <h2 id="workshop-title" className={styles.heading}>
          Made by our partner factory in China.
        </h2>
        <p className={styles.lede}>We choose the designs and the materials. The factory makes them and ships them to Singapore.</p>
        <dl className={styles.schedule}>
          {WORKSHOP.map((row) => (
            <div key={row.label} className={styles.scheduleRow}>
              <dt className={styles.label}>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link href={routes.contact} className={styles.block}>
          Ask how it is made
        </Link>
      </div>
      <div className={styles.workshopPhoto}>
        <Image src={sageSideboard} alt="A mood photo of a sideboard against a sage wall, not a Furnishes piece" fill sizes="(max-width: 900px) 100vw, 40vw" placeholder="blur" />
      </div>
    </section>
  );
}
