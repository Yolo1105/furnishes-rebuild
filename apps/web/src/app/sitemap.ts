import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { productHref } from "./products/productHref";

/** The pages people should find from a search; the sign-in and the unlinked drafts stay out. */
const PAGES = [
  routes.studio,
  routes.collection,
  routes.products,
  routes.inspiration,
  routes.quiz,
  routes.howItWorks,
  routes.whyModular,
  routes.buyingGuide,
  routes.help,
  routes.roomDividers,
  routes.hdbHomes,
  routes.workspaces,
  routes.about,
  routes.contact,
  routes.terms,
  routes.privacy,
  routes.refunds,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES, ...PRODUCTS.map((p) => productHref(p.id))].map((path) => ({ url: `${SITE_URL}${path}` }));
}
