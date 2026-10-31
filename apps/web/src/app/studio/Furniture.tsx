import Image from "next/image";
import Link from "next/link";
import { priceFrom, productById, STATUS } from "@/features/products/catalogue";
import { READY_MADE } from "@/features/products/readyMade";
import { routes } from "@/lib/routes";
import { productHref } from "../products/productHref";
import styles from "./Furniture.module.css";

/** The customizable pieces shown first, by catalogue id, named for where they go. */
const PIECES = [
  { id: "bedside", name: "Beside the bed" },
  { id: "entry", name: "By the door" },
  { id: "desk", name: "Beside the desk" },
  { id: "divider", name: "To divide a room" },
] as const;

/** What we sell, straight after the tour: the customizable pieces, then the ready-made kinds, each with its price. */
export function Furniture() {
  return (
    <section className={styles.furniture} aria-labelledby="furniture-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>The furniture</span>
        </p>
        <h2 id="furniture-title">Two ways to buy.</h2>
      </header>
      <div className={styles.lines}>
        <div className={`${styles.line} reveal`}>
          <h3 className={styles.name}>Customizable</h3>
          <p className={styles.about}>Birch panel pieces, complete as they stand. Change the size, finish and add-ons if you want to.</p>
          <ul className={styles.pieces}>
            {PIECES.map(({ id, name }) => (
              <li key={id}>
                <Link href={productHref(id) ?? routes.collection} className={styles.piece}>
                  <span className={styles.picture}>
                    <Image src={productById(id)!.room} alt="" fill sizes="(max-width: 800px) 50vw, 25vw" placeholder="blur" />
                  </span>
                  <span className={styles.pieceName}>{name}</span>
                  <span className={styles.price}>
                    {priceFrom(id)}
                    {productById(id)!.status === "soon" && `, ${STATUS.soon.name.toLowerCase()}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${routes.collection}#find`} className={styles.call}>
            See all customizable
          </Link>
        </div>
        <div className={`${styles.line} reveal`}>
          <h3 className={styles.name}>Ready-made</h3>
          <p className={styles.about}>Finished furniture from the same factory, sold as it is, for a home or a whole office.</p>
          <ul className={styles.kinds}>
            {READY_MADE.map((r) => (
              <li key={r.name} className={styles.kind}>
                <span>{r.name}</span>
                <span className={styles.price}>{r.range}</span>
              </li>
            ))}
          </ul>
          <Link href={`${routes.products}#ready-made`} className={styles.call}>
            See all ready-made
          </Link>
        </div>
      </div>
    </section>
  );
}
