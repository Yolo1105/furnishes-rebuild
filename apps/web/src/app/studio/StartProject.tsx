import Image from "next/image";
import Link from "next/link";
import aFrameLivingRoom from "@/assets/a-frame-living-room.jpg";
import { routes } from "@/lib/routes";
import styles from "./StartProject.module.css";

/**
 * The last word before the footer: the A-frame room across the screen
 * under a dark wash at its foot, the question in the display serif at the
 * bottom left and a dark pill to start a project at the bottom right.
 */
export function StartProject() {
  return (
    <section className={styles.band} aria-labelledby="start-title">
      <Image className={styles.photo} src={aFrameLivingRoom} alt="" fill sizes="100vw" placeholder="blur" />
      <h2 id="start-title" className={`${styles.title} reveal`}>
        Have a site, or a room?
      </h2>
      <Link href={routes.contact} className={`${styles.button} reveal`}>
        Start a project
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
