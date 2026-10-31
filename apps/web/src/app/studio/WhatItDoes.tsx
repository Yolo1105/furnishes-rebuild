import Image, { type StaticImageData } from "next/image";
import dividerRender from "@/assets/catalogue/scene/divider.webp";
import mobileScreenRender from "@/assets/catalogue/scene/mobile-screen.webp";
import bedsideRender from "@/assets/catalogue/scene/bedside.webp";
import { priceFrom } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const STRENGTHS: readonly { name: string; line: string; href: string; call: string; render: StaticImageData }[] = [
  {
    name: "Room dividers that fit your room",
    line: "Usual dividers come in fixed sizes. Tall cabinets can split a rented or shared room at the size you need, with shelves on both sides. They hide and store, but they don't block sound. Coming soon.",
    href: `${routes.collection}?activity=divide#find`,
    call: "See the dividers",
    render: dividerRender,
  },
  {
    name: "Cabinets that move",
    line: "Carts and screens on wheels, for a counter that follows you in the kitchen, or a startup's work area that changes with the team. Each comes with its own limits on load and moving. Coming soon.",
    href: `${routes.collection}?activity=move#find`,
    call: "See what moves",
    render: mobileScreenRender,
  },
  {
    name: "Small pieces for one annoying problem",
    line: `Some problems you see every day. Others you only notice once they're gone. A small piece made for just one of them starts ${priceFrom("bedside")}.`,
    href: `${routes.collection}?width=narrow#find`,
    call: "See the small pieces",
    render: bedsideRender,
  },
];

/** The three reasons to choose the customizable line over ordinary furniture. */
export function WhatItDoes() {
  return (
    <section className={styles.section} aria-labelledby="does-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>What it can do</span>
        </p>
        <h2 id="does-title">Three things it's especially good for.</h2>
      </header>
      <ul className={styles.columns}>
        {STRENGTHS.map((s) => (
          <li key={s.name} className={`${styles.point} reveal`}>
            <span className={styles.picture}>
              <Image src={s.render} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" placeholder="blur" />
            </span>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.line}>{s.line}</p>
            <span className={styles.call}>
              <ArrowLink href={s.href}>{s.call}</ArrowLink>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
