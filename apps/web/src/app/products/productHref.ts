import { productById } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";

/** A catalogue product's page; none for an id the catalogue does not hold. */
export const productHref = (id: string) => (productById(id) ? `${routes.products}/${id}` : undefined);
