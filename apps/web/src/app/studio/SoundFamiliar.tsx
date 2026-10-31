"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { STATUS, priceFrom, productById, sizeLabel } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { PROBLEMS } from "../inspiration/ideaList";
import { productHref } from "../products/productHref";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

/** A quick guide for someone who knows the kind of answer they want. */
const GUIDE: readonly { want: string; choose: string; href: string }[] = [
  { want: "One small thing bothers you", choose: "A small modular piece", href: `${routes.collection}?width=narrow#find` },
  { want: "Standard sizes don't fit the spot", choose: "A modular piece, sized in steps", href: `${routes.collection}#find` },
  { want: "One room has to do two jobs", choose: "A room divider or two-sided shelf", href: `${routes.collection}?use=dividing#find` },
  { want: "Your layout keeps changing", choose: "Something on wheels", href: `${routes.collection}?activity=move#find` },
  { want: "A standard size is all you need", choose: "Ready-made furniture", href: `${routes.products}#ready-made` },
];

/** Explore by what bothers you: pick a room, then a problem, and see the piece that answers it. */
export function SoundFamiliar() {
  const [use, setUse] = useState(PROBLEMS[0]!.use);
  const room = PROBLEMS.find((p) => p.use === use)!;
  const [picked, setPicked] = useState(room.items[0]!.line);
  const item = room.items.find((i) => i.line === picked) ?? room.items[0]!;
  const product = productById(item.id)!;

  return (
    <section className={styles.section} aria-labelledby="familiar-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Start from the problem</span>
        </p>
        <h2 id="familiar-title">What's bothering you?</h2>
        <p className={styles.lede}>Pick a part of your home, then the problem that sounds most like yours, to see what we'd suggest and what to check.</p>
      </header>
      <div className={`${styles.tabs} reveal`}>
        {PROBLEMS.map((p) => (
          <button key={p.use} type="button" aria-pressed={p.use === use} className={p.use === use ? "caps button" : "caps button-outline"} onClick={() => setUse(p.use)}>
            {p.room}
          </button>
        ))}
      </div>
      <div className={`${styles.explorer} reveal`}>
        <ul className={styles.problems}>
          {room.items.map((i) => (
            <li key={i.line}>
              <button type="button" aria-pressed={i === item} className={styles.problem} onClick={() => setPicked(i.line)}>
                {i.line}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.answer} aria-live="polite">
          <span className={styles.picture}>
            <Image src={product.room} alt="" fill sizes="(max-width: 700px) 100vw, 40vw" placeholder="blur" />
          </span>
          <div className={styles.point}>
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.line}>{product.line}</p>
            <p className={styles.line}>
              {STATUS[product.status].name}, {priceFrom(product.id)}, {sizeLabel(product.size)}.
            </p>
            {product.notes.map((n) => (
              <p key={n} className={styles.line}>
                {n}
              </p>
            ))}
            <p className={styles.line}>{product.scene}</p>
            <span className={styles.call}>
              <ArrowLink href={productHref(product.id) ?? routes.collection}>See this piece</ArrowLink>
            </span>
          </div>
        </div>
      </div>
      <h3 className={`${styles.name} ${styles.foot} reveal`}>Or choose by the kind of answer you want</h3>
      <dl className={`${styles.guide} reveal`}>
        {GUIDE.map((g) => (
          <div key={g.want}>
            <dt className={styles.line}>If {g.want.charAt(0).toLowerCase() + g.want.slice(1)}:</dt>
            <dd>
              <Link className={styles.link} href={g.href}>
                {g.choose}
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <p className={`${styles.line} ${styles.foot} reveal`}>
        Still can't say what you want? <Link className={styles.link} href={routes.quiz}>Answer a few questions</Link> and we'll help you work it out.
      </p>
    </section>
  );
}
