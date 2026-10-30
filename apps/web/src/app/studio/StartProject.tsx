import Image from "next/image";
import Link from "next/link";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import { routes } from "@/lib/routes";
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
            Start with one 90-minute visit.
          </h2>
          <p className={styles.lede}>You get a written summary three days later, whether you hire us or not.</p>
          <div className={styles.calls}>
            <Link href={routes.contact} className={`${styles.button} ${styles.primary}`}>
              Book a consult
            </Link>
            <Link href={routes.contact} className={styles.button}>
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
