import type { Metadata } from "next";
import { PRODUCTS, priceFrom } from "@/features/products/catalogue";
import { READY_MADE } from "@/features/products/readyMade";
import { shown } from "@/lib/facts";
import { contactHref, READY_MADE_PIECE, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Finder, readFinder } from "./Finder";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Products", description: "Every Furnishes piece, with its size, price and what can be changed." };

const orderable = PRODUCTS.filter((p) => p.status === "launch").length;
const following = PRODUCTS.length - orderable;

/** The three kinds of furniture we sell, side by side: what each is, what changes, how it comes, the wait and the price. */
const KINDS: readonly { name: string; line: string; rows: readonly { label: string; body: string }[]; link: { label: string; href: string } }[] = [
  {
    name: "Ready-made",
    line: "Finished chairs, desks, cabinets, tables and sofas from the same factory.",
    rows: [
      { label: "Who designs it", body: "The factory. It is sold as it is." },
      { label: "How it comes", body: "Delivered to you." },
      { label: "Wait", body: shown("leadReadyMade") },
      { label: "Price", body: `${READY_MADE[0]!.name} ${READY_MADE[0]!.range}.` },
    ],
    link: { label: "See ready-made", href: "#ready-made" },
  },
  {
    name: "Modular, designed by us",
    line: "A finished piece in birch panels, made for one job, such as an entryway or a bedside.",
    rows: [
      { label: "Who designs it", body: "We do. You pick it, and can make small changes." },
      { label: "How it comes", body: "Built, or flat-packed with its steps." },
      { label: "Wait", body: `${shown("leadFlatPack")} flat-packed, ${shown("leadBuilt")} built.` },
      { label: "Price", body: `Smallest piece ${priceFrom("bedside")}.` },
    ],
    link: { label: "See the designs", href: "#find" },
  },
  {
    name: "Modular, sized by you",
    line: "The same panels and parts, put together for your space when no design suits it.",
    rows: [
      { label: "Who designs it", body: "You do, within what has been checked to work. Anything beyond goes to our team." },
      { label: "How it comes", body: "Built, or flat-packed with the steps for your version." },
      { label: "Wait", body: `The same, plus ${shown("leadCustomExtra")} for a custom size.` },
      { label: "Price", body: `The piece, plus ${shown("customSizePrice")} for a custom size.` },
    ],
    link: { label: "Design your room", href: routes.designYourRoom },
  },
];

/**
 * The products: the head and the pieces by room (those you can order first,
 * then those in production), the three kinds of furniture we sell side by
 * side, the ready-made line, and a way to start from the room instead.
 */
export default async function Products({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const state = readFinder(await searchParams, routes.products);

  return (
    <>
      <main id="main" data-page="products">
        <Section id="find">
          <SectionHead
            id="find"
            as="h1"
            eyebrow="Products"
            title="The pieces."
            lede={`${PRODUCTS.length} modular designs in birch plywood: ${orderable} you can order now, ${following} in production. Ready-made furniture too.`}
            action={
              <p>
                <Button variant="link" href={`${routes.collection}#find`}>
                  Search the collection →
                </Button>
              </p>
            }
          />
          <Finder state={state} search={false} priority />
        </Section>

        <Section id="kinds" tone="linen">
          <SectionHead
            id="kinds"
            eyebrow="What we sell"
            title="Three kinds of furniture, and why."
            lede="Modular means built from panels and parts that work together. Not everyone needs that, so we sell usual furniture too."
          />
          <ul className="span-12 subgrid">
            {KINDS.map((k) => (
              <li key={k.name} className={`card span-4 ${styles.kind}`}>
                <h3>{k.name}</h3>
                <p className="meta">{k.line}</p>
                <dl className={styles.rows}>
                  {k.rows.map((r) => (
                    <div key={r.label}>
                      <dt className="eyebrow">{r.label}</dt>
                      <dd>{r.body}</dd>
                    </div>
                  ))}
                </dl>
                <p>
                  <Button variant="link" href={k.link.href}>
                    {k.link.label} →
                  </Button>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="ready-made">
          <SectionHead
            id="ready-made"
            eyebrow="Ready-made"
            title="Ready-made furniture."
            lede={`Finished furniture from the same factory, sold as it is, for a home or a whole office. It takes ${shown("leadReadyMade")}.`}
          />
          <ul className="span-12 subgrid">
            {READY_MADE.map((r) => (
              <li key={r.name} className="card span-4 md:span-6">
                <h3 className="card-title">{r.name}</h3>
                <p className="meta">{r.line}</p>
                {r.range && <p className="mono">{r.range}</p>}
              </li>
            ))}
          </ul>
          <div className="span-12 actions">
            <Button variant="secondary" href={contactHref("product", READY_MADE_PIECE)}>
              Ask about ready-made furniture
            </Button>
            <p className="meta">{shown("readyMadeList")}</p>
          </div>
        </Section>

        <Section id="start">
          <SectionHead
            id="start"
            title="Start from your room instead."
            lede="Draw your room, and see which pieces fit it before you choose."
            action={
              <p>
                <Button variant="link" href={routes.designYourRoom}>
                  Design your room →
                </Button>
              </p>
            }
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
