import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KIT_TIER, type KitTier, KITS, OTHER_USE_STATE, OTHER_USES, PART_MATERIALS, PRODUCTS, productName } from "@/features/products/catalogue";
import { ProductGrid } from "@/features/products/ProductGrid";
import { isReal } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import { Finder, readFinder } from "../products/Finder";
import { productHref } from "../products/productHref";
import {
  ASSURANCES,
  ASSURANCES_HEAD,
  CLOSING,
  CONSULT,
  DISCOVER,
  FIND_HEAD,
  GUIDES,
  HERO,
  HERO_RENDER,
  IN_ROOM_PIECES,
  IN_ROOMS,
  KITS_HEAD,
  MADE_WITH,
  NEWS,
  NOTES_HEAD,
  OTHER_USES_HEAD,
  QUESTIONS,
  QUESTIONS_HEAD,
  READY_BAND,
  ROOM_TILES,
  ROOMS_HEAD,
  STEPS,
  STEPS_HEAD,
} from "./collectionCopy";
import { MarkedRender } from "./MarkedRender";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Collection", description: "Browse Furnishes furniture by room, use and budget, in ready-made and modular lines." };

const launch = PRODUCTS.filter((p) => p.status === "launch");

/** A piece's notes, less any that rest on the weight limits until those are tested. */
const notesOf = (notes: readonly string[]) => notes.filter((n) => isReal("weightLimits") || !/weight limit/i.test(n));

/**
 * The collection: the head beside a render of our desk-side piece with its
 * parts marked; the rooms; the pieces you can order now; the ready-made line;
 * a consultation; what the pieces are made of; pieces in their rooms; what to
 * know; find your piece (room chips, search, the pieces); what is open on
 * each piece; their other uses; the add-on kits; how the catalogue works;
 * what holds for every piece; and a last call. Then the footer.
 */
