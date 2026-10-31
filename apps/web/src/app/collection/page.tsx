import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CLAIMS,
  KIT_TIER,
  type KitTier,
  KITS,
  OTHER_USE_STATE,
  OTHER_USES,
  type Product,
  PRODUCTS,
  productById,
  productName,
  sizeLabel,
  USES,
} from "@/features/products/catalogue";
import { contactHref, routes } from "@/lib/routes";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import {
  CLOSING,
  CONSULT,
  DISCOVER,
  EXPLORE,
  FIGURES,
  HERO,
  HERO_RENDER,
  IN_ROOMS,
  KITS_HEAD,
  MARQUEE_END,
  NOTES_HEAD,
  OTHER_USES_HEAD,
  QUESTIONS,
  QUESTIONS_HEAD,
  ROOM_TILES,
  ROOMS_HEAD,
  STEPS,
  STEPS_HEAD,
} from "./collectionCopy";
import { ConsultPhotos } from "./ConsultPhotos";
import { Finder, readFinder } from "../products/Finder";
import { MarkedRender } from "./MarkedRender";
import styles from "../products/sections.module.css";
import { productHref } from "../products/productHref";

export const metadata: Metadata = { title: "Collection", description: "Browse Furnishes furniture by room, use and budget, in ready-made and customizable lines." };

const pad = (n: number) => String(n).padStart(2, "0");

