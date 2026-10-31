import { PART_MATERIALS } from "@/features/products/catalogue";
import { shown } from "@/lib/facts";
import { contactHref } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Customize.module.css";

/** What can change on a customizable piece, and what each costs and adds to the wait. */
const OPTIONS: readonly { name: string; what: string; cost: string }[] = [
  { name: "Built or flat-packed", what: "Flat-packed comes with its steps. Built arrives put together, though large pieces may be finished at your home.", cost: "Each piece shows both prices" },
  { name: "Size", what: "Height in steps of 40 cm up to 160 cm. Width of 60, 120 or 180 cm.", cost: `${shown("customSizePrice")}, and ${shown("leadCustomExtra")}` },
  { name: "Finish", what: "White matte faces and birch edges to start with. A special colour on request.", cost: shown("specialColourPrice") },
  { name: "Add-ons", what: "Doors, drawers, a desk top, casters and other parts that are checked to fit. You can add them later too.", cost: shown("addOnPrices") },
  { name: "Installation", what: "We put it together in your home if you'd rather not.", cost: shown("installPrice") },
];

/** What a customizable piece can change, what each costs, and what it is made of. */
export function Customize() {
  return (
    <section className={styles.customize} aria-labelledby="customize-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Customizing</span>
        </p>
        <h2 id="customize-title">Complete as it is. Yours if you want.</h2>
        <p className={styles.lede}>No piece needs changing. These are the changes you can make, and what each one costs. Ready-made furniture is sold as it is.</p>
      </header>
      <div className={styles.columns}>
        <div className="reveal">
          <h3 className={styles.heading}>What you can change</h3>
          <dl className={styles.options}>
            {OPTIONS.map((o) => (
              <div key={o.name} className={styles.option}>
                <dt className={styles.name}>{o.name}</dt>
                <dd className={styles.what}>{o.what}</dd>
                <dd className={styles.cost}>{o.cost}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.note}>Anything outside these limits goes to our team for a review and a quote.</p>
          <ArrowLink href={contactHref("custom")}>Ask about a custom piece</ArrowLink>
        </div>
        <div className="reveal">
          <h3 className={styles.heading}>What it's made of</h3>
          <dl className={styles.options}>
            {PART_MATERIALS.map((m) => (
              <div key={m.material} className={styles.material}>
                <dt className={styles.name}>{m.material}</dt>
                <dd className={styles.what}>{m.parts}</dd>
              </div>
            ))}
            <div className={styles.material}>
              <dt className={styles.name}>Weight limits</dt>
              <dd className={styles.what}>{shown("weightLimits")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
