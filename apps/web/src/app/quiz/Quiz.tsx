"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ProductCard } from "@/features/products/ProductCard";
import { routes } from "@/lib/routes";
import { Button } from "@/shell/ui/Button";
import { match, type QuizAnswers } from "./match";
import { QUESTIONS } from "./quizCopy";
import styles from "./Quiz.module.css";

const RESULTS = QUESTIONS.length;

const FOUND = ["Nothing fits all of that.", "One piece that fits.", "Two pieces that fit.", "Three pieces that fit."] as const;

/**
 * The quiz, one question a screen: the question, its options as rows, Back
 * and Next in a bar that stays in view. Any question can be skipped. After
 * the last come the pieces that fit.
 */
export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // after a move between screens (not on arrival), the new heading takes focus
  useEffect(() => {
    if (moved.current) heading.current?.focus();
    moved.current = true;
  }, [step]);

  const question = QUESTIONS[step];

  if (!question) {
    const results = match(answers);
    return (
      <div className="span-12 subgrid">
        <header className="span-8 section-head">
          <p className="eyebrow">Your results</p>
          <h2 ref={heading} tabIndex={-1} className="h2-sm">
            {FOUND[results.length]}
          </h2>
          <p className="lede">
            {results.length > 0 ? "Change an answer and these change with it." : "Change an answer, or write to us about what you need."}
          </p>
        </header>
        {results.map(({ product, reasons }) => (
          <div key={product.id} className="span-4">
            <ProductCard product={product} />
            <ul className={`ruled meta ${styles.reasons}`}>
              {reasons.slice(0, 2).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="span-12 actions">
          <Button variant="link" href={routes.products}>
            See everything →
          </Button>
          <Button variant="link" onClick={() => setStep(RESULTS - 1)}>
            Change my answers
          </Button>
        </div>
      </div>
    );
  }

  const picked = answers[question.id];
  const next = (e: FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <form className={`span-8 ${styles.quiz}`} onSubmit={next} aria-labelledby="quiz-question">
      <p className="eyebrow">
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <h2 id="quiz-question" ref={heading} tabIndex={-1} className="h2-sm">
        {question.title}
      </h2>
      <p className="lede">{question.lede}</p>
      <fieldset className={styles.options}>
        <legend className="visually-hidden">{question.title}</legend>
        {question.options.map((o) => (
          <label key={o.id} className={`btn-secondary ${styles.option}`}>
            <input
              type="radio"
              name={question.id}
              value={o.id}
              checked={picked === o.id}
              onChange={() => setAnswers((a) => ({ ...a, [question.id]: o.id }))}
            />
            {o.name}
          </label>
        ))}
      </fieldset>
      <div className={styles.bar}>
        {step > 0 && (
          <Button variant="link" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <button type="submit" className={`btn-primary ${styles.next}`}>
          {step === RESULTS - 1 ? "See results" : picked ? "Next" : "Skip"}
        </button>
      </div>
    </form>
  );
}
