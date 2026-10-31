"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/features/products/ProductCard";
import { contactHref, routes } from "@/lib/routes";
import inquiry from "../contact/Inquiry.module.css";
import { match, notes, type QuizAnswers } from "./match";
import { type QuizGroup, QUIZ_STEPS } from "./quizCopy";
import styles from "./Quiz.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

const RESULTS = QUIZ_STEPS.length;

/**
 * The quiz, set out like the enquiry: the steps on the left, every one open to
 * go back to, the question on the right. Any step can be skipped. The last
 * step is the results, which follow any answer changed from there.
 */
export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const pick = (g: QuizGroup, id: string) =>
    setAnswers((a) => {
      const now = a[g.id] ?? [];
      if (g.many) return { ...a, [g.id]: now.includes(id) ? now.filter((x) => x !== id) : [...now, id] };
      return { ...a, [g.id]: now.includes(id) ? [] : [id] };
    });

  const current = QUIZ_STEPS[step];
  const results = match(answers);
  const told = notes(answers);
  const office = answers.where?.[0] === "office";

  return (
    <section className={inquiry.inquiry} aria-labelledby="quiz-step">
      <aside className={inquiry.side}>
        <p className={inquiry.index}>
          <span>Quiz</span>
        </p>
        <ol className={inquiry.steps}>
          {[...QUIZ_STEPS.map((s) => s.name), "Results"].map((name, i) => (
            <li key={name} className={inquiry.step} aria-current={i === step ? "step" : undefined}>
              <button type="button" className={inquiry.stepButton} disabled={i === step} onClick={() => setStep(i)}>
                <span className={inquiry.code}>{pad(i + 1)}</span>
                {name}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <div className={inquiry.frame}>
        <h2 id="quiz-step" className={inquiry.title}>
          {current ? current.title : results.length > 0 ? "These could work." : "Nothing fits all of that yet."}
        </h2>

        {current ? (
          current.groups.map((g) => (
            <fieldset key={g.id} className={styles.group}>
              <legend className={inquiry.lede}>{g.ask}</legend>
              <div className={inquiry.cards}>
                {g.options.map((o) => (
                  <label key={o.id} className={inquiry.card}>
                    <input
                      type={g.many ? "checkbox" : "radio"}
                      name={g.id}
                      className={g.many ? inquiry.check : `${inquiry.check} ${inquiry.round}`}
                      checked={answers[g.id]?.includes(o.id) ?? false}
                      onChange={() => {}}
                      onClick={() => pick(g, o.id)}
                    />
                    <span className={inquiry.cardName}>{o.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))
        ) : (
          <>
            <p className={inquiry.lede}>
              {results.length > 0
                ? "Change an answer on the left, and these change with it."
                : "Change an answer on the left, or tell us what you need."}
            </p>
            <ul className={styles.results}>
              {results.map(({ product, reasons }) => (
                <li key={product.id}>
                  <ProductCard product={product} sizes="(max-width: 700px) 100vw, 25vw" />
                  <ul className={styles.reasons}>
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            {told.length > 0 && (
              <ul className={styles.reasons}>
                {told.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            <nav className={styles.next} aria-label="Next steps">
              <Link href={routes.collection} className={inquiry.back}>
                See the modular designs
              </Link>
              <Link href={routes.designYourRoom} className={inquiry.back}>
                Compose your own
              </Link>
              <Link href={`${routes.products}#ready-made`} className={inquiry.back}>
                See ready-made furniture
              </Link>
              <Link href={contactHref(office ? "office" : "visit")} className={inquiry.next}>
                {office ? "Ask for a quote" : "Book a visit"}
              </Link>
            </nav>
          </>
        )}

        {current && (
          <footer className={inquiry.foot}>
            <button type="button" className={inquiry.back} onClick={() => setStep(RESULTS)}>
              See results now
            </button>
            <div className={inquiry.moves}>
              {step > 0 && (
                <button type="button" className={inquiry.back} onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              <button type="button" className={inquiry.next} onClick={() => setStep(step + 1)}>
                {current.groups.some((g) => answers[g.id]?.length) ? "Next" : "Skip"}
              </button>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}
