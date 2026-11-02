import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { priceFrom } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import { BEFORE_AFTER, CASES, GUIDE, PLACES, PROBLEMS } from "./ideaList";
import { ProjectSheets } from "./ProjectSheets";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Inspiration", description: "Everyday room problems in Singapore homes, and ideas for what furniture can do about them." };

/** Inspiration: the ideas as sheets (plan first, mood photo second), everyday cases, before and after, finding your problem, and where the furniture is used. */
export default function Inspiration() {
  return (
    <>
      <main id="main">
        <Section id="ideas">
          <SectionHead
            as="h1"
            id="ideas"
            eyebrow="Inspiration"
            title="Ideas for your home."
            lede="Ideas, not finished jobs. Each sheet shows a room on an HDB plan, with what could go there, then a mood photo."
            action={
              <p>
                <Button variant="link" href={routes.products}>
                  See the furniture →
                </Button>
              </p>
            }
          />
          <ProjectSheets />
        </Section>

        <Section id="cases" tone="linen">
          <SectionHead id="cases" eyebrow="Everyday cases" title="Where it helps, day to day." lede="Corners you may have stopped noticing, and the piece that answers each. The pictures are 3D renders." />
          <ul className="span-12 subgrid">
            {CASES.map((c) => (
              <li key={c.piece} className="span-3 md:span-6">
                <article className="card">
                  <div className="card-media">
                    <Image src={c.product.room} alt={`${c.product.name} in a room; a 3D render`} fill placeholder="blur" sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" />
                  </div>
                  <p className="card-row">
                    <span className="eyebrow">{c.kind}</span>
                    <span className="price">{priceFrom(c.piece)}</span>
                  </p>
                  <h3 className="card-title">
                    <Link href={`${routes.products}/${c.piece}`}>{c.title}</Link>
                  </h3>
                  <p className="meta">{c.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="before-after">
          <SectionHead id="before-after" title="The same room, one piece later." lede="Both pictures are 3D renders from the same spot, not photographs of customers' homes." />
          <ul className="span-12 subgrid">
            {BEFORE_AFTER.map((s) => (
              <li key={s.id} className="span-4 md:span-6 card">
                <div className="subgrid">
                  <div className="span-6 md:span-6 media-square">
                    <Image src={s.before} alt={`Before: ${s.line} A 3D render`} fill placeholder="blur" sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 17vw" />
                  </div>
                  <div className="span-6 md:span-6 media-square">
                    <Image src={s.after} alt={`After: the ${s.name}. A 3D render`} fill placeholder="blur" sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 17vw" />
                  </div>
                </div>
                <p>{s.line}</p>
                <p className={styles.link}>
                  <Link href={`${routes.products}/${s.id}`}>{s.name}</Link>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="problems" tone="linen">
          <SectionHead
            id="problems"
            title="Start from what bothers you."
            lede="Find the problem that sounds most like yours, and see the piece that answers it."
            action={
              <p>
                <Button variant="link" href={routes.quiz}>
                  Not sure? Answer a few questions →
                </Button>
              </p>
            }
          />
          <div className="span-12 subgrid">
            {PROBLEMS.map((r) => (
              <div key={r.use} className="span-4 md:span-6">
                <h3>{r.room}</h3>
                <ul className={`ruled ${styles.problems}`}>
                  {r.items.map((item) => (
                    <li key={item.line}>
                      <Link href={item.href}>{item.line}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="answers">
          <SectionHead id="answers" title="Or choose by the answer you want." />
          <Steps
            numbered={false}
            steps={GUIDE.map((g) => ({
              title: g.title,
              body: g.body,
              action: (
                <Button variant="link" href={g.href}>
                  {g.call} →
                </Button>
              ),
            }))}
          />
        </Section>

        <Section id="places" tone="linen">
          <SectionHead id="places" eyebrow="Where you'll use it" title="Made for small spaces that change." />
          <ul className="span-12 subgrid">
            {PLACES.map((p) => (
              <li key={p.name} className="span-4">
                <article className="card">
                  <div className="card-media">
                    <Image src={p.render} alt={p.alt} fill placeholder="blur" sizes="(max-width: 1023px) 100vw, 33vw" />
                  </div>
                  <h3 className="card-title">
                    <Link href={p.href}>{p.name}</Link>
                  </h3>
                  <p className="meta">{p.line}</p>
                  <ul className="ruled">
                    {p.points.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
