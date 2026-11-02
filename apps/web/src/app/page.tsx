import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bedsideRender from "@/assets/catalogue/scene/bedside.webp";
import dividerRender from "@/assets/catalogue/scene/divider.webp";
import deskRender from "@/assets/render-desk.webp";
import entryRender from "@/assets/render-entry.webp";
import bookwallRender from "@/assets/render-bookwall.webp";
import { PRODUCTS } from "@/features/products/catalogue";
import { ProductGrid } from "@/features/products/ProductGrid";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { MediaBand } from "@/shell/ui/MediaBand";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import { PlanMoment } from "./PlanMoment";
import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: { absolute: "Furnishes: furniture for Singapore homes and small offices" },
  description: "Ready-made and modular furniture for Singapore homes and small offices, made to order and sized to your room. Prices include GST and delivery.",
};

/** Where a visitor might start, each leading to the furniture narrowed to it. */
const STARTS: readonly { name: string; line: string; href: string; render: StaticImageData }[] = [
  { name: "By the door", line: "Coats and bags pile up on the chair.", href: `${routes.collection}?use=entryway#find`, render: entryRender },
  { name: "Beside the bed", line: "Phone and book on the floor.", href: `${routes.collection}?use=bedroom#find`, render: bedsideRender },
  { name: "At the desk", line: "Tools and cables take over, at home or in the office.", href: `${routes.collection}?use=work#find`, render: deskRender },
  { name: "In a shared room", line: "One room needs to do two jobs.", href: `${routes.collection}?use=dividing#find`, render: dividerRender },
];

/** The pieces that can be ordered today. */
const ORDERABLE = PRODUCTS.filter((p) => p.status === "launch");

/** What every order comes with, each from the facts. */
const PROMISES = [
  { label: "Delivery", body: `${shown("gstTerms")} Flat-packed, or built and set in place.` },
  { label: "Returns", body: shown("returnsTerms") },
  { label: "Warranty", body: shown("warranty") },
  { label: "Lead time", body: `Flat-packed in ${shown("leadFlatPack")}, built in ${shown("leadBuilt")}.` },
  { label: "Installation", body: `We can build it in your room for ${shown("installPrice")}. ${shown("assemblyDetails")}` },
  { label: "Help", body: `Write to ${EMAIL}. We reply within ${shown("replyTime")}, ${shown("supportHours")}.` },
];

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Furnishes Pte Ltd",
  url: SITE_URL,
  email: EMAIL,
  areaServed: "SG",
};

/** The landing: the hero, where it bothers you, what can be ordered now, the plan, what you get, help for the unsure, and a last call. */
export default function Home() {
  return (
    <>
      <main id="main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }} />

        <Section id="hero" className={styles.hero}>
          <div className={`span-6 ${styles.heroWords}`}>
            <h1 id="hero-title">
              Furniture cut to <strong>fit</strong> the way you live.
            </h1>
            <p className="lede">Ready-made, or sized to your room. Made to order, delivered built or flat-packed in Singapore, GST included.</p>
            <div className="actions">
              <Button variant="primary" href={routes.products}>
                See the furniture
              </Button>
              <Button variant="secondary" href={routes.designYourRoom}>
                Design your room
              </Button>
            </div>
          </div>
          <div className="span-5 start-8 media-portrait">
            <Image src={entryRender} alt="The entry piece by a front door, with hooks, a tray and a shoe shelf; a 3D render" fill priority placeholder="blur" sizes="(max-width: 1023px) 100vw, 40vw" />
          </div>
        </Section>

        <Section id="starts">
          <SectionHead id="starts" eyebrow="Where does it bother you?" title="Start from the spot that annoys you." />
          <ul className="span-12 subgrid">
            {STARTS.map((s) => (
              <li key={s.name} className="span-3 md:span-6">
                <div className="card">
                  <div className="media-square">
                    <Image src={s.render} alt="" fill placeholder="blur" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" />
                  </div>
                  <h3 className="card-title">
                    <Link href={s.href}>{s.name}</Link>
                  </h3>
                  <p className="meta">{s.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="available">
          <SectionHead
            id="available"
            eyebrow="Available now"
            title="Three pieces, made to your size."
            action={
              <p>
                <Button variant="link" href={routes.products}>
                  See all {PRODUCTS.length} designs →
                </Button>
              </p>
            }
          />
          <ProductGrid products={ORDERABLE} />
        </Section>

        <PlanMoment />

        <Section id="promises">
          <SectionHead id="promises" eyebrow="What you get" title="Made to order, delivered built, covered for a year." />
          <FactGrid facts={PROMISES} />
          <MediaBand src={bookwallRender} alt="" />
        </Section>

        <Section id="unsure">
          <SectionHead id="unsure" title="Not sure what you need?" />
          <Steps
            numbered={false}
            steps={[
              {
                title: "Answer a few questions",
                body: "Tell us where it bothers you and we suggest three pieces.",
                action: <Button variant="link" href={routes.quiz}>Take the quiz →</Button>,
              },
              {
                title: "See ideas for rooms like yours",
                body: "Plans of real HDB rooms, with the piece that fixed each one.",
                action: <Button variant="link" href={routes.inspiration}>See the ideas →</Button>,
              },
              {
                title: `Have us visit for ${shown("consultLength")}`,
                body: `We measure and suggest, ${shown("consultArea")}: ${shown("consultPrice")}.`,
                action: <Button variant="link" href={contactHref("visit")}>Book a visit →</Button>,
              },
            ]}
          />
        </Section>

        <Section id="start" tone="dark">
          <SectionHead
            id="start"
            title="Start with one piece."
            lede="Pick a ready-made piece, or a modular one sized to your room."
            action={
              <div className="actions">
                <Button variant="primary" href={routes.products}>
                  See the furniture
                </Button>
                <Button variant="secondary" href={routes.contact}>
                  Contact us
                </Button>
              </div>
            }
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
