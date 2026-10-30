import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import { QUESTIONS } from "./faqs";
import styles from "./Questions.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The questions, after the journal: the index, headline, a promise and a
 * call on the left; on the right a ruled list, each question opening to its
 * answer (the first open), a plus turning to a cross while it is.
 */
export function Questions() {
  return (
    <section className={styles.questions} aria-labelledby="questions-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>A-800</span>
          <span>Questions</span>
        </p>
        <h2 id="questions-title" className={styles.title}>
          Questions
        </h2>
        <p className={styles.promise}>We answer inside one business day.</p>
        <ArrowLink href={routes.contact}>Start a project</ArrowLink>
      </header>
      <div className={styles.list}>
        {QUESTIONS.map((q, i) => (
          <details key={q.question} className={`${styles.item} reveal`} open={i === 0}>
            <summary className={styles.summary}>
              <span className={styles.code}>Q-{pad(i + 1)}</span>
              <span className={styles.question}>{q.question}</span>
              <span className={styles.mark} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{q.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
