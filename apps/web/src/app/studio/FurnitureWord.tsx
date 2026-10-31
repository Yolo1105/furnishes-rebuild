import { Raleway } from "next/font/google";
import { priceFrom } from "@/lib/facts";
import styles from "./FurnitureWord.module.css";

// The word's face, and nothing else's.
const raleway = Raleway({ subsets: ["latin"], weight: "variable", variable: "--font-raleway", display: "swap" });

/**
 * "Furniture" across the plan's side, broken by its tall "i": "Furn" over a
 * line set to the right on the left, a line over "ture" on the right.
 */
export function FurnitureWord() {
  return (
    <div className={`${styles.word} ${raleway.variable}`}>
      <h2 id="flat-name" className="visually-hidden">
        Furniture
      </h2>
      <span className={styles.furn} aria-hidden="true">
        F<span className={styles.orange}>u</span>rn
      </span>
      <p className={styles.leftLine}>
        Ready-made, or
        <br />
        sized to your space.
      </p>
      <span className={styles.tallI} aria-hidden="true" />
      <p className={styles.rightLine}>
        Made by our partner factory, delivered in Singapore.
        <br />
        Modular pieces {priceFrom("bedside")}, delivery and GST included.
      </p>
      <span className={styles.ture} aria-hidden="true">
        tu<span className={styles.orange}>r</span>e
      </span>
      <span className={styles.dot} aria-hidden="true">
        ·
      </span>
      <span className={styles.room} aria-hidden="true">
        Inte<span className={styles.orange}>r</span>ior
      </span>
      {/* <span className={styles.interior} aria-hidden="true">
        Meet <span className={styles.orange}>Eva</span>,
        <br />
        your personal AI
        <br />
        interior consultant
      </span> */}
    </div>
  );
}
