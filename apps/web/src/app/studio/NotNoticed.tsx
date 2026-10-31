import Link from "next/link";
import { routes } from "@/lib/routes";
import { REVEALS } from "../inspiration/ideaList";
import { productHref } from "../products/productHref";
import styles from "./Details.module.css";

/** Needs people may not have noticed: how a corner is now, and what it could be. */
export function NotNoticed() {
  return (
    <section className={styles.section} aria-labelledby="noticed-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Things you stop noticing</span>
        </p>
        <h2 id="noticed-title">You may have got used to these.</h2>
      </header>
      <ul className={`${styles.columns} ${styles.four}`}>
        {REVEALS.map((r) => (
          <li key={r.id} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{r.title}</h3>
            <p className={styles.line}>{r.now}</p>
            <p className={styles.line}>{r.could}</p>
            <Link className={`${styles.link} ${styles.call}`} href={productHref(r.id) ?? routes.collection}>
              {r.product.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
