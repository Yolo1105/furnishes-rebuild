import { productById } from "./catalogue";
import { ProductGrid } from "./ProductGrid";
import styles from "./PiecesFor.module.css";

/** The pieces a use page speaks of, under a heading, by their ids in the catalogue. */
export function PiecesFor({ title, ids }: { title: string; ids: readonly string[] }) {
  const products = ids.flatMap((id) => productById(id) ?? []);
  return (
    <section className={styles.pieces} aria-labelledby="pieces-title">
      <h2 id="pieces-title" className={styles.title}>
        {title}
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
