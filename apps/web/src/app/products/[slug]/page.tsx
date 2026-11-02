import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CLAIMS, FAMILIES, MATERIALS, PRODUCTS, priceFrom, productById, sizeLabel, USES } from "@/features/products/catalogue";
import { Elevation, elevationWidth } from "@/features/products/Elevation";
import { Gallery } from "@/features/products/Gallery";
import { ProductGrid } from "@/features/products/ProductGrid";
import { isReal, marked, PIECE_PRICES, shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { FactGrid } from "@/shell/ui/FactGrid";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

/** How many other pieces to show at the foot. */
const MORE = 3;

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = productById((await params).slug);
  return p ? { title: p.name, description: p.line } : {};
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A small clock, beside the lead time. */
function Clock() {
  return (
    <svg className={styles.clock} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5V8l2.5 1.5" />
    </svg>
  );
}

/**
 * A product: the gallery (sticky on wide screens) beside the buy panel, its
 * breadcrumb, name, price, lead time, the calls and its facts; then its size
 * drawn, what it is for and what to know before choosing; then other pieces.
 */
export default async function ProductPage({ params }: Props) {
  const p = productById((await params).slug);
  if (!p) notFound();

  const [room] = p.uses;
  const launch = p.status === "launch";
  const prices = PIECE_PRICES[p.id];
  const family = PRODUCTS.filter((f) => f.family === p.family && f.id !== p.id);
  const related = [...family, ...PRODUCTS.filter((f) => f.family !== p.family && f.status === "launch" && f.id !== p.id)].slice(0, MORE);
  const scale = (elevationWidth(p.size.w) + elevationWidth(p.size.d)) * 1.08;
  /** Notes that point to the weight limits say nothing until those limits are tested. */
  const notes = p.notes.filter((n) => isReal("weightLimits") || !/weight limit/i.test(n));
  const size = `${sizeLabel(p.size)}, width × height × depth${p.size.baseD ? `; steel base ${p.size.baseD / 10} cm deep` : ""}`;

  const drawings = (
    <>
      <Elevation across={p.size.w} high={p.size.h} label="Front" scale={scale} />
      <Elevation across={p.size.d} high={p.size.h} label="Side" scale={scale} />
    </>
  );

  const facts = [
    { label: "Size", body: <span className="mono">{size}</span> },
    { label: "Material", body: MATERIALS.body },
    { label: "Finish options", body: `White matte with birch edges to start. A special colour, once offered, costs ${shown("specialColourPrice")}.` },
    ...(isReal("weightLimits") ? [{ label: "Load limits", body: shown("weightLimits") }] : []),
    { label: "What's included", body: "The panels, base and hardware, and the steps if it comes flat-packed." },
    { label: "Not included", body: p.scene },
    { label: "Returns and warranty", body: `${shown("returnsTerms")} ${shown("warranty")}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.line,
    sku: p.record,
    image: [p.room.src, p.studio.src].map((src) => new URL(src, SITE_URL).href),
    brand: { "@type": "Brand", name: "Furnishes" },
    ...(prices && isReal("piecePrices")
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}${routes.products}/${p.id}`,
            priceCurrency: "SGD",
            price: prices.flat,
            availability: launch ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          },
        }
      : {}),
  };

  return (
    <>
      <main id="main" data-page="product">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Section id="piece" labelledBy="piece-title">
          <Gallery
            className="span-7"
            views={[
              { kind: "image", src: p.room, alt: `The ${p.name.toLowerCase()} in a room, a 3D render` },
              { kind: "image", src: p.studio, alt: `The ${p.name.toLowerCase()} on its own, a 3D render` },
              {
                kind: "drawing",
                label: `Dimensions: ${sizeLabel(p.size)}`,
                main: drawings,
                thumb: <Elevation across={p.size.w} high={p.size.h} label="Front" scale={elevationWidth(p.size.w)} />,
              },
            ]}
            note={CLAIMS.renders.detail}
          />

          <div className={`span-5 start-8 ${styles.panel}`}>
            <nav aria-label="Breadcrumb">
              <ol className={`eyebrow ${styles.crumbs}`}>
                <li>
                  <Link href={routes.products}>Products</Link>
                </li>
                {room && (
                  <li>
                    <Link href={`${routes.products}?use=${room}#find`}>{USES[room]}</Link>
                  </li>
                )}
                <li aria-current="page">{p.name}</li>
              </ol>
            </nav>

            <h1 id="piece-title" className={styles.name}>
              {p.name}
            </h1>
            <p className="lede">{p.line}</p>

            <div className={styles.buy}>
              {priceFrom(p.id) && <p className={styles.price}>{capital(priceFrom(p.id))}</p>}
              {prices && (
                <p className="meta">
                  {[marked("piecePrices", "flat-packed"), marked("piecePrices", `S$${prices.built.toLocaleString("en-SG")} built`), marked("gstTerms", "GST and delivery included")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              <p className={`meta ${styles.lead}`}>
                <Clock />
                {launch ? `${capital(shown("leadFlatPack"))} flat-packed, ${shown("leadBuilt")} built` : "In production. Ask us when it will be ready."}
              </p>
            </div>

            <div className="actions">
              <Button variant="primary" href={contactHref("order", p.id)}>
                Enquire to order
              </Button>
              <Button variant="secondary" href={contactHref("product", p.id)}>
                Ask a question
              </Button>
            </div>
            <p>
              <Button variant="link" href={routes.designYourRoom}>
                See it in a flat →
              </Button>
            </p>

            <FactGrid facts={facts} span="span-6" />
          </div>
        </Section>

        <Section id="dimensions">
          <div className={`span-6 ${styles.panel}`}>
            <header className={styles.head}>
              <p className="eyebrow">Size and fit</p>
              <h2 id="dimensions-title">
                Dimensions.
              </h2>
            </header>
            <p className="mono">{size}</p>
            <p>{CLAIMS.fit.detail}</p>
          </div>
          <div className={`span-5 start-8 ${styles.drawings}`}>{drawings}</div>
          <div className="span-6">
            <h3>What it&rsquo;s for</h3>
            <ul className={`ruled ${styles.points}`}>
              {p.situations.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          {notes.length > 0 && (
            <div className="span-6">
              <h3>Before you choose</h3>
              <ul className={`ruled ${styles.points}`}>
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {related.length > 0 && (
          <Section id="more">
            <SectionHead id="more" title={family.length ? `More ${FAMILIES[p.family].name.toLowerCase()}.` : "Other pieces."} />
            <ProductGrid products={related} />
          </Section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
