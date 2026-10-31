import Image from "next/image";
import Link from "next/link";
import { ARRANGEMENTS } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import sections from "../products/sections.module.css";
import { ACTIONS, BEFORE_AFTER, PROBLEMS, REVEALS } from "./ideaList";
import styles from "./Ideas.module.css";

/**
 * After the sheets: find a need (by room and problem, or by what you want to
 * do), then needs you may not have noticed, then bigger ideas, marked as
 * concepts because they aren't sold as they stand.
 */
export function Ideas() {
  return (
    <div className={styles.ideas}>
      <section className={sections.section} aria-labelledby="find-title">
        <div className={sections.sectionHead}>
          <h2 id="find-title" className={sections.sectionTitle}>
            What bothers you?
          </h2>
          <p className={sections.sectionAside}>Find your problem, and see the piece that answers it.</p>
        </div>
        <ul className={styles.rooms}>
          {PROBLEMS.filter((r) => r.items.length > 0).map((r) => (
            <li key={r.use}>
              <h3 className={sections.useName}>{r.room}</h3>
              <ul className={styles.problems}>
                {r.items.map((item) => (
                  <li key={item.line}>
                    <Link href={`${routes.products}/${item.id}`}>{item.line}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <nav className={styles.actions} aria-label="By what you want to do">
          {ACTIONS.map((a) => (
            <Link key={a.id} href={`${routes.collection}?activity=${a.id}#find`} className={sections.pillOutline}>
              {a.name}
            </Link>
          ))}
        </nav>
      </section>

      <section className={sections.section} aria-labelledby="reveal-title">
        <div className={sections.sectionHead}>
          <h2 id="reveal-title" className={sections.sectionTitle}>
            Now, and what could be
          </h2>
          <p className={sections.sectionAside}>Things you may have stopped noticing. The pictures are 3D renders.</p>
        </div>
        <ul className={sections.uses}>
          {REVEALS.map((r) => (
            <li key={r.id} className={sections.use}>
              <div className={sections.useImage}>
                <Image src={r.product.room} alt="" fill sizes="(max-width: 700px) 70vw, 22vw" />
              </div>
              <h3 className={sections.useName}>{r.title}</h3>
              <p className={sections.useLine}>Now: {r.now}</p>
              <p className={sections.useLine}>Could be: {r.could}</p>
              <Link href={`${routes.products}/${r.id}`} className={sections.useNote}>
                {r.product.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={sections.section} aria-labelledby="swaps-title">
        <div className={sections.sectionHead}>
          <h2 id="swaps-title" className={sections.sectionTitle}>
            Before and after
          </h2>
          <p className={sections.sectionAside}>The same room, from the same spot. Both pictures are 3D renders, not photographs.</p>
        </div>
        <ul className={styles.swaps}>
          {BEFORE_AFTER.map((s) => (
            <li key={s.id}>
              <div className={styles.pair}>
                <Image src={s.before} alt={`Before: ${s.line}, a 3D render`} sizes="(max-width: 700px) 50vw, 22vw" placeholder="blur" />
                <Image src={s.after} alt={`After: ${s.name}, a 3D render`} sizes="(max-width: 700px) 50vw, 22vw" placeholder="blur" />
              </div>
              <p className={sections.useLine}>{s.line}</p>
              <Link href={`${routes.products}/${s.id}`} className={sections.useNote}>
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={sections.section} aria-labelledby="bigger-title">
        <div className={sections.sectionHead}>
          <h2 id="bigger-title" className={sections.sectionTitle}>
            Bigger ideas
          </h2>
          <p className={sections.sectionAside}>Pieces standing together. These are concepts, with no price of their own.</p>
        </div>
        <ul className={sections.uses}>
          {ARRANGEMENTS.map((a) => (
            <li key={a.id} className={sections.use}>
              <div className={sections.useImage}>
                <Image src={a.image} alt="" fill sizes="(max-width: 700px) 70vw, 22vw" />
              </div>
              <h3 className={sections.useName}>{a.name}</h3>
              <p className={sections.useNote}>Concept</p>
              <p className={sections.useLine}>{a.line}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
