import Image from "next/image";
import Link from "next/link";
import { priceFrom, productById, STATUS } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { productHref } from "../products/productHref";
import { CASES } from "./cases";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./CaseSheets.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The everyday cases, after the tour, set out like the sheets of a drawing
 * set: an index line and the title over them, then a card for each: its room's
 * photo on top, its kind, what it runs between, its headline and words, and its
 * sheet number and call, a link to its piece with its price, at the foot.
 */
export function CaseSheets() {
  return (
    <section className={styles.cases} aria-labelledby="cases-title">
      <header className="reveal">
        <p className={styles.index}>
          <span>Everyday cases</span>
          <span className={styles.count}>{pad(CASES.length)} cases</span>
        </p>
        <h2 id="cases-title" className={styles.heading}>
          Everyday cases
        </h2>
      </header>
      <ol className={styles.sheets}>
        {CASES.map((c, i) => {
          const photo = ROOM_PHOTOS.find((p) => p.room === c.room);
          return (
            <li key={c.kind} className={`${styles.sheet} reveal`}>
              {photo && (
                <div className={styles.picture}>
                  <Image
                    className={styles.photo}
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    placeholder="blur"
                  />
                </div>
              )}
              <p className={styles.kind}>{c.kind}</p>
              <p className={styles.span}>{c.span}</p>
              <h3 className={styles.title}>{c.title}</h3>
              <p className={styles.body}>{c.body}</p>
              <footer className={styles.foot}>
                <span>{pad(i + 1)}</span>
                <Link href={productHref(c.piece) ?? routes.collection}>
                  {productById(c.piece)?.status === "soon" ? STATUS.soon.name : "See it"}, {priceFrom(c.piece)}
                </Link>
              </footer>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
