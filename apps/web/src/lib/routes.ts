/** Every address the site links to, in one place. */
export const routes = {
  home: "/",
  collection: "/collection",
  products: "/products",
  inspiration: "/inspiration",
  quiz: "/quiz",
  howItWorks: "/how-it-works",
  help: "/help",
  roomDividers: "/room-dividers",
  hdbHomes: "/hdb-homes",
  workspaces: "/workspaces",
  about: "/about",
  contact: "/contact",
  studio: "/studio",
  designYourRoom: "/studio#design-your-room",
  signIn: "/sign-in",
  terms: "/terms",
  privacy: "/privacy-policy",
  refunds: "/refund-policy",
} as const;

/** What an enquiry can be about: the contact form picks it for the visitor. */
export type ContactTopic = "product" | "room" | "visit" | "office" | "custom" | "order";

/** The contact form's `piece` for the ready-made line, which has no piece of its own. */
export const READY_MADE_PIECE = "ready-made";

/** The contact form, with its topic picked and, when asked from a piece, that piece named. */
export function contactHref(topic: ContactTopic, piece?: string): string {
  const query = new URLSearchParams({ topic, ...(piece ? { piece } : {}) });
  return `${routes.contact}?${query}`;
}
