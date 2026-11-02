import { productById } from "./catalogue";
import { ProductGrid } from "./ProductGrid";

/** The pieces a use page speaks of, under a heading, by their ids in the catalogue; a block inside a TextPage's grid. */
export function PiecesFor({ title, ids }: { title: string; ids: readonly string[] }) {
  const products = ids.flatMap((id) => productById(id) ?? []);
  return (
    <section aria-labelledby="pieces-title" className="span-12 subgrid card">
      <h2 id="pieces-title" className="span-12 h2-sm">
        {title}
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
