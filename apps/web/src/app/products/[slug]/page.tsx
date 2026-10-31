import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARRANGEMENTS,
  CLAIMS,
  FAMILIES,
  KIT_TIER,
  KITS,
  MATERIALS,
  OTHER_USE_STATE,
  OTHER_USES,
  PRODUCTS,
  productById,
  productName,
  STATUS,
  sizeLabel,
  USES,
} from "@/features/products/catalogue";
import { Elevation, elevationWidth } from "@/features/products/Elevation";
import { Gallery } from "@/features/products/Gallery";
import { ProductGrid } from "@/features/products/ProductGrid";
import { priceInFull, shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { ArrowLink } from "../../studio/ArrowLink";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** Pieces this tall that you hang things on come with the widened base and strap (CLAIMS.stability), mm. */
const STABILITY_HEIGHT = 1200;

/** How many other pieces of the same family to show at the foot. */
const MORE = 3;

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = productById((await params).slug);
  return p ? { title: p.name, description: p.line } : {};
}

/**
 * A product, in the same order every time: its name, status, price and what it
 * solves; what's included and what isn't; size and fit; materials; what can
 * change and what it costs; how it arrives; returns and questions; then other
 * uses and related pieces.
 */
export default async function ProductPage({ params }: Props) {
  const p = productById((await params).slug);
  if (!p) notFound();

  const [room] = p.uses;
  const launch = p.status === "launch";
  const hangs = p.category === "organisers" || p.family === "screens";
  const uses = OTHER_USES.filter((u) => u.parents.includes(p.id));
  const arrangements = ARRANGEMENTS.filter((a) => a.members.some((m) => m.product === p.id));
  const kits = KITS.filter((k) => k.applies.includes(p.id));
  const family = PRODUCTS.filter((f) => f.family === p.family && f.id !== p.id).slice(0, MORE);
  const scale = (elevationWidth(p.size.w) + elevationWidth(p.size.d)) * 1.08;

  return (
    <>
      <main id="main" className={styles.page} data-page="product">
        <PeachBackdrop />

        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={routes.products}>Products</Link>
            </li>
            {room && (
              <li>
                <Link href={`${routes.products}?room=${room}`}>{USES[room]}</Link>
              </li>
            )}
            <li aria-current="page">{p.name}</li>
          </ol>
        </nav>

        <header className={styles.head}>
          <p className={styles.index}>
            <span>No. {p.record}</span>
            <span>{p.uses.map((u) => USES[u]).join(" and ")}</span>
          </p>
          <h1 className={styles.title}>{p.name}</h1>
          <p className={styles.use}>{p.line}</p>
        </header>

        <div className={styles.top}>
          <div className={styles.media}>
            <Gallery product={p} />
            <p className={styles.note}>{CLAIMS.renders.detail}</p>
          </div>

          <div className={styles.decide}>
            <p className={styles.status} data-status={p.status}>
              {STATUS[p.status].name}
            </p>
            <h2 className={styles.heading}>{launch ? "Make this piece yours." : "Keep this piece in mind."}</h2>
            <p className={styles.body}>{STATUS[p.status].detail}</p>
            <p className={styles.quick}>
              {sizeLabel(p.size)} · {priceInFull(p.id)} · {launch ? shown("leadFlatPack") : "Date to come"}
            </p>
            <div className={styles.actions}>
              {launch && (
                <Link href={routes.signIn} className={styles.button}>
                  Sign in to buy
                </Link>
              )}
              <Link href={contactHref("product", p.id)} className={launch ? styles.secondary : styles.button}>
                {launch ? "Ask about this piece" : "Tell us you're interested"}
              </Link>
              <ArrowLink href={routes.studio}>See it in your room</ArrowLink>
            </div>

            <dl className={styles.facts}>
              <div>
                <dt className={styles.label}>Size</dt>
                <dd>
                  {sizeLabel(p.size)}, width × height × depth, nominal
                  {p.size.baseD && `; steel base ${p.size.baseD / 10} cm deep`}
                </dd>
              </div>
              <div>
                <dt className={styles.label}>Family</dt>
                <dd>
                  {FAMILIES[p.family].name}: {FAMILIES[p.family].line}
                </dd>
              </div>
              <div>
                <dt className={styles.label}>Price</dt>
                <dd>{CLAIMS.price.detail}</dd>
              </div>
            </dl>
          </div>
        </div>

        <section className={styles.section} aria-labelledby="for">
          <h2 id="for" className={styles.label}>
            What it&rsquo;s for
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>Made for moments like</p>
            <ul className={styles.moments}>
              {p.situations.map((s) => (
                <li key={s}>&ldquo;{s}&rdquo;</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="know">
          <h2 id="know" className={styles.label}>
            Before you choose
          </h2>
          <ul className={`${styles.content} ${styles.list}`}>
            {p.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="included">
          <h2 id="included" className={styles.label}>
            What&rsquo;s included
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>{p.line}</p>
            <p className={styles.body}>The panels, base and hardware are included, along with the steps if it comes flat-packed.</p>
            <p className={styles.body}>
              <strong>Not included:</strong> {p.scene}
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="size">
          <h2 id="size" className={styles.label}>
            Size and fit
          </h2>
          <div className={styles.content}>
            <div className={styles.drawings}>
              <Elevation across={p.size.w} high={p.size.h} label="Front" scale={scale} />
              <Elevation across={p.size.d} high={p.size.h} label="Side" scale={scale} />
            </div>
            <p className={styles.body}>
              {sizeLabel(p.size)}, width × height × depth, nominal
              {p.size.baseD && `; steel base ${p.size.baseD / 10} cm deep`}.
            </p>
            <p className={styles.body}>{CLAIMS.fit.detail}</p>
            <ul className={styles.list}>
              {p.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            {hangs && p.size.h >= STABILITY_HEIGHT && <p className={styles.body}>{CLAIMS.stability.detail}</p>}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="material">
          <h2 id="material" className={styles.label}>
            Materials
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>{MATERIALS.body}</p>
            <p className={styles.body}>{CLAIMS.accent.detail}</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="change">
          <h2 id="change" className={styles.label}>
            What you can change
          </h2>
          <div className={styles.content}>
            <ul className={styles.list}>
              <li>Size: height in steps of 40 cm up to 160 cm, width of 60, 120 or 180 cm. A custom size costs {shown("customSizePrice")}.</li>
              <li>Colour: white matte with birch edges to start. A special colour, once offered, costs {shown("specialColourPrice")}.</li>
              <li>Add-ons: {shown("addOnPrices")}.</li>
            </ul>
            {kits.length > 0 && (
              <ul className={styles.list}>
                {kits.map((k) => (
                  <li key={k.id}>
                    <strong>{k.name}</strong> ({KIT_TIER[k.tier].name.toLowerCase()}). {k.line}
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.body}>
              <strong>What you can&rsquo;t change:</strong> the 40 cm depth. Casters stop at 120 cm tall, and doors at under 120 cm. Anything
              outside these limits goes to our team for a review and a quote.
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="delivery">
          <h2 id="delivery" className={styles.label}>
            How it arrives
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>{CLAIMS.delivery.detail}</p>
            <p className={styles.body}>{CLAIMS.leadTime.detail}</p>
            <p className={styles.body}>Delivery is in Singapore. Help with installing costs {shown("installPrice")}. {shown("gstTerms")}</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="returns">
          <h2 id="returns" className={styles.label}>
            Returns and warranty
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>
              Standard pieces can be returned on our standard terms. Custom pieces can be returned only if they are faulty, damaged or wrong.{" "}
              {shown("returnsTerms")} {shown("warranty")}
            </p>
            <ArrowLink href={routes.help}>More answers</ArrowLink>
          </div>
        </section>

        {uses.length > 0 && (
          <section className={styles.section} aria-labelledby="uses">
            <h2 id="uses" className={styles.label}>
              Other uses of it
            </h2>
            <ul className={styles.tiles}>
              {uses.map((u) => (
                <li key={u.id} className={styles.tile}>
                  <div className={styles.tileImage}>
                    <Image src={u.image} alt="" fill sizes="(max-width: 900px) 50vw, 20vw" />
                  </div>
                  <p className={styles.tileMeta}>
                    <span>{OTHER_USE_STATE[u.state]}</span>
                  </p>
                  <h3 className={styles.tileName}>{u.name}</h3>
                  <p className={styles.tileLine}>{u.line}</p>
                  <p className={styles.tileNote}>{u.note}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {arrangements.length > 0 && (
          <section className={styles.section} aria-labelledby="arrangements">
            <h2 id="arrangements" className={styles.label}>
              Arrangements with it
            </h2>
            <ul className={styles.tiles}>
              {arrangements.map((a) => (
                <li key={a.id} className={styles.tile}>
                  <div className={styles.tileImage}>
                    <Image src={a.image} alt="" fill sizes="(max-width: 900px) 50vw, 20vw" />
                  </div>
                  <h3 className={styles.tileName}>{a.name}</h3>
                  <p className={styles.tileLine}>{a.line}</p>
                  <p className={styles.tileNote}>
                    {a.members
                      .map((m) => `${m.count} × ${productName(m.product)}${m.note ? ` (${m.note})` : ""}`)
                      .join(", ")}
                    . {a.note}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {family.length > 0 && (
          <section className={styles.family} aria-labelledby="family">
            <div className={styles.familyHead}>
              <h2 id="family" className={styles.heading}>
                More {FAMILIES[p.family].name.toLowerCase()}.
              </h2>
              <ArrowLink href={routes.products}>All furniture</ArrowLink>
            </div>
            <ProductGrid products={family} />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