export default async function Collection({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const state = readFinder(await searchParams, routes.collection);

  return (
    <>
      <main id="main" data-page="collection">
        <Section id="hero">
          <SectionHead
            id="hero"
            as="h1"
            eyebrow={HERO.eyebrow}
            title={HERO.title}
            lede={HERO.lede}
            className="span-5"
            action={
              <div className="actions">
                <Button variant="primary" href="#find">
                  {HERO.call}
                </Button>
                <Button variant="link" href={`${routes.products}#ready-made`}>
                  {HERO.readyMade}
                </Button>
              </div>
            }
          />
          <MarkedRender render={HERO_RENDER} sizes="(max-width: 1023px) 100vw, 55vw" className="span-7" priority />
        </Section>

        <Section id="rooms">
          <SectionHead id="rooms" eyebrow={ROOMS_HEAD.eyebrow} title={ROOMS_HEAD.title} />
          <ul className="span-12 subgrid">
            {ROOM_TILES.map((t) => (
              <li key={t.use} className="span-4 md:span-6">
                <div className="card">
                  <div className="media-square">
                    <Image src={t.render} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" placeholder="blur" />
                  </div>
                  <h3 className="card-title">
                    <Link href={`${routes.collection}?use=${t.use}#find`}>{t.name}</Link>
                  </h3>
                  <p className="meta">{t.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="discover">
          <SectionHead
            id="discover"
            eyebrow={DISCOVER.eyebrow}
            title={DISCOVER.title}
            lede={DISCOVER.lede}
            action={
              <p>
                <Button variant="link" href={routes.products}>
                  {DISCOVER.all}
                </Button>
              </p>
            }
          />
          <ProductGrid products={launch} />
        </Section>

        <Section id="ready" tone="linen">
          <SectionHead
            id="ready"
            eyebrow={READY_BAND.eyebrow}
            title={READY_BAND.title}
            lede={READY_BAND.body}
            action={
              <p>
                <Button variant="secondary" href={`${routes.products}#ready-made`}>
                  {READY_BAND.call}
                </Button>
              </p>
            }
          />
        </Section>

        <Section id="consult">
          <SectionHead
            id="consult"
            eyebrow={CONSULT.eyebrow}
            title={CONSULT.title}
            lede={CONSULT.body}
            action={
              <p>
                <Button variant="secondary" href={contactHref("visit")}>
                  {CONSULT.call}
                </Button>
              </p>
            }
          />
        </Section>

        <Section id="made">
          <SectionHead
            id="made"
            eyebrow={MADE_WITH.eyebrow}
            title={MADE_WITH.title}
            lede={MADE_WITH.body}
            action={
              <p>
                <Button variant="link" href={routes.about}>
                  {MADE_WITH.call}
                </Button>
              </p>
            }
          />
          <FactGrid facts={PART_MATERIALS.map((m) => ({ label: m.material, body: m.parts }))} />
        </Section>

        <Section id="in-rooms">
          <SectionHead
            id="in-rooms"
            eyebrow={IN_ROOMS.eyebrow}
            title={IN_ROOMS.title}
            action={
              <p>
                <Button variant="link" href={routes.inspiration}>
                  {IN_ROOMS.call}
                </Button>
              </p>
            }
          />
          <ul className="span-12 subgrid">
            {IN_ROOM_PIECES.map((p) => (
              <li key={p.id} className="span-4">
                <div className="card">
                  <div className="media-band">
                    <Image src={p.room} alt={`The ${p.name.toLowerCase()} in a room, a 3D render`} fill sizes="(max-width: 1023px) 100vw, 33vw" placeholder="blur" />
                  </div>
                  <h3 className="card-title">
                    <Link href={productHref(p.id) ?? routes.products}>See the {p.name.toLowerCase()}</Link>
                  </h3>
                  <p className="meta">{p.line}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="questions">
          <SectionHead id="questions" eyebrow={QUESTIONS_HEAD.eyebrow} title={QUESTIONS_HEAD.title} />
          <ul className={`span-8 ruled ${styles.questions}`}>
            {QUESTIONS.map((q) => (
              <li key={q.question}>
                <details>
                  <summary>{q.question}</summary>
                  <p>{q.answer}</p>
                </details>
              </li>
            ))}
          </ul>
          <ul className={`span-4 ruled ${styles.guides}`}>
            {GUIDES.map((g) => (
              <li key={g.href}>
                <Button variant="link" href={g.href}>
                  {g.title}
                </Button>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="find">
          <SectionHead id="find" eyebrow={FIND_HEAD.eyebrow} title={FIND_HEAD.title} />
          <Finder state={state} />
        </Section>

        <Section id="notes">
          <SectionHead id="notes" eyebrow={NOTES_HEAD.eyebrow} title={NOTES_HEAD.title} lede={NOTES_HEAD.lede} />
          {launch.map((p) => {
            const notes = notesOf(p.notes);
            return (
              <div key={p.id} className="span-4">
                <h3>{p.name}</h3>
                {notes.length ? (
                  <ul className={`ruled ${styles.list}`}>
                    {notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={`meta ${styles.list}`}>Nothing open. Ask us about the version you want.</p>
                )}
              </div>
            );
          })}
        </Section>

        <Section id="uses">
          <SectionHead id="uses" eyebrow={OTHER_USES_HEAD.eyebrow} title={OTHER_USES_HEAD.title} lede={OTHER_USES_HEAD.lede} />
          <ul className="span-12 subgrid ruled">
            {OTHER_USES.map((u) => (
              <li key={u.id} className={`span-6 ${styles.kit}`}>
                <p className="card-row">
                  <strong>{u.name}</strong>
                  <span className="mono">{u.record}</span>
                </p>
                <p className="meta">
                  On the {u.parents.map(productName).join(" or ").toLowerCase()} · {OTHER_USE_STATE[u.state]}
                </p>
                <p>{u.line}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="kits">
          <SectionHead id="kits" eyebrow={KITS_HEAD.eyebrow} title={KITS_HEAD.title} lede={KITS_HEAD.lede} />
          {(Object.keys(KIT_TIER) as KitTier[]).map((t) => (
            <section key={t} className="span-6" aria-labelledby={`tier-${t}`}>
              <h3 id={`tier-${t}`}>{KIT_TIER[t].name}</h3>
              <p className="meta">{KIT_TIER[t].detail}</p>
              <ul className={`ruled ${styles.list}`}>
                {KITS.filter((k) => k.tier === t).map((k) => (
                  <li key={k.id} className={styles.kit}>
                    <p className="card-row">
                      <strong>{k.name}</strong>
                      <span className="mono">{k.id}</span>
                    </p>
                    <p className="meta">
                      For the {k.applies.map(productName).join(" or ").toLowerCase()}. {k.line}
                    </p>
                    <p className="meta">
                      Adds {k.adds.join(", ").toLowerCase()}.{k.removes.length > 0 && ` Takes off ${k.removes.join(", ").toLowerCase()}.`}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Section>

        <Section id="catalogue">
          <SectionHead
            id="catalogue"
            eyebrow={STEPS_HEAD.eyebrow}
            title={STEPS_HEAD.title}
            lede={STEPS_HEAD.lede}
            action={
              <p>
                <Button variant="secondary" href={NEWS.href}>
                  {NEWS.call}
                </Button>
              </p>
            }
          />
          <Steps steps={STEPS} />
        </Section>

        <Section id="assurances">
          <SectionHead id="assurances" eyebrow={ASSURANCES_HEAD.eyebrow} title={ASSURANCES_HEAD.title} />
          <FactGrid facts={ASSURANCES} />
        </Section>

        <Section id="closing" tone="dark">
          <SectionHead
            id="closing"
            title={CLOSING.title}
            lede={CLOSING.body}
            action={
              <div className="actions">
                <Button variant="primary" href={routes.designYourRoom}>
                  {CLOSING.call}
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
