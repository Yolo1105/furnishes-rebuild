import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BEFORE_AFTER } from "../inspiration/ideaList";
import styles from "./Details.module.css";

/** The same room before and after a piece. */
export function BeforeAfter() {
  return (
    <section className={styles.section} aria-labelledby="swap-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Before and after</span>
        </p>
        <h2 id="swap-title">The same room, one piece later.</h2>
        <p className={styles.lede}>These are 3D renders, not photographs of customers' homes.</p>
      </header>
      <ul className={styles.columns}>
        {BEFORE_AFTER.map((s) => (
          <li key={s.id} className={`${styles.point} reveal`}>
            <div className={styles.pair}>
              <Image src={s.before} alt={`Before: ${s.line}, a 3D render`} sizes="(max-width: 700px) 50vw, 17vw" placeholder="blur" />
              <Image src={s.after} alt={`After: ${s.name}, a 3D render`} sizes="(max-width: 700px) 50vw, 17vw" placeholder="blur" />
            </div>
            <p className={styles.line}>{s.line}</p>
            <Link className={styles.link} href={`${routes.products}/${s.id}`}>
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
