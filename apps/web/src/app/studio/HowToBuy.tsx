import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import styles from "./HowToBuy.module.css";

const STEPS: readonly { name: string; line: string }[] = [
  { name: "Choose", line: "A ready-made piece, or a customizable one that suits your space." },
  { name: "Adjust, if you want", line: "On a customizable piece, change the size, finish and add-ons, and choose built or flat-packed." },
  { name: "Pay", line: shown("paymentMethods") },
  { name: "Receive it", line: `Flat-packed in ${shown("leadFlatPack")}, built in ${shown("leadBuilt")}, ready-made in ${shown("leadReadyMade")}.` },
];

/** The things to know before buying. */
const BASICS: readonly { label: string; value: string }[] = [
  { label: "Delivery", value: shown("gstTerms") },
  { label: "Returns", value: `${shown("returnsTerms")} Custom pieces only for faults, damage or a wrong item.` },
  { label: "Warranty", value: shown("warranty") },
  { label: "Assembly", value: `${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.` },
  { label: "Made", value: "From birch panels and fittings, by our partner factory in China." },
  { label: "Help", value: `By email at ${EMAIL}, and the AI assistant once you sign in. No phone or live chat.` },
];

/** How buying works, step by step, then the basics. */
export function HowToBuy() {
  return (
    <section className={styles.buy} aria-labelledby="buy-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>How to buy</span>
        </p>
        <h2 id="buy-title">From choosing to your door.</h2>
      </header>
      <ol className={`${styles.steps} reveal`}>
        {STEPS.map((s, i) => (
          <li key={s.name}>
            <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.line}>{s.line}</p>
          </li>
        ))}
      </ol>
      <dl className={`${styles.basics} reveal`}>
        {BASICS.map((b) => (
          <div key={b.label} className={styles.basic}>
            <dt className={styles.label}>{b.label}</dt>
            <dd>{b.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
