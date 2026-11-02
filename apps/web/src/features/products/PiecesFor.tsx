import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { productById } from "./catalogue";
import { ProductGrid } from "./ProductGrid";

/** The pieces a use page speaks of, under a heading, by their ids in the catalogue. */
export function PiecesFor({ title, ids }: { title: string; ids: readonly string[] }) {
  const products = ids.flatMap((id) => productById(id) ?? []);
  return (
    <Section id="pieces">
      <SectionHead id="pieces" title={title} />
      <ProductGrid products={products} />
    </Section>
  );
}
