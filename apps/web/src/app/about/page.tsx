import type { Metadata } from "next";
import sofaBackRender from "@/assets/render-sofa-back.webp";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { MediaBand } from "@/shell/ui/MediaBand";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import { MAKING_LINE, MAKING_STEPS, PARTNERS, RECOGNITION, STORY, TEAM, WHO_COLUMNS, WHO_TAGLINE, WORKSHOP } from "./aboutCopy";

export const metadata: Metadata = { title: "About", description: "Who Furnishes is and how we make furniture for Singapore homes and small offices." };

/** About: who we are, how it is made, our story, from order to door, the team, working with us, then a visit. */
export default function About() {
  return (
    <>
      <main id="main">
        <Section id="about">
          <SectionHead
            as="h1"
            id="about"
            eyebrow="About"
            title={
              <>
                Furniture that fits how you <strong>live</strong> and work.
              </>
            }
            lede={WHO_TAGLINE}
          />
          <MediaBand src={sofaBackRender} alt="A Furnishes shelf standing behind a sofa; a 3D render" priority />
          {WHO_COLUMNS.map((c) => (
            <div key={c} className="span-4">
              <p>{c}</p>
            </div>
          ))}
        </Section>

        <Section id="workshop" tone="linen">
          <SectionHead
            id="workshop"
            eyebrow="How it is made"
            title="Made by our partner factory in China."
            lede="We choose the designs and the materials. The factory makes them and ships them to Singapore."
            action={
              <p>
                <Button variant="link" href={routes.contact}>
                  Ask how it is made →
                </Button>
              </p>
            }
          />
          <FactGrid facts={WORKSHOP} />
        </Section>

        <Section id="story">
          <SectionHead id="story" eyebrow="Our story" title="Why we started, and where we are going." />
          <Steps steps={STORY} />
        </Section>

        <Section id="making">
          <SectionHead id="making" eyebrow="Your order" title="From order to your home." lede={MAKING_LINE} />
          <Steps steps={MAKING_STEPS} />
        </Section>

        {TEAM.length > 0 && (
          <Section id="team" tone="linen">
            <SectionHead id="team" eyebrow="Team" title="Who is behind Furnishes." lede="The people you are buying from." />
            <ul className="span-12 subgrid">
              {TEAM.map((m) => (
                <li key={m.name} className="card span-4">
                  <p className="eyebrow">{m.role}</p>
                  <h3>{m.name}</h3>
                  <p>{m.about}</p>
                  <p className="meta">Based in Singapore</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {RECOGNITION && (
          <Section id="recognition">
            <SectionHead id="recognition" eyebrow="Recognition" title="Recognised for our work." />
            <FactGrid facts={[{ label: "Award", body: RECOGNITION }]} />
          </Section>
        )}

        <Section id="work-with-us">
          <SectionHead
            id="work-with-us"
            eyebrow="Work with us"
            title="Show it, recommend it, or sell it."
            lede="We're starting small, and talk through each arrangement one by one."
            action={
              <p>
                <Button variant="link" href={routes.contact}>
                  Talk to us →
                </Button>
              </p>
            }
          />
          <Steps numbered={false} steps={PARTNERS} />
        </Section>

        <Section id="start" tone="dark">
          <SectionHead
            id="start"
            eyebrow="Next step"
            title="Not sure? Start with a visit to your room."
            lede={`We come to you for ${shown("consultLength")} and answer any questions. It costs ${shown("consultPrice")}.`}
            action={
              <div className="actions">
                <Button variant="primary" href={contactHref("visit")}>
                  Book a consultation
                </Button>
                <Button variant="secondary" href={routes.products}>
                  See the furniture
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
