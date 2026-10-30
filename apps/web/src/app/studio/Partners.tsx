import Image from "next/image";
import { MAKERS } from "./makerList";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./Partners.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The makers and collaborators, after the packages: the index, headline and
 * two lines on the left, a grid of cards on the right, each with its mark at
 * the top (a logo once there is one, else its trade) and its name at the
 * foot. Pointing at one brings a room's photo up behind it, under a warm
 * wash, and its words turn cream; a card with an address links out.
 */
export function Partners() {
  return (
    <section className={styles.partners} aria-labelledby="partners-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>A-600</span>
          <span>Makers</span>
        </p>
        <h2 id="partners-title" className={styles.title}>
          Makers &amp; collaborators
        </h2>
        <p className={styles.lede}>
          We work alongside workshops, mills and suppliers we know by name, so what is drawn is what gets made.
        </p>
        <p className={styles.lede}>Each one is chosen for the work, not the catalogue.</p>
      </header>
      <ul className={styles.grid}>
        {MAKERS.map((m, i) => {
          const photo = ROOM_PHOTOS.find((p) => p.room === m.room);
          const inner = (
            <>
              {photo && (
                <Image className={styles.photo} src={photo.src} alt="" fill sizes="(max-width: 700px) 50vw, 15vw" placeholder="blur" />
              )}
              {m.logo ? (
                <Image className={styles.logo} src={m.logo} alt="" />
              ) : (
                <span className={styles.mark} aria-hidden="true">
                  <span className={styles.code}>M-{pad(i + 1)}</span>
                  {m.trade}
                </span>
              )}
              <span className={styles.name}>{m.name}</span>
            </>
          );
          return (
            <li key={m.name} className="reveal">
              {m.href ? (
                <a className={styles.card} href={m.href} target="_blank" rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div className={styles.card}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
