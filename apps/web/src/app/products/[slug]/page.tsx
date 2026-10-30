import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ARRANGEMENTS,
  CLAIMS,
  FAMILIES,
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
import { routes } from "@/lib/routes";
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
 * A product: where it sits in the catalogue, its name and line; its renders
 * beside its status, what to do next and its facts; then what it is for,
 * what to know before choosing it, its other uses and the arrangements it
 * stands in, its size drawn front and side, its material, delivery, and more
 * pieces of its family.
 */
export default async function ProductPage({ params }: Props) {
  const p = productById((await params).slug);
  if (!p) notFound();

  const [room] = p.uses;
  const launch = p.status === "launch";
  const hangs = p.category === "organisers" || p.family === "screens";
  const uses = OTHER_USES.filter((u) => u.parents.includes(p.id));
  const arrangements = ARRANGEMENTS.filter((a) => a.members.some((m) => m.product === p.id));
  const family = PRODUCTS.filter((f) => f.family === p.family && f.id !== p.id).slice(0, MORE);
  const scale = (elevationWidth(p.size.w) + elevationWidth(p.size.d)) * 1.08;

  return (
    <>
      <main className={styles.page} data-page="product">
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
            <p className={styles.note}>
              {CLAIMS.renders.detail}
            </p>
          </div>

          <div className={styles.decide}>
            <p className={styles.status} data-status={p.status}>
              {STATUS[p.status].name}
            </p>
            <h2 className={styles.heading}>{launch ? "Make this piece yours." : "Keep this piece in mind."}</h2>
            <p className={styles.body}>{STATUS[p.status].detail}</p>
            <p className={styles.quick}>
              {sizeLabel(p.size)} · {CLAIMS.price.label}
            </p>
            <div className={styles.actions}>
              <Link href={routes.contact} className={styles.button}>
                {launch ? "Ask about this piece" : "Register interest"}
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
                    <span>No. {u.record}</span>
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
                  <p className={styles.tileMeta}>
                    <span>No. {a.record}</span>
                  </p>
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

        <section className={styles.section} aria-labelledby="size">
          <h2 id="size" className={styles.label}>
            Size and space
          </h2>
          <div className={styles.content}>
            <div className={styles.drawings}>
              <Elevation across={p.size.w} high={p.size.h} label="Front" scale={scale} />
              <Elevation across={p.size.d} high={p.size.h} label="Side" scale={scale} />
            </div>
            <p className={styles.body}>{CLAIMS.fit.detail}</p>
            {hangs && p.size.h >= STABILITY_HEIGHT && <p className={styles.body}>{CLAIMS.stability.detail}</p>}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="material">
          <h2 id="material" className={styles.label}>
            Material
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>{MATERIALS.body}</p>
            <p className={styles.body}>{MATERIALS.open}</p>
            <p className={styles.body}>{CLAIMS.accent.detail}</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="delivery">
          <h2 id="delivery" className={styles.label}>
            Delivery and assembly
          </h2>
          <div className={styles.content}>
            <p className={styles.body}>{CLAIMS.delivery.detail}</p>
          </div>
        </section>

        {family.length > 0 && (
          <section className={styles.family} aria-labelledby="family">
            <div className={styles.familyHead}>
              <h2 id="family" className={styles.heading}>
                More {FAMILIES[p.family].name.toLowerCase()}.
              </h2>
              <ArrowLink href={routes.products}>All pieces</ArrowLink>
            </div>
            <ProductGrid products={family} />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
