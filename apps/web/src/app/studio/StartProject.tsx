import Image from "next/image";
import Link from "next/link";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import { routes } from "@/lib/routes";
import styles from "./StartProject.module.css";

/** The sheet's title block: what it is, how soon we answer, where the studio is. */
const TITLE_BLOCK: readonly { label: string; value: string }[] = [
  { label: "Reply", value: "Inside one business day" },
  { label: "Studio", value: "Singapore" },
];

/**
 * The last word before the footer, as the last sheet of a drawing set: the
 * A-frame room across the screen under a dark wash, a frame ruled over it,
 * the next step on the left (its index, the headline, a line and two calls)
 * and the title block down the right.
 */
export function StartProject() {
  return (
    <section className={styles.band} aria-labelledby="start-title">
      <Image className={styles.photo} src={aFrameLivingRoom} alt="" fill sizes="100vw" placeholder="blur" />
      <div className={styles.sheet}>
        <div className={`${styles.main} reveal`}>
          <p className={styles.index}>
            <span>A-900</span>
            <span>Next step</span>
          </p>
          <h2 id="start-title" className={styles.title}>
            Start with one 90-minute visit.
          </h2>
          <p className={styles.lede}>You get a written summary three days later, whether you hire us or not.</p>
          <div className={styles.calls}>
            <Link href={routes.contact} className={`${styles.button} ${styles.primary}`}>
              Book a consult
              <span aria-hidden="true">→</span>
            </Link>
            <Link href={routes.contact} className={styles.button}>
              Start a project
            </Link>
          </div>
        </div>
        <aside className={`${styles.block} reveal`} aria-label="Sheet">
          <div className={styles.cell}>
            <p className={styles.label}>Sheet</p>
            <p className={styles.sheetNo}>A-900</p>
            <p className={styles.small}>Last sheet of the set</p>
          </div>
          {TITLE_BLOCK.map((b) => (
            <div key={b.label} className={styles.cell}>
              <p className={styles.label}>{b.label}</p>
              <p className={styles.value}>{b.value}</p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
