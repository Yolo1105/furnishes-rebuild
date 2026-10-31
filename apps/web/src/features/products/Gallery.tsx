import Image from "next/image";
import type { Product } from "./catalogue";
import styles from "./Gallery.module.css";

/** A piece's renders: in its room, then on its own. */
export function Gallery({ product: p }: { product: Product }) {
  return (
    <div className={styles.stack}>
      <div className={styles.gallery}>
        <Image className={styles.room} src={p.room} alt={`${p.name} in a room, a 3D render`} fill sizes="(max-width: 900px) 100vw, 58vw" placeholder="blur" priority />
      </div>
      <div className={styles.gallery}>
        <Image className={styles.room} src={p.studio} alt={`${p.name} on its own, a 3D render`} fill sizes="(max-width: 900px) 100vw, 58vw" placeholder="blur" />
      </div>
    </div>
  );
}
