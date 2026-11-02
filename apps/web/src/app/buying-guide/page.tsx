import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { isReal, shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";

export const metadata: Metadata = {
  title: "Buying guide",
  description: "What to measure, what an order holds, delivery, returns and warranty, building it yourself, and life once it's home.",
};

const MEASURE = [
  { title: "Where it will stand", body: "The width, depth and height of the spot, above any skirting board. Note switches, sockets and windows." },
  { title: "How it gets there", body: "The lift, stairs, doors and corners on the way in. A room can fit a piece that can't reach it." },
  { title: "Room to use it", body: "Space to build it, open its doors and drawers, pull out a chair and walk past." },
];

const INCLUDED = ["The piece in the version you chose", "Its supports and fixings", "The add-ons you picked", "Delivery in Singapore and GST"];
const NOT_INCLUDED = ["Lamps, books, plants and other objects in the pictures", "Desks, chairs and rooms shown around a piece", "Moving your own furniture, or work on your walls", "Installation, unless you add it"];

/** The things to know before buying. */
const BASICS = [
  { label: "Delivery", body: `${shown("gstTerms")} Every piece is made to order; custom sizes take ${shown("leadCustomExtra")}.` },
  { label: "Returns", body: `${shown("returnsTerms")} Custom pieces only for faults, damage or a wrong item.` },
  { label: "Warranty", body: shown("warranty") },
  { label: "Paying", body: `Each piece shows its price before you pay. ${shown("paymentMethods")}` },
  { label: "Assembly", body: `${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.` },
  { label: "Fixing and moving", body: "Taller pieces may need fixing to the wall. Pieces on wheels can move, within limits we confirm for each one." },
  { label: "Offices and bulk orders", body: shown("officeTerms") },
  { label: "Where it's made", body: "By our partner factory in China, then delivered to you in Singapore." },
  { label: "Help", body: `By email at ${EMAIL}, ${shown("supportHours")}, with a reply within ${shown("replyTime")}. No phone or live chat.` },
];

/** Building a flat-packed piece, in order. */
const BUILD = [
  { title: "Before you open the boxes", body: "Check how many boxes came. Clear floor to lay out the parts and stand the piece up." },
  { title: "Find your parts", body: "Follow the steps for your version, in order, starting with the base so it stands steady." },
  { title: "Heavy parts", body: "Get a second person for tall or heavy parts. Never leave one standing unsupported." },
  { title: "When it's finished", body: "Check the fixings, doors, drawers and wheel locks. Then read its limits before you load it." },
  { title: "If something's wrong", body: "Stop. Don't force a part or widen a hole. Send us your order number and a photo." },
  { title: "If you'd rather not", body: `Choose it already built, or add installation for ${shown("installPrice")}.` },
];

/** What happens once the furniture is home. */
const AFTER = [
  { label: "When it arrives", body: "Check the boxes and parts. If something is damaged or missing, send us your order number and photos before going further." },
  { label: "Using it", body: "Hooks aren't for climbing, and tops aren't seats unless a piece says so. Clear a piece and its path before rolling it." },
  { label: "Cleaning", body: shown("careGuide") },
  ...(isReal("weightLimits") && isReal("stability") ? [{ label: "Weight and tipping", body: `${shown("weightLimits")} ${shown("stability")}` }] : []),
  { label: "Adding to it", body: "We check your order, then tell you what stays, what's new and what comes off, before you pay." },
  { label: "If a part breaks", body: `Send a photo with your order number, and we check whether that part can be replaced alone. ${shown("replacementParts")}` },
  { label: "Moving home", body: "How a piece comes apart depends on the piece. We check its parts and the new spot with you." },
  { label: "Buying back", body: "Buy-back, recycling and trade-in aren't part of a purchase for now. If that changes, the piece's page will say so." },
  { label: "Who to ask", body: `Email ${EMAIL} with your order number or a photo. You don't need to know any part names.` },
];

/** The buying guide: what to measure and what an order holds, the basics, building it, and life once it's home. */
export default function BuyingGuide() {
  return (
    <>
      <main id="main">
        <Section id="measure">
          <SectionHead
            as="h1"
            id="measure"
            eyebrow="Buying guide"
            title="Measure three things before you order."
            lede="A photo of your room helps compare ideas, but it can't confirm a fit. Tight spots and bigger pieces may need more checking first."
          />
          <Steps steps={MEASURE} />
          <div className="card span-6">
            <h3>In your order</h3>
            <ul className="ruled">
              {INCLUDED.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className="card span-6">
            <h3>Not in your order</h3>
            <ul className="ruled">
              {NOT_INCLUDED.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="basics" tone="linen">
          <SectionHead
            id="basics"
            eyebrow="The basics"
            title="Delivery, returns and the rest."
            action={
              <p>
                <Button variant="link" href={routes.refunds}>
                  Refund policy →
                </Button>
              </p>
            }
          />
          <FactGrid facts={BASICS} />
        </Section>

        <Section id="build">
          <SectionHead id="build" eyebrow="Building it yourself" title="If it comes flat-packed." lede={shown("assemblyDetails")} />
          <Steps steps={BUILD} />
        </Section>

        <Section id="after" tone="linen">
          <SectionHead
            id="after"
            eyebrow="After you buy"
            title="When life changes, it can too."
            lede="A piece should be worth buying even if it never changes. Adding to it later is a bonus, and not every part fits every piece."
          />
          <FactGrid facts={AFTER} />
        </Section>

        <Section id="next" tone="dark">
          <SectionHead
            id="next"
            title="Still have a question?"
            lede={`Write to us and we reply within ${shown("replyTime")}. Most answers are already on the help page.`}
            action={
              <div className="actions">
                <Button variant="primary" href={routes.contact}>
                  Ask a question
                </Button>
                <Button variant="secondary" href={routes.help}>
                  See all questions
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
