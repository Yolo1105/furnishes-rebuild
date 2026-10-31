import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import styles from "./Details.module.css";

const AFTER: readonly { name: string; line: string }[] = [
  { name: "When it arrives", line: "Check the boxes and parts. If something is damaged or missing, send us your order number and photos before going further." },
  { name: "Using it", line: "Hooks aren't for climbing, and tops aren't seats unless a piece says so. Wheels need the piece cleared and a clear path. Each piece's guide gives its own limits." },
  { name: "Cleaning", line: shown("careGuide") },
  { name: "Weight and tipping", line: `${shown("weightLimits")} ${shown("stability")}` },
  { name: "Adding to it", line: "We check your order first, then tell you what stays, what's new and what comes off, before you pay. It needn't mean replacing the whole piece." },
  { name: "If a part breaks", line: `Send a photo with your order number. We check whether that part can be replaced alone. ${shown("replacementParts")}` },
  { name: "Moving home", line: "How a piece comes apart depends on the piece. We check its parts and the new spot with you, and it may need arranging differently there." },
  { name: "Buying back", line: "Buy-back, recycling and trade-in aren't part of a purchase for now. If that changes, the piece's page will say so." },
  { name: "Who to ask", line: `Email ${EMAIL} with your order number or a photo. You don't need to know any part names.` },
];

/** What happens once the furniture is home. */
export function AfterYouBuy() {
  return (
    <section className={styles.section} aria-labelledby="after-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>After you buy</span>
        </p>
        <h2 id="after-title">When life changes, it can too.</h2>
        <p className={styles.lede}>A piece should be worth buying even if it never changes. Being able to add to it later is a bonus, and not every part fits every piece.</p>
      </header>
      <ul className={styles.columns}>
        {AFTER.map((a) => (
          <li key={a.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{a.name}</h3>
            <p className={styles.line}>{a.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
