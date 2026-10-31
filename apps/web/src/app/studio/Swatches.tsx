import Image from "next/image";
import Link from "next/link";
import { contactHref } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import { SWATCH_HEADLINE, SWATCH_LINE, SWATCHES } from "./swatchList";
import styles from "./Swatches.module.css";

/**
 * The swatches, after the makers: the headline (its second line softer), a
 * line and two calls on the left; on the right the six samples, three to a
 * row, each its texture over its name.
 */
export function Swatches() {
  return (
    <section className={styles.swatches} aria-labelledby="swatches-title">
      <div className="reveal">
        <p className={styles.index}>
          <span>Swatches</span>
        </p>
        <h2 id="swatches-title" className={styles.title}>
          <span className={styles.lead}>{SWATCH_HEADLINE.lead}</span>
          <span className={styles.soft}>{SWATCH_HEADLINE.soft}</span>
        </h2>
        <p className={styles.line}>{SWATCH_LINE}</p>
        <div className={styles.calls}>
          <Link href={contactHref("product")} className={styles.button}>
            Ask for samples
          </Link>
          <ArrowLink href={contactHref("visit")}>Book a visit</ArrowLink>
        </div>
      </div>
      <ul className={styles.grid}>
        {SWATCHES.map((s) => (
          <li key={s.name} className="reveal">
            <div className={`${styles.sample} ${styles[s.texture]}`}>
              {s.photo && <Image className={styles.photo} src={s.photo} alt="" fill sizes="(max-width: 900px) 33vw, 16vw" />}
            </div>
            <p className={styles.name}>{s.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
