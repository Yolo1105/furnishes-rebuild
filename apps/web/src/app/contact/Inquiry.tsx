"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import type { ContactTopic } from "@/lib/routes";
import { type Enquiry, type EnquiryErrors, type EnquiryField, LIMITS, TOPICS, validateEnquiry } from "./enquiry";
import styles from "./Inquiry.module.css";

/** What happens once it is sent. */
const NEXT: readonly { title: string; line: string }[] = [
  { title: "We reply by email", line: "We answer your question, or send a quote if you asked for one." },
  { title: "If you asked for a visit", line: `We agree a time to come to your room, ${shown("consultPrice")}.` },
];

const REPLY = shown("replyTime");
const THANKS = REPLY ? `Thanks — we reply within ${REPLY}.` : "Thanks — we reply by email.";

const ORDER: readonly EnquiryField[] = ["topic", "piece", "name", "email", "message"];

type State = "idle" | "sending" | "failed" | "sent";

/**
 * The enquiry, on one screen: what it is about, which piece, who to answer
 * and the message. It is checked as it is sent, posted to /api/enquiry, and
 * on arrival the form gives way to what happens next.
 */
export function Inquiry({ topic, piece, pieces }: { topic?: ContactTopic; piece?: string; pieces: readonly { id: string; name: string }[] }) {
  const [values, setValues] = useState<Enquiry>({ topic: topic ?? "", piece: piece ?? "", name: "", email: "", message: "" });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [state, setState] = useState<State>("idle");
  const form = useRef<HTMLFormElement>(null);
  const thanks = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state === "sent") thanks.current?.focus();
  }, [state]);

  const set = (key: EnquiryField, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const showErrors = (found: EnquiryErrors) => {
    setErrors(found);
    const firstBad = ORDER.find((k) => found[k]);
    if (firstBad) form.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const { enquiry, errors: found } = validateEnquiry(values);
    if (Object.keys(found).length > 0) {
      showErrors(found);
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { errors?: EnquiryErrors };
      if (res.status === 400 && body.errors && Object.keys(body.errors).length > 0) {
        setState("idle");
        showErrors(body.errors);
        return;
      }
      setState("failed");
    } catch {
      setState("failed");
    }
  };

  /** A field's error line, and the attributes that tie the control to it. */
  const described = (key: EnquiryField) => ({
    id: `enquiry-${key}`,
    name: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `enquiry-${key}-error` : undefined,
  });
  const errorLine = (key: EnquiryField) =>
    errors[key] && (
      <p id={`enquiry-${key}-error`} className={styles.error}>
        <span aria-hidden="true">✕ </span>
        {errors[key]}
      </p>
    );
  const label = (key: EnquiryField, text: string, required = true) => (
    <label htmlFor={`enquiry-${key}`} className="meta">
      {text}
      {required ? <span aria-hidden="true"> *</span> : <span> (optional)</span>}
    </label>
  );

  const count = Object.values(errors).filter(Boolean).length;
  const status =
    state === "sending" ? "Sending…" : count > 0 ? `${count === 1 ? "One field needs" : `${count} fields need`} a look.` : "";

  return (
    <div className={styles.inquiry}>
      <div aria-live="polite">
        {state === "sent" ? (
          <section className={styles.sent} aria-labelledby="enquiry-sent">
            <h2 id="enquiry-sent" ref={thanks} tabIndex={-1} className="h2-sm">
              {THANKS}
            </h2>
            <ol className="ruled">
              {NEXT.map((n) => (
                <li key={n.title}>
                  <strong>{n.title}.</strong> {n.line}
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <>
            <p className="visually-hidden">{status}</p>
            {state === "failed" && (
              <p className={styles.error} role="alert">
                <span aria-hidden="true">✕ </span>
                It didn&apos;t send. Try again, or write to us at {EMAIL}.
              </p>
            )}
          </>
        )}
      </div>

      {state !== "sent" && (
        <form ref={form} className={styles.form} onSubmit={send} noValidate aria-labelledby="enquiry-title">
          <h2 id="enquiry-title" className="visually-hidden">
            Send us a message.
          </h2>
          <p className="meta">Fields marked * are required.</p>

          <div className={styles.field}>
            {label("topic", "What is it about?")}
            <select
              {...described("topic")}
              className={styles.control}
              required
              value={values.topic}
              onChange={(e) => set("topic", e.target.value)}
            >
              <option value="">Pick one</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errorLine("topic")}
          </div>

          <div className={styles.field}>
            {label("piece", "Which piece", false)}
            <select {...described("piece")} className={styles.control} value={values.piece} onChange={(e) => set("piece", e.target.value)}>
              <option value="">Not about one piece</option>
              {pieces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errorLine("piece")}
          </div>

          <div className={styles.field}>
            {label("name", "Name")}
            <input
              {...described("name")}
              className={styles.control}
              required
              autoComplete="name"
              maxLength={LIMITS.name}
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errorLine("name")}
          </div>

          <div className={styles.field}>
            {label("email", "Email")}
            <input
              {...described("email")}
              className={styles.control}
              type="email"
              required
              autoComplete="email"
              maxLength={LIMITS.email}
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errorLine("email")}
          </div>

          <div className={styles.field}>
            {label("message", "Message")}
            <textarea
              {...described("message")}
              className={`${styles.control} ${styles.message}`}
              required
              rows={6}
              maxLength={LIMITS.message}
              placeholder="For example the room, its size, and what has to stay"
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
            />
            {errorLine("message")}
          </div>

          <div className={styles.foot}>
            <button type="submit" className="btn-primary" disabled={state === "sending"} aria-busy={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send"}
            </button>
            <p className="meta">
              Prefer to write? <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