/** A piece's photo and name, then what is still open on it. */
function Notes({ product }: { product: Product }) {
  return (
    <div className={styles.notesPiece}>
      <div className={styles.notesPhoto}>
        <Image src={product.studio} alt="" fill sizes="(max-width: 900px) 100vw, 29vw" placeholder="blur" />
      </div>
      <h3 className={styles.notesName}>
        {product.name} <span className={styles.n}>No. {product.record}</span>
      </h3>
      <ul className={styles.notesList}>
        {product.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

/** Words running across the full width, a dot between each; drawn twice so the run joins up. */
function Marquee({ words, className }: { words: readonly string[]; className?: string }) {
  const run = words.map((w) => (
    <span key={w}>
      {w}
      <span className={styles.dot} aria-hidden="true">
        •
      </span>
    </span>
  ));
  return (
    <div className={`${styles.marquee} ${className ?? ""}`}>
      <p className="visually-hidden">{words.join(", ")}</p>
      <div className={styles.marqueeTrack} aria-hidden="true">
        <span className={styles.marqueeRun}>{run}</span>
        <span className={styles.marqueeRun}>{run}</span>
      </div>
    </div>
  );
}

/**
 * The collection, in the order of its three references: the headline and
 * the call, then a render with its parts marked and the catalogue's figures;
 * the rooms; the consultation band; the first products; pieces in their rooms; the launch
 * pieces in brief; what to know; find your piece (search, filters, views,
 * tiles or the index); what is open on each piece; their
 * other uses; the add-on kits; how the catalogue works; and the closing photo
 * under its running words. Then the footer.
 */
export default async function Collection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const state = readFinder(await searchParams, routes.collection);
  const launch = PRODUCTS.filter((p) => p.status === "launch");
  const following = PRODUCTS.filter((p) => p.status !== "launch");

  return (
    <>
      <main id="main" className={styles.page} data-page="collection">
        <PeachBackdrop />
        <section className={styles.hero} aria-labelledby="hero-title">
          <p className={styles.index}>
            <span>The collection</span>
          </p>
          <h1 id="hero-title" className={styles.heroTitle}>
            {HERO.title}
          </h1>
          <div className={styles.heroSide}>
            <p className={styles.heroLede}>{HERO.lede}</p>
            <a href="#find" className={styles.pillOutline}>
              {HERO.call}
            </a>
            <Link href={`${routes.products}#ready-made`} className={styles.pillOutline}>
              {HERO.readyMade}
            </Link>
          </div>
          <MarkedRender render={HERO_RENDER} sizes="(max-width: 700px) 100vw, 92vw" className={styles.heroRender} soft>
            <dl className={styles.figures}>
              {FIGURES.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{pad(f.value)}</dd>
                </div>
              ))}
            </dl>
          </MarkedRender>
        </section>

        <section className={styles.section} aria-labelledby="rooms-by-title">
          <p className={styles.index}>
            <span>{ROOMS_HEAD.label}</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="rooms-by-title" className={styles.sectionTitle}>
              {ROOMS_HEAD.title}
            </h2>
            <a href="#find" className={styles.pillOutline}>
              {ROOMS_HEAD.call}
            </a>
          </div>
          <ul className={styles.roomTiles}>
            {ROOM_TILES.map((t) => (
              <li key={t.use}>
                <Link href={`${routes.collection}?use=${t.use}#find`} className={styles.roomTile}>
                  <Image src={t.photo} alt="" fill sizes="(max-width: 700px) 50vw, 29vw" placeholder="blur" />
                  <span>{USES[t.use]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.consult} aria-labelledby="consult-title">
          <div className={styles.consultBand}>
            <p className={styles.index}>
              <span>{CONSULT.label}</span>
            </p>
            <h2 id="consult-title" className={styles.consultTitle}>
              {CONSULT.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <div className={styles.consultSide}>
              <h3 className={styles.consultName}>{CONSULT.side}</h3>
              <p className={styles.consultBody}>{CONSULT.body}</p>
              <Link href={contactHref("visit")} className={styles.pillOutline}>
                {CONSULT.call}
              </Link>
            </div>
          </div>
          <div className={styles.consultPhotos}>
            <ConsultPhotos photos={CONSULT.photos} small={CONSULT.small} line={CONSULT.line} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="discover-title">
          <p className={styles.index}>
            <span>{DISCOVER.label}</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="discover-title" className={styles.sectionTitle}>
              {DISCOVER.title}
            </h2>
            <p className={styles.sectionAside}>{DISCOVER.lede}</p>
          </div>
          <ul className={styles.products}>
            {PRODUCTS.slice(0, DISCOVER.count).map((p) => {
              const href = productHref(p.id);
              const name = <h3 className={styles.productName}>{p.name}</h3>;
              return (
                <li key={p.id} className={styles.product}>
                  <div className={styles.productPhoto}>
                    <Image src={p.room} alt="" fill sizes="(max-width: 900px) 50vw, 22vw" placeholder="blur" />
                  </div>
                  {href ? (
                    <Link href={href} className={styles.productLink}>
                      {name}
                    </Link>
                  ) : (
                    name
                  )}
                  <p className={styles.productPrice}>{p.price ?? CLAIMS.price.label}</p>
                  <p className={styles.productLine}>{p.line}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="rooms-title">
          <p className={styles.index}>
            <span>Rooms</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="rooms-title" className={styles.sectionTitle}>
              In their rooms
            </h2>
            <Link href={routes.inspiration} className={styles.pillOutline}>
              See all projects
            </Link>
          </div>
          <div className={styles.banners}>
            {IN_ROOMS.map((r) => {
              const p = productById(r.id);
              const href = productHref(r.id);
              return (
                <MarkedRender key={r.id} render={r} sizes="(max-width: 700px) 100vw, 92vw" className={styles.banner} soft>
                  {p &&
                    (href ? (
                      <Link href={href} className={styles.bannerPill}>
                        See the {p.name.toLowerCase()}
                      </Link>
                    ) : (
                      <span className={styles.bannerPill}>{p.name}</span>
                    ))}
                </MarkedRender>
              );
            })}
          </div>
        </section>

        <section className={styles.explore} aria-labelledby="explore-title">
          <div className={styles.exploreWords}>
            <p className={styles.index}>
              <span>{EXPLORE.label}</span>
            </p>
            <h2 id="explore-title" className={styles.sectionTitle}>
              {EXPLORE.title}
            </h2>
            <p className={styles.exploreBody}>{EXPLORE.body}</p>
            <Link href={`${routes.collection}?status=launch#find`} className={styles.exploreCall}>
              {EXPLORE.call}
            </Link>
          </div>
          <div className={styles.explorePhoto}>
            {launch[0] && <Image src={launch[0].room} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" placeholder="blur" />}
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="faq-title">
          <div className={styles.faqPhoto}>
            <Image
              src={QUESTIONS_HEAD.photo}
              alt={QUESTIONS_HEAD.photoAlt}
              fill
              sizes="(max-width: 700px) 100vw, 40vw"
              placeholder="blur"
            />
          </div>
          <div>
            <p className={styles.index}>
              <span>Questions</span>
            </p>
            <h2 id="faq-title" className={styles.sectionTitle}>
              {QUESTIONS_HEAD.title}
            </h2>
            <div className={styles.faqList}>
              {QUESTIONS.map((q, i) => (
                <details key={q.question} className={styles.faqItem} open={i === 0}>
                  <summary className={styles.faqQuestion}>
                    {q.question}
                    <span className={styles.faqChevron} aria-hidden="true" />
                  </summary>
                  <p className={styles.faqAnswer}>{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Finder state={state} />

        <section className={styles.section} aria-labelledby="notes-title">
          <p className={styles.index}>
            <span>Notes</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="notes-title" className={styles.sectionTitle}>
              {NOTES_HEAD.title}
            </h2>
            <p className={styles.sectionAside}>{NOTES_HEAD.lede}</p>
          </div>
          <div className={styles.notes}>
            {launch.map((p) => (
              <Notes key={p.id} product={p} />
            ))}
          </div>
          <details className={styles.notesMore}>
            <summary className={styles.faqQuestion}>
              <span>
                {NOTES_HEAD.more} <span className={styles.n}>{following.length}</span>
              </span>
              <span className={styles.faqChevron} aria-hidden="true" />
            </summary>
            <div className={styles.notes}>
              {following.map((p) => (
                <Notes key={p.id} product={p} />
              ))}
            </div>
          </details>
        </section>

        <section className={styles.section} aria-labelledby="uses-title">
          <p className={styles.index}>
            <span>Uses</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="uses-title" className={styles.sectionTitle}>
              {OTHER_USES_HEAD.title}
            </h2>
            <p className={styles.sectionAside}>{OTHER_USES_HEAD.lede}</p>
          </div>
          <ul className={styles.uses}>
            {OTHER_USES.map((u) => (
              <li key={u.id} className={styles.use}>
                <div className={styles.useImage}>
                  <Image src={u.image} alt="" fill sizes="(max-width: 700px) 70vw, 22vw" />
                </div>
                <h3 className={styles.useName}>{u.name}</h3>
                <p className={styles.useParents}>
                  <span>On the {u.parents.map(productName).join(" or ").toLowerCase()}</span>
                  <span data-state={u.state}>{OTHER_USE_STATE[u.state]}</span>
                </p>
                <p className={styles.useLine}>{u.line}</p>
                <p className={styles.useNote}>{u.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="kits-title">
          <p className={styles.index}>
            <span>Kits</span>
          </p>
          <div className={styles.sectionHead}>
            <h2 id="kits-title" className={styles.sectionTitle}>
              {KITS_HEAD.title}
            </h2>
            <p className={styles.sectionAside}>{KITS_HEAD.lede}</p>
          </div>
          <div className={styles.kitTiers}>
            {(Object.keys(KIT_TIER) as KitTier[]).map((t) => (
              <section key={t} className={styles.kitTier} aria-labelledby={`tier-${t}`}>
                <header className={styles.kitTierHead}>
                  <h3 id={`tier-${t}`}>{KIT_TIER[t].name}</h3>
                  <p>{KIT_TIER[t].detail}</p>
                </header>
                <ul className={styles.kits}>
                  {KITS.filter((k) => k.tier === t).map((k) => (
                    <li key={k.id} className={styles.kit}>
                      <p className={styles.kitFor}>
                        <span>{k.id}</span>
                        <span>For the {k.applies.map(productName).join(" or ").toLowerCase()}</span>
                      </p>
                      <h4 className={styles.kitName}>{k.name}</h4>
                      <p className={styles.kitLine}>{k.line}</p>
                      <ul className={styles.kitParts}>
                        {k.adds.map((a) => (
                          <li key={a} data-change="adds">
                            {a}
                          </li>
                        ))}
                        {k.removes.map((r) => (
                          <li key={r} data-change="removes">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <p className={styles.index}>
            <span>Catalogue</span>
          </p>
          <h2 id="steps-title" className={styles.stepsTitle}>
            {STEPS_HEAD.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className={styles.stepsLede}>{STEPS_HEAD.body}</p>
          <ol className={styles.stepsList}>
            {STEPS.map((s, i) => (
              <li key={s.title} className={styles.step}>
                <div className={styles.stepPhoto}>
                  <Image src={s.photo} alt="" fill sizes="(max-width: 900px) 100vw, 29vw" placeholder="blur" />
                </div>
                <span className={styles.stepNo}>{pad(i + 1)}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <dl className={styles.stepPoints}>
                  {s.points.map((pt) => (
                    <div key={pt.head}>
                      <dt>{pt.head}</dt>
                      <dd>{pt.body}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <Image src={CLOSING.photo} alt={CLOSING.photoAlt} fill sizes="100vw" placeholder="blur" className={styles.closingPhoto} />
          <Marquee words={MARQUEE_END} className={styles.marqueeEnd} />
          <div className={styles.closingRow}>
            <h2 id="closing-title" className={styles.closingTitle}>
              {CLOSING.title.join(" ")}
            </h2>
            <p className={styles.closingBody}>{CLOSING.body}</p>
            <Link href={routes.studio} className={styles.more}>
              {CLOSING.call}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
