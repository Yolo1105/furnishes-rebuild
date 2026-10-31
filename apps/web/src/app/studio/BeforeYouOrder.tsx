import styles from "./Details.module.css";

const MEASURE: readonly { name: string; line: string }[] = [
  { name: "Where it will stand", line: "The width, depth and height of the spot, above any skirting board. Note switches, sockets and windows." },
  { name: "How it gets there", line: "The lift, stairs, doors and corners on the way in. A room can have space for a piece that can't reach it." },
  { name: "Room to use it", line: "Space to build it, open its doors and drawers, pull out a chair and walk past." },
];

const INCLUDED = ["The piece in the version you chose", "Its supports and fixings", "The add-ons you picked", "Delivery in Singapore and GST"];
const NOT_INCLUDED = ["Lamps, books, plants and other objects in the pictures", "Desks, chairs and rooms shown around a piece", "Moving your own furniture, or work on your walls", "Installation, unless you add it"];

/** What to measure, then what an order does and doesn't hold. */
export function BeforeYouOrder() {
  return (
    <section className={styles.section} aria-labelledby="before-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Before you order</span>
        </p>
        <h2 id="before-title">Measure three things.</h2>
        <p className={styles.lede}>A photo of your room helps compare ideas, but it can't confirm a fit. Tight spots and bigger pieces may need more checking first.</p>
      </header>
      <ol className={styles.columns}>
        {MEASURE.map((m) => (
          <li key={m.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{m.name}</h3>
            <p className={styles.line}>{m.line}</p>
          </li>
        ))}
      </ol>
      <div className={`${styles.columns} ${styles.two}`}>
        <div className={`${styles.point} reveal`}>
          <h3 className={styles.name}>In your order</h3>
          <ul className={`${styles.line} ${styles.list}`}>
            {INCLUDED.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
        <div className={`${styles.point} reveal`}>
          <h3 className={styles.name}>Not in your order</h3>
          <ul className={`${styles.line} ${styles.list}`}>
            {NOT_INCLUDED.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
