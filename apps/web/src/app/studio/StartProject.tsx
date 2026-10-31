import Image from "next/image";
import Link from "next/link";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import styles from "./StartProject.module.css";

/**
 * The last word before the footer: the A-frame room across the screen under
 * a dark wash, the next step on the left (its label, the headline, a line
 * and two calls).
 */
export function StartProject() {
  return (
    <section className={styles.band} aria-labelledby="start-title">
      <Image className={styles.photo} src={aFrameLivingRoom} alt="" fill sizes="100vw" placeholder="blur" />
      <div className={styles.sheet}>
        <div className={`${styles.main} reveal`}>
          <p className={styles.index}>
            <span>Next step</span>
          </p>
          <h2 id="start-title" className={styles.title}>
            Not sure? Start with a visit to your room.
          </h2>
          <p className={styles.lede}>{`We come to you for ${shown("consultLength")} and answer any questions. It costs ${shown("consultPrice")}.`}</p>
          <div className={styles.calls}>
            <Link href={contactHref("visit")} className={`${styles.button} ${styles.primary}`}>
              Book a consultation
            </Link>
            <Link href={routes.collection} className={styles.button}>
              See the furniture
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
