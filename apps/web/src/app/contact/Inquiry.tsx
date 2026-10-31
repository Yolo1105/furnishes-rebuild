"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { EMAIL } from "@/lib/contact";
import { ROOM_COUNTS, SCOPES, STARTS, STEPS } from "./inquiryCopy";
import styles from "./Inquiry.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

const NOT_GIVEN = "Not given";

type Answers = {
  scopes: string[];
  rooms: string;
  size: string;
  start: string;
  by: string;
  name: string;
  email: string;
  phone: string;
  place: string;
  notes: string;
};

const EMPTY: Answers = { scopes: [], rooms: "", size: "", start: "", by: "", name: "", email: "", phone: "", place: "", notes: "" };

/** The review's rows, label then answer, each with the step that sets it. */
function summary(a: Answers, about?: string): { label: string; value: string; step: number }[] {
  const join = (...parts: string[]) => parts.filter(Boolean).join(", ") || NOT_GIVEN;
  return [
    ...(about ? [{ label: "About", value: about, step: 0 }] : []),
    {
      label: "Topic",
      value: join(a.scopes.join(", "), a.rooms && `${a.rooms} rooms`, a.size && `about ${a.size} sq ft`),
      step: 0,
    },
    { label: "Timing", value: join(a.start, a.by && `done by ${a.by}`), step: 1 },
    { label: "Contact", value: join(a.name, a.email, a.phone), step: 2 },
    { label: "Place", value: join(a.place), step: 2 },
    { label: "Notes", value: join(a.notes), step: 2 },
  ];
}

/**
 * The inquiry, one sheet at a time: on the left the steps (those reached can
 * be gone back to) over the sheet's number; on the right the step's question
 * in a ruled frame, Back and Next at its foot. There is no server to send to
 * yet, so sending opens the sender's email app with the answers written in.
 */
