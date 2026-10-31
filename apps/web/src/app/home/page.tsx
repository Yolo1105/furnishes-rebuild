import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import bedsideRender from "@/assets/catalogue/scene/bedside.webp";
import dividerRender from "@/assets/catalogue/scene/divider.webp";
import mobileScreenRender from "@/assets/catalogue/scene/mobile-screen.webp";
import entryRender from "@/assets/render-entry.webp";
import deskRender from "@/assets/render-desk.webp";
import { priceFrom } from "@/features/products/catalogue";
import { READY_MADE } from "@/features/products/readyMade";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import styles from "./home.module.css";

export const metadata: Metadata = { title: { absolute: "Furnishes: furniture for Singapore homes and small offices" }, robots: { index: false } };

/** Where a visitor might start, each leading to the furniture narrowed to it. */
const STARTS: readonly { name: string; line: string; href: string; render: StaticImageData }[] = [
  { name: "By the door", line: "Coats and bags pile up on the chair.", href: `${routes.collection}?use=entryway#find`, render: entryRender },
  { name: "Beside the bed", line: "Phone and book on the floor.", href: `${routes.collection}?use=bedroom#find`, render: bedsideRender },
  { name: "At the desk", line: "Tools and cables take over.", href: `${routes.collection}?use=work#find`, render: deskRender },
  { name: "In a shared room", line: "One room needs to do two jobs.", href: `${routes.collection}?use=dividing#find`, render: dividerRender },
  { name: "In an office", line: "A team that keeps changing shape.", href: `${routes.collection}?use=work#find`, render: mobileScreenRender },
];

/** What the customizable furniture does that ordinary furniture doesn't. */
const STRENGTHS: readonly { name: string; line: string; href: string; render: StaticImageData }[] = [
  {
    name: "Room dividers that fit your room",
    line: "Tall cabinets that split a rented room or a shared one, at the size you need, with shelves on both sides. Usual dividers come in fixed sizes. These don't block sound.",
    href: `${routes.collection}?activity=divide#find`,
    render: dividerRender,
  },
  {
    name: "Cabinets that move",
    line: "Carts and screens on casters, for a counter that follows you or a work area that changes during the week.",
    href: `${routes.collection}?activity=move#find`,
    render: mobileScreenRender,
  },
  {
    name: "Small pieces for one annoying problem",
    line: `A place for your keys, a bedside within reach. Small, simple and ${priceFrom("bedside")}.`,
    href: `${routes.collection}?width=narrow#find`,
    render: bedsideRender,
  },
];

const STEPS: readonly { name: string; line: string }[] = [
  { name: "Choose", line: "Pick a ready-made piece, or a customizable one that suits your space." },
  { name: "Adjust, if you want", line: "Change the size, finish and add-ons within clear limits. It is complete without any of this." },
  { name: "Receive it", line: `Flat-packed in ${shown("leadFlatPack")}, or already built in ${shown("leadBuilt")}.` },
];

const BASICS: readonly { label: string; value: string }[] = [
  { label: "Made in", value: "China, by our partner factory" },
  { label: "Delivered to", value: "Singapore" },
  { label: "Prices", value: `Customizable pieces ${priceFrom("bedside")}` },
  { label: "Support", value: "By email, plus the AI assistant once you sign in" },
];

/** The home: what we sell and the two ways to buy it, where to start, what is different, how it works, help for the unsure, and the basics. */
export default function Home() {
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroWords}>
            <h1 id="home-title">Furniture for Singapore homes and small offices.</h1>
            <p className={styles.lede}>Buy it ready-made, or choose a piece you can adjust to fit your space.</p>
            <div className={styles.calls}>
              <Link href={routes.products} className={styles.button}>
                See the furniture
              </Link>
              <Link href={routes.quiz} className={styles.outline}>
                Find what you need
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image src={entryRender} alt="An entry piece with hooks, a tray and a shoe shelf by a door, a 3D render" fill priority sizes="(max-width: 800px) 100vw, 50vw" placeholder="blur" />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ways-title">
          <h2 id="ways-title">Two ways to buy</h2>
          <div className={styles.ways}>
            <Link href={`${routes.products}#ready-made`} className={styles.way}>
              <h3>Ready-made furniture</h3>
              <p>Sold as it is: {READY_MADE.map((r) => r.name.toLowerCase()).join(", ")}.</p>
            </Link>
            <Link href={`${routes.collection}#find`} className={styles.way}>
              <h3>Customizable furniture</h3>
              <p>Birch panel pieces, complete as they stand. Change the size, finish and add-ons if you want to.</p>
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="starts-title">
          <h2 id="starts-title">Where does it bother you?</h2>
          <ul className={styles.starts}>
            {STARTS.map((s) => (
              <li key={s.name}>
                <Link href={s.href} className={styles.start}>
                  <span className={styles.startImage}>
                    <Image src={s.render} alt="" fill sizes="(max-width: 800px) 50vw, 20vw" placeholder="blur" />
                  </span>
                  <strong>{s.name}</strong>
                  <span>{s.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="strengths-title">
          <h2 id="strengths-title">What it can do</h2>
          <ul className={styles.strengths}>
            {STRENGTHS.map((s) => (
              <li key={s.name} className={styles.strength}>
                <div className={styles.strengthImage}>
                  <Image src={s.render} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" placeholder="blur" />
                </div>
                <h3>{s.name}</h3>
                <p>{s.line}</p>
                <Link href={s.href} className={styles.outline}>
                  See these
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.line}</p>
              </li>
            ))}
          </ol>
          <Link href={routes.howItWorks} className={styles.outline}>
            Read more
          </Link>
        </section>

        <section className={styles.section} aria-labelledby="unsure-title">
          <h2 id="unsure-title">Not sure yet?</h2>
          <ul className={styles.unsure}>
            <li>
              <Link href={routes.quiz}>Work out what you need</Link>
            </li>
            <li>
              <Link href={routes.inspiration}>See ideas for your home</Link>
            </li>
            <li>
              <Link href={routes.studio}>Have us visit your room ({shown("consultPrice")})</Link>
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="basics-title">
          <h2 id="basics-title">The basics</h2>
          <dl className={styles.basics}>
            {BASICS.map((b) => (
              <div key={b.label}>
                <dt className={styles.basicsLabel}>{b.label}</dt>
                <dd>{b.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
