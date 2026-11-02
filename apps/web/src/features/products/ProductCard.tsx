import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { priceFrom, type Product } from "./catalogue";

/** The widths a card takes at each grid width, as a `.span-4` cell. */
export const CARD_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 33vw";

/**
 * A product, as the site's one card: its render at 4:5, its record number and
 * price on one row, its name and one line. The whole card is the link.
 */
export function ProductCard({ product: p, sizes = CARD_SIZES, priority = false }: { product: Product; sizes?: string; priority?: boolean }) {
  return (
    <article className="card">
      <div className="card-media">
        <Image src={p.studio} alt={`${p.name}, a 3D render`} fill sizes={sizes} placeholder="blur" priority={priority} />
      </div>
      <p className="card-row">
        <span className="mono">{p.record}</span>
        <span className="price">{priceFrom(p.id)}</span>
      </p>
      <h3 className="card-title">
        <Link href={`${routes.products}/${p.id}`}>{p.name}</Link>
      </h3>
      <p className="meta">{p.line}</p>
    </article>
  );
}
