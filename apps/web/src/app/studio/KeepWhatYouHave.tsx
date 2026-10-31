import styles from "./Details.module.css";

const WAYS: readonly { name: string; line: string }[] = [
  { name: "Add one piece", line: "Keep the desk, bed or shoe cabinet that works. Add the hanging, storage or work surface it lacks, right beside it." },
  { name: "Do a whole corner", line: "If you want a bigger change, a whole area can be arranged again. Buying less isn't a rule, and buying more doesn't make it better." },
  { name: "Beside, not attached", line: "Our pieces stand on their own, and aren't meant to lean on your old furniture. A version clamps or connects only if its page says so." },
];

/** Starting from the furniture someone already has. */
export function KeepWhatYouHave() {
  return (
    <section className={styles.section} aria-labelledby="keep-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>What you already own</span>
        </p>
        <h2 id="keep-title">Keep what you already like.</h2>
        <p className={styles.lede}>Your table, bed, cabinets and collections are part of the home. Who uses the space, where things are kept, and how much you want to change all decide the answer.</p>
      </header>
      <ul className={styles.columns}>
        {WAYS.map((w) => (
          <li key={w.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{w.name}</h3>
            <p className={styles.line}>{w.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
