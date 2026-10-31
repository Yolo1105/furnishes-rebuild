import type { Metadata } from "next";
import { PiecesFor } from "@/features/products/PiecesFor";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Workspaces and startups", description: "Furniture for startup and small offices in Singapore, with quotes for several pieces." };

/** Workspaces and startups: layouts that change with a team, call corners with their limits, and how to get a quote. */
export default function Workspaces() {
  return (
    <TextPage
      label="Workspaces and startups"
      title="An office that can change when your team does."
      lede="Desks, storage and dividers you can move or add to, along with ready-made office chairs and desks."
      sections={[
        {
          heading: "Layouts that can change",
          body: [
            "Start with what your team needs now. Add a piece when someone joins, move a screen when a project changes, and use carts for what moves between desks.",
          ],
        },
        {
          heading: "Corners for calls",
          body: [
            "Segments and a curtain can make a corner that feels separate for a call. It gives you privacy from view, not from sound. It isn't soundproof, so people nearby may still hear you.",
          ],
        },
        {
          heading: "Ready-made furniture",
          body: ["Office chairs, desks and storage are also sold ready-made, for when a standard size is all you need."],
          link: { label: "See ready-made furniture", href: `${routes.products}#ready-made` },
        },
        {
          heading: "Bulk orders and invoices",
          body: [`Tell us your team size, your space and when you need it, and we'll send a quote by email. ${shown("officeTerms")}`],
          link: { label: "Ask for a quote", href: contactHref("office") },
        },
      ]}
      calls={[
        { label: "See work pieces", href: `${routes.collection}?use=work#find` },
        { label: "Book a visit", href: contactHref("visit") },
      ]}
    >
      <PiecesFor title="Pieces for a workspace" ids={["desk", "work-cart", "device-cabinet", "mobile-screen", "divider", "low-cabinet"]} />
    </TextPage>
  );
}