export function Inquiry({ topic, about }: { topic?: string; about?: string }) {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [a, setA] = useState(() => {
    const picked = SCOPES.find((s) => s.id === topic);
    return picked ? { ...EMPTY, scopes: [picked.name] } : EMPTY;
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // after a move between steps (not on arrival), the new question takes focus
  useEffect(() => {
    if (moved.current) title.current?.focus();
    moved.current = true;
  }, [step]);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const go = (to: number) => {
    setError("");
    setStep(to);
  };
  const toggleScope = (name: string) =>
    set("scopes", a.scopes.includes(name) ? a.scopes.filter((s) => s !== name) : [...a.scopes, name]);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0 && a.scopes.length === 0) {
      setError("Pick at least one.");
      return;
    }
    if (step < STEPS.length - 1) {
      setReached((r) => Math.max(r, step + 1));
      go(step + 1);
      return;
    }
    const body = summary(a, about)
      .map((row) => `${row.label}: ${row.value}`)
      .join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry from ${a.name}${about ? `: ${about}` : ""}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const { title: heading, lede } = STEPS[step] ?? STEPS[0];
  const last = step === STEPS.length - 1;

  return (
    <section className={styles.inquiry} aria-labelledby="inquiry-title">
      <aside className={styles.side}>
        <p className={styles.index}>
          <span>Enquiry</span>
        </p>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li key={s.name} className={styles.step} aria-current={i === step ? "step" : undefined}>
              <button type="button" className={styles.stepButton} disabled={i > reached || i === step} onClick={() => go(i)}>
                <span className={styles.code}>{pad(i + 1)}</span>
                {s.name}
              </button>
            </li>
          ))}
        </ol>
        <div className={styles.sheet}>
          <p className={styles.label}>
            Step {step + 1} of {STEPS.length}
          </p>
        </div>
      </aside>

      <form className={styles.frame} onSubmit={next}>
        <h2 id="inquiry-title" ref={title} tabIndex={-1} className={styles.title}>
          {heading}
        </h2>
        <p className={styles.lede}>{lede}</p>

        {step === 0 && (
          <>
            {about && <p className={styles.ask}>About: {about}</p>}
            <fieldset className={styles.cards}>
              <legend className="visually-hidden">{heading}</legend>
              {SCOPES.map((s, i) => (
                <label key={s.name} className={styles.card}>
                  <span className={styles.code}>{pad(i + 1)}</span>
                  <input
                    type="checkbox"
                    className={styles.check}
                    checked={a.scopes.includes(s.name)}
                    onChange={() => toggleScope(s.name)}
                  />
                  <span className={styles.cardName}>{s.name}</span>
                  <span className={styles.code}>{s.runs}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.pair}>
              <fieldset className={styles.field}>
                <legend className={styles.label}>Rooms</legend>
                <p className={styles.ask}>How many rooms is it for, if any?</p>
                <div className={styles.segments}>
                  {ROOM_COUNTS.map((r) => (
                    <label key={r} className={styles.segment}>
                      <input
                        type="radio"
                        name="rooms"
                        className="visually-hidden"
                        checked={a.rooms === r}
                        onChange={() => set("rooms", r)}
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className={styles.field}>
                <span className={styles.label}>Rough size</span>
                <span className={styles.ask}>Roughly how many square feet?</span>
                <span className={styles.underline}>
                  <input
                    className={styles.input}
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    placeholder="For example 900"
                    value={a.size}
                    onChange={(e) => set("size", e.target.value)}
                  />
                  <span className={styles.code}>sq ft</span>
                </span>
              </label>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <fieldset className={`${styles.cards} ${styles.four}`}>
              <legend className="visually-hidden">{heading}</legend>
              {STARTS.map((s) => (
                <label key={s} className={styles.card}>
                  <input
                    type="radio"
                    name="start"
                    required
                    className={`${styles.check} ${styles.round}`}
                    checked={a.start === s}
                    onChange={() => set("start", s)}
                  />
                  <span className={styles.cardName}>{s}</span>
                </label>
              ))}
            </fieldset>
            <label className={styles.field}>
              <span className={styles.label}>Fixed date</span>
              <span className={styles.ask}>Is there a date you need it by?</span>
              <input
                className={`${styles.input} ${styles.underline}`}
                placeholder="Optional, for example a move-in date"
                value={a.by}
                onChange={(e) => set("by", e.target.value)}
              />
            </label>
          </>
        )}

        {step === 2 && (
          <div className={styles.pairs}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={`${styles.input} ${styles.underline}`}
                required
                autoComplete="name"
                placeholder="For example Alex Tan"
                value={a.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={`${styles.input} ${styles.underline}`}
                type="email"
                required
                autoComplete="email"
                placeholder="For example alex@example.com"
                value={a.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.labelRow}>
                <span className={styles.label}>Phone</span>
                <span className={styles.label}>Optional</span>
              </span>
              <input
                className={`${styles.input} ${styles.underline}`}
                type="tel"
                autoComplete="tel"
                placeholder="For example +65 9123 4567"
                value={a.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Address or neighbourhood</span>
              <input
                className={`${styles.input} ${styles.underline}`}
                autoComplete="street-address"
                placeholder="For example Tiong Bahru"
                value={a.place}
                onChange={(e) => set("place", e.target.value)}
              />
            </label>
            <label className={`${styles.field} ${styles.wide}`}>
              <span className={styles.label}>Notes</span>
              <span className={styles.ask}>Anything we should know?</span>
              <textarea
                className={styles.notes}
                rows={4}
                placeholder="Optional, for example what the home is like or what has to stay"
                value={a.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </label>
          </div>
        )}

        {last && (
          <dl className={styles.review}>
            {summary(a, about).map((row) => (
              <div key={row.label} className={styles.reviewRow}>
                <dt className={styles.label}>{row.label}</dt>
                <dd className={styles.reviewValue} data-empty={row.value === NOT_GIVEN || undefined}>
                  {row.value}
                </dd>
                <dd>
                  <button type="button" className={styles.edit} onClick={() => go(row.step)}>
                    Edit<span className="visually-hidden"> {row.label.toLowerCase()}</span>
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <p className={styles.error} role="alert">
          {error}
        </p>
        {sent && (
          <p className={styles.sent} role="status">
            Your email app should open with this written in, for you to send. If it did not, write to us at{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        )}

        <footer className={styles.foot}>
          <p className={styles.write}>
            Prefer to write? <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <div className={styles.moves}>
            {step > 0 && (
              <button type="button" className={styles.back} onClick={() => go(step - 1)}>
                Back
              </button>
            )}
            <button type="submit" className={styles.next}>
              {last ? "Open in my email app" : `Next: ${STEPS[step + 1]?.name.toLowerCase()}`}
            </button>
          </div>
        </footer>
      </form>
    </section>
  );
}
