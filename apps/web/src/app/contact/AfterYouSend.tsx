import { Dimension } from "../studio/Dimension";
import { AFTER } from "./inquiryCopy";
import styles from "./AfterYouSend.module.css";

/**
 * What happens once the inquiry is sent: the steps across in a row, the time
 * from each to the next dimensioned over it in orange, as on a drawing.
 */
export function AfterYouSend() {
  return (
    <section className={styles.after} aria-labelledby="after-title">
      <p className={styles.index}>
        <span>A-920</span>
        <span>After you send</span>
      </p>
      <h2 id="after-title" className={styles.title}>
        After you send
      </h2>
      <ol className={styles.steps}>
        {AFTER.map((s) => (
          <li key={s.title} className={`${styles.step} reveal`}>
            <span className={styles.span}>{s.until && <Dimension label={s.until} />}</span>
            <h3 className={styles.name}>{s.title}</h3>
            <p className={styles.line}>{s.line}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
