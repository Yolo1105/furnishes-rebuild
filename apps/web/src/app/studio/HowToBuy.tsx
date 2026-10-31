import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./HowToBuy.module.css";

const STEPS: readonly { name: string; line: string }[] = [
  { name: "Choose", line: "A ready-made piece, or a modular one that suits your space." },
  { name: "Adjust, if you want", line: "On a modular piece, change the size, finish and add-ons, and choose built or flat-packed." },
  { name: "Pay", line: `Sign in to buy. Each piece shows its price before you pay. ${shown("paymentMethods")}` },
  { name: "Receive it", line: `Flat-packed in ${shown("leadFlatPack")}, built in ${shown("leadBuilt")}, ready-made in ${shown("leadReadyMade")}.` },
];

/** The things to know before buying. */
const BASICS: readonly { label: string; value: string }[] = [
  { label: "Delivery", value: `${shown("gstTerms")} Every piece is made to order, and custom sizes take ${shown("leadCustomExtra")}.` },
  { label: "Returns", value: `${shown("returnsTerms")} Custom pieces only for faults, damage or a wrong item.` },
  { label: "Warranty", value: shown("warranty") },
  { label: "Assembly", value: `${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.` },
  { label: "Before you order", value: "Measure the spot, above any skirting board, and the way in: the lift, the doors and the corners." },
  { label: "Fixing and moving", value: "Taller pieces may need fixing to the wall. Pieces on wheels can move, within limits we confirm for each one." },
  { label: "Offices and bulk orders", value: shown("officeTerms") },
  { label: "Where it's made", value: "By our partner factory in China, then delivered to you in Singapore." },
  { label: "Help", value: `By email at ${EMAIL}, ${shown("supportHours")}, with a reply within ${shown("replyTime")}. The AI assistant answers any time once you sign in. No phone or live chat.` },
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
      <p className={`${styles.more} reveal`}>
        <ArrowLink href={routes.buyingGuide}>Read the full buying guide</ArrowLink>
      </p>
    </section>
  );
}
