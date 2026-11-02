import type { Metadata } from "next";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";

export const metadata: Metadata = {
  title: "How it works",
  description: "Buy Furnishes furniture ready-made or adjusted to fit, from choosing a piece to delivery in Singapore, and how long it takes.",
};

/** From choosing to your door. */
const STEPS = [
  { title: "Choose", body: "A ready-made piece, or a modular one that suits your space." },
  { title: "Adjust, if you want", body: "On a modular piece, change the size, finish and add-ons, and choose built or flat-packed." },
  { title: "Order", body: "Enquire to order. We confirm the version, the price and the date by email before you pay." },
  { title: "Receive it", body: `Made to order, shipped to Singapore and delivered to you. ${shown("gstTerms")}` },
];

/** The three kinds of furniture sold. */
const KINDS = [
  { title: "Ready-made", body: `Office, storage, dining and living pieces, sold as they are. ${shown("readyMadeList")}` },
  { title: "Modular, already designed", body: "18 mm birch plywood on one grid, designed for one job and complete as it stands." },
  { title: "Modular, composed by you", body: "The same panels and parts, in the size, colour and add-ons you choose. We check it and quote." },
];

/** How long pieces take, from order to arrival in Singapore. */
const LEAD_TIMES = [
  { label: "Modular, flat-packed", body: shown("leadFlatPack") },
  { label: "Modular, built", body: shown("leadBuilt") },
  { label: "Ready-made furniture", body: shown("leadReadyMade") },
  { label: "Add-ons", body: shown("leadAddOns") },
  { label: "Custom sizes", body: shown("leadCustomExtra") },
  { label: "Installation", body: `Built pieces arrive put together; large ones may be finished at your home. Installation costs ${shown("installPrice")}.` },
];

/** How buying works: the steps, the three kinds of furniture, and how long it takes. */
export default function HowItWorks() {
  return (
    <>
      <main id="main">
        <Section id="steps">
          <SectionHead
            as="h1"
            id="steps"
            eyebrow="How it works"
            title="From choosing to your door."
            lede="Furniture for Singapore homes and small offices, made to order by our partner factory in China and delivered to you."
          />
          <Steps steps={STEPS} span="span-3 md:span-6" />
        </Section>

        <Section id="kinds" tone="linen">
          <SectionHead
            id="kinds"
            eyebrow="What we sell"
            title="Ready-made, already designed, or composed by you."
            lede="Pick by how well a standard size suits your space. Both modular kinds arrive built, or flat-packed for you to build yourself."
            action={
              <p>
                <Button variant="link" href={routes.whyModular}>
                  Why modular →
                </Button>
              </p>
            }
          />
          <Steps numbered={false} steps={KINDS} />
        </Section>

        <Section id="lead">
          <SectionHead
            id="lead"
            eyebrow="Lead times"
            title="How long it takes."
            lede="Every piece is made to order, so there is a wait: from the day you order to the day it reaches you. Your order confirms the time."
            action={
              <p>
                <Button variant="link" href={contactHref("product")}>
                  Ask about a piece →
                </Button>
              </p>
            }
          />
          <FactGrid facts={LEAD_TIMES} />
        </Section>

        <Section id="next" tone="dark">
          <SectionHead
            id="next"
            title="Find your piece."
            lede="Measuring, what an order holds, building it and life after buying are all in the buying guide."
            action={
              <div className="actions">
                <Button variant="primary" href={routes.collection}>
                  See the furniture
                </Button>
                <Button variant="secondary" href={routes.buyingGuide}>
                  Read the buying guide
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
