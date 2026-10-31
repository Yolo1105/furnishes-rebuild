import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const PAGES: readonly { name: string; line: string; href: string; call: string }[] = [
  { name: "Why modular", line: "Why build from parts, the parts each piece takes, what else they can become, and what you can change.", href: routes.whyModular, call: "Read about modular" },
  { name: "Buying guide", line: "What to measure, building it yourself, how long it takes, life after buying, the AI assistant and every question.", href: routes.buyingGuide, call: "Read the guide" },
  { name: "Ideas", line: "Everyday problems you may have stopped noticing, and the same room before and after a piece.", href: routes.inspiration, call: "See the ideas" },
  { name: "Your kind of space", line: "What to think about in an HDB flat, and in a rented or shared room. Startup offices have their own page too.", href: routes.hdbHomes, call: "HDB homes" },
];

/** The landing page's way on to the detail, for anyone who wants all of it. */
export function ReadMore() {
  return (
    <section className={styles.section} aria-labelledby="more-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Want the detail?</span>
        </p>
        <h2 id="more-title">Read more before you decide.</h2>
      </header>
      <ul className={`${styles.columns} ${styles.four}`}>
        {PAGES.map((p) => (
          <li key={p.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{p.name}</h3>
            <p className={styles.line}>{p.line}</p>
            <span className={styles.call}>
              <ArrowLink href={p.href}>{p.call}</ArrowLink>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
