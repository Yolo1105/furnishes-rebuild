import type { Metadata } from "next";
import Image from "next/image";
import { ARRANGEMENTS, KIT_TIER, KITS, OTHER_USES, PART_MATERIALS, productById } from "@/features/products/catalogue";
import { isReal, shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Why modular",
  description: "Why Furnishes builds furniture from parts: what it gets you, the parts each piece takes, what they can become and what you can change.",
};

/** What building from parts gets you. */
const REASONS = [
  { title: "It fits where fixed sizes don't", body: "Standard parts in set heights and widths reach sizes a fixed product doesn't come in." },
  { title: "It can change its job", body: "The same frame takes another pack: an entry piece can become a desk-side piece." },
  { title: "It can grow", body: "Add a door, a drawer, a second segment or wheels later, not a whole new piece." },
  { title: "One part can be fixed", body: "Because parts are separate, a damaged one can often be looked at on its own." },
  { title: "It can come with you", body: "Many pieces come apart. We check the parts and the new spot with you when you move." },
  { title: "It's finished as it stands", body: "You never plan parts yourself. Every piece is complete, and worth buying even if it never changes." },
];

/** The pieces that take add-on parts, each with its parts. */
const PIECES = [...new Set(KITS.flatMap((k) => k.applies))].map((id) => ({
  id,
  name: productById(id)?.name ?? id,
  kits: KITS.filter((k) => k.applies.includes(id)),
}));

const USE_GROUPS = [
  { title: "Other jobs a piece can do", about: "A different set of parts on a piece we already make. Some still need testing, as marked.", items: OTHER_USES },
  { title: "Pieces standing together", about: "Ideas for arranging several pieces. They have no price of their own: you buy the pieces.", items: ARRANGEMENTS },
];

/** Starting from the furniture someone already has. */
const KEEP = [
  { title: "Add one piece", body: "Keep the desk, bed or shoe cabinet that works. Add what it lacks, right beside it." },
  { title: "Do a whole corner", body: "For a bigger change, arrange a whole area again. Buying more doesn't make it better." },
  { title: "Beside, not attached", body: "Our pieces stand on their own. A version clamps or connects only if its page says so." },
];

/** What a modular piece can change, what each costs and adds to the wait. */
const OPTIONS = [
  { label: "Built or flat-packed", body: "Flat-packed comes with its steps. Built arrives put together; large pieces may be finished at your home. Each piece shows both prices." },
  { label: "Size", body: `Height in steps of 40 cm up to 160 cm; width of 60, 120 or 180 cm. ${shown("customSizePrice")}, and ${shown("leadCustomExtra")}.` },
  { label: "Finish", body: `White matte faces and birch edges to start with. A special colour on request: ${shown("specialColourPrice")}.` },
  { label: "Add-ons", body: `Doors, drawers, a desk top, casters and other parts checked to fit, now or later. ${shown("addOnPrices")}.` },
  { label: "Installation", body: `We put it together in your home if you'd rather not: ${shown("installPrice")}.` },
];

/** What the parts are made of, and what they hold once that is tested. */
const MATERIALS = [
  ...PART_MATERIALS.map((m) => ({ label: m.material, body: m.parts })),
  ...(isReal("weightLimits") ? [{ label: "Weight limits", body: shown("weightLimits") }] : []),
];

/** Why modular: the reasons and parts, what else they can become, keeping what you own, what can change and the finish. */
export default function WhyModularPage() {
  return (
    <>
      <main id="main">
        <Section id="why">
          <SectionHead
            as="h1"
            id="why"
            eyebrow="Why modular"
            title="Why build furniture from parts?"
            lede="Our modular furniture is panels, a base and add-on parts that work together. Here is what that gets you, and what it doesn't."
          />
          <Steps numbered={false} steps={REASONS} />
          <p className="span-8 lede">
            Its limits: not every part fits every piece, so we check against the version you own. Some changes leave parts over. And if a standard size suits you, ready-made furniture is simpler.
          </p>
        </Section>

        <Section id="parts" tone="linen">
          <SectionHead id="parts" eyebrow="Add-on parts" title="The parts each piece can take." lede="Open a part to see what it adds and what it takes off." />
          <div className="span-12 subgrid">
            {PIECES.map((p) => (
              <div key={p.id} className="card span-4">
                <h3>{p.name}</h3>
                <ul>
                  {p.kits.map((k) => (
                    <li key={k.id}>
                      <details className={`disclosure ${styles.part}`}>
                        <summary>
                          <span>{k.name}</span>
                          <span className="mono">{KIT_TIER[k.tier].name}</span>
                        </summary>
                        <p>{k.line}</p>
                        <p className="meta">
                          Adds: {k.adds.join(", ")}.{k.removes.length > 0 ? ` Takes off: ${k.removes.join(", ")}.` : ""}
                        </p>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="uses">
          <SectionHead id="uses" eyebrow="What else it can become" title="The same parts, other answers." />
          {USE_GROUPS.map((g) => (
            <div key={g.title} className="span-12 subgrid">
              <div className="span-8">
                <h3>{g.title}</h3>
                <p className="meta">{g.about}</p>
              </div>
              <ul className="span-12 subgrid">
                {g.items.map((u) => (
                  <li key={u.id} className="card span-3 md:span-6">
                    <div className="media-square">
                      <Image src={u.image} alt="" fill placeholder="blur" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" />
                    </div>
                    <h4 className="card-title">{u.name}</h4>
                    <p className="meta">{u.line}</p>
                    {"state" in u && u.state === "testing" && <p className="mono">Needs testing first</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="keep" tone="linen">
          <SectionHead
            id="keep"
            eyebrow="What you already own"
            title="Keep what you already like."
            lede="Your table, bed, cabinets and collections are part of the home. Who uses the space, and how much you want to change, decide the answer."
          />
          <Steps numbered={false} steps={KEEP} />
        </Section>

        <Section id="customize">
          <SectionHead
            id="customize"
            eyebrow="Customizing"
            title="Complete as it is. Yours if you want."
            lede="No piece needs changing. These are the changes you can make on a modular piece, and what each costs. Ready-made furniture is sold as it is."
            action={
              <p>
                <Button variant="link" href={contactHref("custom")}>
                  Ask about a custom piece →
                </Button>
              </p>
            }
          />
          <FactGrid facts={OPTIONS} />
          <p className="span-8 meta">Anything outside these limits goes to our team for a review and a quote.</p>
          <h3 className="span-12">What it&apos;s made of</h3>
          <FactGrid facts={MATERIALS} />
        </Section>

        <Section id="finish" tone="linen">
          <SectionHead
            id="finish"
            eyebrow="Finishes"
            title="See the finish, then decide."
            lede="Pieces come with white matte faces and birch edges today. Ask to see samples before you decide."
            action={
              <div className="actions">
                <Button variant="primary" href={contactHref("product")}>
                  Ask for samples
                </Button>
                <Button variant="secondary" href={contactHref("visit")}>
                  Book a visit
                </Button>
              </div>
            }
          />
        </Section>

        <Section id="next" tone="dark">
          <SectionHead
            id="next"
            title="Start with one piece."
            lede="Every modular piece is complete as it stands. Change it only if it makes a real difference to you."
            action={
              <div className="actions">
                <Button variant="primary" href={`${routes.collection}#find`}>
                  See the modular furniture
                </Button>
                <Button variant="secondary" href={routes.howItWorks}>
                  How it works
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
