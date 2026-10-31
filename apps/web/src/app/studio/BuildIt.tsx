import { shown } from "@/lib/facts";
import styles from "./Details.module.css";

const STEPS: readonly { name: string; line: string }[] = [
  { name: "Before you open the boxes", line: "Check how many boxes came. Clear enough floor to lay out the parts, and leave room to stand the piece up." },
  { name: "Find your parts", line: "Follow the steps for your version, in order. Start with the base, so the piece is stable before anything is added." },
  { name: "Heavy parts", line: "Get a second person for tall or heavy parts. Don't leave a part standing unsupported partway through." },
  { name: "When it's finished", line: "Check the fixings, the doors and drawers, and any wheel locks. Then read its limits before you load it." },
  { name: "If something's wrong", line: "Stop, and don't force a part or widen a hole. Send us your order number and a photo." },
  { name: "If you'd rather not", line: `Choose it already built, or add installation. ${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.` },
];

/** What to expect when building a flat-packed piece. */
export function BuildIt() {
  return (
    <section className={styles.section} aria-labelledby="build-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Building it yourself</span>
        </p>
        <h2 id="build-title">If it comes flat-packed.</h2>
      </header>
      <ul className={styles.columns}>
        {STEPS.map((s) => (
          <li key={s.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{s.name}</h3>
            <p className={styles.line}>{s.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
