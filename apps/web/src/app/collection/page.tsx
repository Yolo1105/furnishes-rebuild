import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ARRANGEMENTS,
  KIT_TIER,
  type KitTier,
  KITS,
  OTHER_USE_STATE,
  OTHER_USES,
  PART_MATERIALS,
  type Product,
  PRODUCTS,
  productById,
  productName,
  sizeLabel,
  USES,
} from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import {
  ARRANGEMENTS_HEAD,
  BAND,
  CLOSING,
  FIGURES,
  HERO,
  HERO_RENDER,
  IN_ROOMS,
  INTRO,
  KITS_HEAD,
  MARQUEE_END,
  MARQUEE_TOP,
  MATERIAL_PANEL,
  NOTES_HEAD,
  OTHER_USES_HEAD,
  PICKS_HEAD,
  QUESTIONS,
  QUESTIONS_HEAD,
  RING,
  STEPS,
  STEPS_HEAD,
} from "./collectionCopy";
import { Finder, readFinder } from "./Finder";
import { MarkedRender } from "./MarkedRender";
import styles from "./page.module.css";
import { productHref } from "./productHref";

export const metadata: Metadata = { title: "Collection" };

const pad = (n: number) => String(n).padStart(2, "0");

/** A piece's name, then what is still open on it. */
function Notes({ product }: { product: Product }) {
  return (
    <div className={styles.notesPiece}>
      <h3 className={styles.notesName}>
        {product.name} <span>No. {product.record}</span>
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
 * The collection, in the order of its three references: the running words
 * and an intro line; the headline and the call, then a render with its
 * parts marked and the catalogue's figures; the band; the word and its
 * ring; find your piece (search, filters, views, tiles or the index); the
 * launch pieces and what is open on each; pieces in their rooms; their
 * other uses; the add-on kits; the arrangements they make; the materials
 * and parts; how the catalogue works; what to know; and the closing photo
 * under its running words. Then the footer.
 */
export default async function Collection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const state = readFinder(await searchParams);
  const launch = PRODUCTS.filter((p) => p.status === "launch");
  const following = PRODUCTS.filter((p) => p.status !== "launch");

  return (
    <div className={styles.ground}>
      <main className={styles.page} data-page="collection">
        <h1 className="visually-hidden">The collection</h1>
        <Marquee words={MARQUEE_TOP} className={styles.marqueeTop} />

        <div className={styles.intro}>
          <div className={styles.introPhoto}>
            <Image src={INTRO.photo} alt={INTRO.photoAlt} fill sizes="(max-width: 700px) 60vw, 26vw" placeholder="blur" />
          </div>
          <p className={styles.introLine}>{INTRO.line}</p>
          <Link href={routes.about} className={styles.more}>
            Learn more <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <section className={styles.hero} aria-labelledby="hero-title">
          <h2 id="hero-title" className={styles.heroTitle}>
            {HERO.title}
          </h2>
          <div className={styles.heroSide}>
            <p className={styles.heroLede}>{HERO.lede}</p>
            <a href="#find" className={styles.pillOutline}>
              {HERO.call} <span aria-hidden="true">→</span>
            </a>
          </div>
          <MarkedRender render={HERO_RENDER} sizes="(max-width: 700px) 100vw, 92vw" className={styles.heroRender}>
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

        <section className={styles.band} aria-labelledby="band-title">
          <div className={styles.bandText}>
            <h2 id="band-title" className={styles.bandTitle}>
              {BAND.title.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </h2>
            <div>
              <p className={styles.bandNoteTitle}>{BAND.noteTitle}</p>
              <p className={styles.bandNote}>{BAND.note}</p>
            </div>
          </div>
          <figure className={styles.bandFigure}>
            <Image src={BAND.src} alt={BAND.alt} fill sizes="(max-width: 700px) 100vw, 84vw" placeholder="blur" />
            <figcaption className={styles.bandCaption}>
              <span>{BAND.kicker}</span>
              <span className={styles.bandCaptionTitle}>{BAND.caption}</span>
            </figcaption>
          </figure>
        </section>

        <section className={styles.ringRow} aria-label="About the collection">
          <p className={styles.ringWord}>{RING.word}</p>
          <div className={styles.ring} aria-hidden="true">
            <svg viewBox="0 0 200 200" className={styles.ringText}>
              <defs>
                <path id="ring-path" d="M100 100m-82 0a82 82 0 1 1 164 0a82 82 0 1 1-164 0" />
              </defs>
              <text>
                <textPath href="#ring-path" textLength="510">
                  {RING.ring.repeat(2)}
                </textPath>
              </text>
            </svg>
            <span className={styles.ringBadge}>{RING.badge}</span>
          </div>
          <p className={styles.ringBody}>{RING.body}</p>
        </section>

        <Finder state={state} />

        <section className={styles.section} aria-labelledby="picks-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="picks-title" className={styles.sectionTitle}>
                {PICKS_HEAD.title}
              </h2>
              <p className={styles.sectionLede}>{PICKS_HEAD.lede}</p>
            </div>
            <Link href={`${routes.collection}?status=launch#find`} className={styles.pillOutline}>
              See all pieces <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={styles.picks}>
            {launch.map((p) => {
              const href = productHref(p.id);
              return (
                <li key={p.id} className={styles.pick}>
                  <Image src={p.room} alt="" fill sizes="(max-width: 900px) 100vw, 31vw" placeholder="blur" />
                  <ul className={styles.tags}>
                    {p.uses.map((u) => (
                      <li key={u}>{USES[u]}</li>
                    ))}
                    <li>No. {p.record}</li>
                  </ul>
                  <div>
                    <p className={styles.pickSituation}>&ldquo;{p.situations[0]}&rdquo;</p>
                    <div className={styles.pickFoot}>
                      <div>
                        <h3 className={styles.pickName}>{p.name}</h3>
                        <p className={styles.pickSmall}>Size</p>
                        <p className={styles.pickSize}>{sizeLabel(p.size)}</p>
                      </div>
                      {href && (
                        <Link href={href} className={styles.pickCall}>
                          See piece<span className="visually-hidden">: {p.name}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="notes-title">
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

        <section className={styles.section} aria-labelledby="rooms-title">
          <div className={styles.sectionHead}>
            <h2 id="rooms-title" className={styles.sectionTitle}>
              In their rooms
            </h2>
            <Link href={routes.inspiration} className={styles.pillOutline}>
              See all projects <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.banners}>
            {IN_ROOMS.map((r) => {
              const p = productById(r.id);
              const href = productHref(r.id);
              return (
                <MarkedRender key={r.id} render={r} sizes="(max-width: 700px) 100vw, 92vw" className={styles.banner}>
                  {p &&
                    (href ? (
                      <Link href={href} className={styles.bannerPill}>
                        {p.name}
                      </Link>
                    ) : (
                      <span className={styles.bannerPill}>{p.name}</span>
                    ))}
                  {p && <figcaption className={styles.bannerNote}>{p.scene}</figcaption>}
                </MarkedRender>
              );
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="uses-title">
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

        <section className={styles.section} aria-labelledby="around-title">
          <div className={styles.sectionHead}>
            <h2 id="around-title" className={styles.sectionTitle}>
              {ARRANGEMENTS_HEAD.title}
            </h2>
            <p className={styles.sectionAside}>{ARRANGEMENTS_HEAD.lede}</p>
          </div>
          <ol className={styles.arrangements}>
            {ARRANGEMENTS.map((a) => (
              <li key={a.id} className={styles.arrangement}>
                <span className={styles.arrNo}>{a.record}</span>
                <span className={styles.arrImage}>
                  <Image src={a.image} alt="" fill sizes="96px" />
                </span>
                <span className={styles.arrText}>
                  <strong>{a.name}</strong>
                  <span>{a.line}</span>
                </span>
                <span className={styles.arrMembers}>
                  {a.members
                    .map((m) => `${m.count} × ${productName(m.product)}${m.note ? ` (${m.note})` : ""}`)
                    .join(" + ")}
                </span>
                <span className={styles.arrNote}>{a.note}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.split} aria-labelledby="material-title">
          <div className={styles.splitPhoto}>
            <Image
              src={MATERIAL_PANEL.photo}
              alt={MATERIAL_PANEL.photoAlt}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
              placeholder="blur"
            />
          </div>
          <div className={styles.splitPanel}>
            <h2 id="material-title" className={styles.splitTitle}>
              {MATERIAL_PANEL.title}
            </h2>
            <p className={styles.splitBody}>{MATERIAL_PANEL.body}</p>
            <p className={styles.splitSmall}>{MATERIAL_PANEL.small}</p>
            <h3 className={styles.partsTitle}>{KITS_HEAD.materials}</h3>
            <dl className={styles.parts}>
              {PART_MATERIALS.map((m) => (
                <div key={m.material}>
                  <dt>{m.material}</dt>
                  <dd>{m.parts}</dd>
                </div>
              ))}
            </dl>
            <Link href={routes.about} className={styles.pillLight}>
              {MATERIAL_PANEL.call}
            </Link>
          </div>
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <h2 id="steps-title" className={styles.stepsTitle}>
            {STEPS_HEAD.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className={styles.stepsLede}>{STEPS_HEAD.body}</p>
          <div className={styles.stepsPhoto}>
            {launch[0] && <Image src={launch[0].studio} alt="" fill sizes="(max-width: 700px) 60vw, 20vw" placeholder="blur" />}
          </div>
          <ol className={styles.stepsList}>
            {STEPS.map((s, i) => (
              <li key={s.title} className={styles.step}>
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

        <section className={styles.closing} aria-labelledby="closing-title">
          <Image src={CLOSING.photo} alt={CLOSING.photoAlt} fill sizes="100vw" placeholder="blur" className={styles.closingPhoto} />
          <Marquee words={MARQUEE_END} className={styles.marqueeEnd} />
          <div className={styles.closingRow}>
            <h2 id="closing-title" className={styles.closingTitle}>
              <em>{CLOSING.title[0]}</em> {CLOSING.title[1]}
            </h2>
            <p className={styles.closingBody}>{CLOSING.body}</p>
            <Link href={routes.studio} className={styles.more}>
              {CLOSING.call} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
