import Image from "next/image";
import type { Product } from "./catalogue";
import styles from "./Gallery.module.css";

/** A piece's room photograph. */
export function Gallery({ product: p }: { product: Product }) {
  return (
    <div className={styles.gallery}>
      <Image className={styles.room} src={p.room} alt="" fill sizes="(max-width: 900px) 100vw, 58vw" placeholder="blur" priority />
    </div>
  );
}
