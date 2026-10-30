import Image from "next/image";
import Link from "next/link";
import workshop from "@/assets/workshop.jpg";
import { routes } from "@/lib/routes";
import { WORKSHOP } from "./workshopList";
import styles from "./Workshop.module.css";

/**
 * The workshop: its photo across the band, and over its left a pale card with
 * the headline, a line on why owning the tools matters, the ruled schedule of
 * what is in there (workshopList.ts) and an orange block to come and see it.
 */
export function Workshop() {
  return (
    <section className={styles.band} aria-labelledby="workshop-title">
      <Image className={styles.photo} src={workshop} alt="The workshop: a CNC router cutting a birch panel, shelves of cut parts beside it" fill sizes="100vw" placeholder="blur" />
      <div className={styles.card}>
        <h2 id="workshop-title" className={styles.title}>
          We own the tools, so we can change our minds late.
        </h2>
        <p className={styles.lede}>When a panel needs recutting on a Thursday, it gets recut on Thursday.</p>
        <dl className={styles.list}>
          {WORKSHOP.map((row) => (
            <div key={row.label} className={styles.row}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <Link href={routes.contact} className={styles.button}>
          Inside the workshop
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
