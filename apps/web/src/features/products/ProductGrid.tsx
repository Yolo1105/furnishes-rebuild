import type { Product } from "./catalogue";
import { ProductCard } from "./ProductCard";

/** Products as cards, three across on wide screens, one on narrower; the first row loads first when asked. */
export function ProductGrid({ products, priority = false }: { products: readonly Product[]; priority?: boolean }) {
  return (
    <ul className="span-12 subgrid">
      {products.map((p, i) => (
        <li key={p.id} className="span-4 md:span-6">
          <ProductCard product={p} priority={priority && i < 3} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" />
        </li>
      ))}
    </ul>
  );
}
