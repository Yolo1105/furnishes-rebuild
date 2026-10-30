import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { CLAIMS, type Product, STATUS, sizeLabel } from "./catalogue";
import styles from "./ProductCard.module.css";

/**
 * A product: its render in its room, its record number and status, its name
 * and one line, then its size and price over a rule. The whole card is the
 * link; on hover the name turns orange and the room comes a little closer.
 */
export function ProductCard({ product: p, sizes }: { product: Product; sizes: string }) {
  return (
    <article className={styles.card}>
      <div className={styles.stage}>
        <Image className={styles.photo} src={p.room} alt="" fill sizes={sizes} placeholder="blur" />
      </div>
      <p className={styles.record}>
        <span>No. {p.record}</span>
        <span className={styles.status} data-status={p.status}>
          {STATUS[p.status].name}
        </span>
      </p>
      <h3 className={styles.name}>
        <Link href={`${routes.products}/${p.id}`} className={styles.link}>
          {p.name}
        </Link>
      </h3>
      <p className={styles.line}>{p.line}</p>
      <p className={styles.meta}>
        <span>{sizeLabel(p.size)}</span>
        <span>{CLAIMS.price.label}</span>
      </p>
    </article>
  );
}
