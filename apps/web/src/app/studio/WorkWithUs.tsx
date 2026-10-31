import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const WHO: readonly { name: string; line: string }[] = [
  { name: "Designers and space planners", line: "Tell us about a client's room, and use our pieces in your plan." },
  { name: "Shops", line: "Stock our furniture, or show a piece and send customers on to us." },
  { name: "Studios and shared spaces", line: "Have a piece in real use where people can see it, touch the materials and try both sides." },
];

/** An opening for partners. No terms yet: each is talked through one by one. */
export function WorkWithUs() {
  return (
    <section className={styles.section} aria-labelledby="work-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Work with us</span>
        </p>
        <h2 id="work-title">Show it, recommend it, or sell it.</h2>
        <p className={styles.lede}>We're starting small and talk through each arrangement one by one.</p>
      </header>
      <ul className={styles.columns}>
        {WHO.map((w) => (
          <li key={w.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{w.name}</h3>
            <p className={styles.line}>{w.line}</p>
          </li>
        ))}
      </ul>
      <p className={`${styles.call} ${styles.foot} reveal`}>
        <ArrowLink href={routes.contact}>Talk to us</ArrowLink>
      </p>
    </section>
  );
}
