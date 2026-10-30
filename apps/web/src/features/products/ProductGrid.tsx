import type { Product } from "./catalogue";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

/** The cards' widths at each grid width, as ProductGrid.module.css sets its columns. */
const SIZES = "(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 33vw";

/** Products as cards, three across on wide screens, two on narrower, one on phones; each rising in as it scrolls on. */
export function ProductGrid({ products }: { products: readonly Product[] }) {
  return (
    <ul className={styles.grid}>
      {products.map((p) => (
        <li key={p.id} className={`${styles.cell} reveal`}>
          <ProductCard product={p} sizes={SIZES} />
        </li>
      ))}
    </ul>
  );
}
