import Image from "next/image";
import { PHOTOS } from "./photos";
import styles from "./page.module.css";

/** Sharper than Next's default of 75; must be listed in next.config's `images.qualities`. */
const PHOTO_QUALITY = 90;

/** The landing: room photos, one screen each, numbered from 1. */
export default function Home() {
  return (
    <main className={styles.landing}>
      <h1 className="visually-hidden">Furnishes</h1>
      {PHOTOS.map(({ src, alt }, i) => (
        <section key={src.src} className={styles.slide} aria-label={`Photo ${i + 1}`}>
          <Image
            src={src}
            alt={alt}
            className={styles.photo}
            fill
            sizes="100vw"
            quality={PHOTO_QUALITY}
            priority={i === 0}
            placeholder="blur"
          />
          <span className={styles.number} aria-hidden="true">
            {i + 1}
          </span>
        </section>
      ))}
    </main>
  );
}
