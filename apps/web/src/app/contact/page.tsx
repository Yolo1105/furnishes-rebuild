import type { Metadata } from "next";
import { PRODUCTS } from "@/features/products/catalogue";
import { EMAIL, HOURS } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { READY_MADE_PIECE } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { isTopic } from "./enquiry";
import { Inquiry } from "./Inquiry";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask about a piece, a room, a home visit or an office quote. Send the form and we reply by email.",
};

/** The pieces an enquiry can name: each modular piece, then the ready-made line. */
const PIECES = [...PRODUCTS.map((p) => ({ id: p.id, name: p.name })), { id: READY_MADE_PIECE, name: "Ready-made furniture" }];

/**
 * Contact, on one screen: how to reach us on the left, the enquiry on the
 * right. A link from a piece picks the piece and what it is about
 * (lib/routes.ts contactHref).
 */
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { topic, piece } = await searchParams;
  const pickedTopic = isTopic(topic) ? topic : undefined;
  const pickedPiece = PIECES.find((p) => p.id === piece)?.id;
  const reply = shown("replyTime");
  const facts = [
    { label: "Email", body: EMAIL },
    { label: "Hours", body: HOURS.join(" ") },
    ...(reply ? [{ label: "Reply", body: `Within ${reply}.` }] : []),
  ];

  return (
    <>
      <main id="main">
        <Section id="contact">
          <div className="span-5">
            <SectionHead
              as="h1"
              id="contact"
              eyebrow="Contact"
              title="How can we help?"
              lede="A question about a piece, advice on a room, or a visit. Write to us here and we reply by email."
              className=""
            />
            <FactGrid facts={facts} span="span-12" />
          </div>
          <div className="span-6 start-7">
            <Inquiry key={`${pickedTopic}-${pickedPiece}`} topic={pickedTopic} piece={pickedPiece} pieces={PIECES} />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
