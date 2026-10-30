"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FIGURES, MANIFESTO } from "./whoWeAre";
import styles from "./Manifesto.module.css";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Each word and picture of the paragraph, numbered in order, so they can read in one after another. */
const RUNS = (() => {
  let i = 0;
  return MANIFESTO.map((run) =>
    "photo" in run ? { ...run, at: i++ } : { ...run, words: run.words.split(" ").map((w) => ({ w, at: i++ })) },
  );
})();
const COUNT = RUNS.reduce((n, r) => n + ("photo" in r ? 1 : r.words.length), 0);

/**
 * A figure whose digits roll, once `on`, from 0 to their own, each a turn
 * and a bit, the later ones a little after; anything else in it stays
 * still. The value itself is what screen readers hear.
 */
function Figure({ value, unit, on }: { value: string; unit?: string; on: boolean }) {
  return (
    <span className={styles.figure}>
      <span className="visually-hidden">{unit ? `${value} ${unit}` : value}</span>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className={styles.digit} aria-hidden="true">
            <span
              className={styles.strip}
              style={{ "--to": on ? 10 + Number(ch) : 0, "--k": i } as CSSProperties}
            >
              {/* two turns of digits, so it can roll past its own once */}
              {Array.from({ length: 20 }, (_, d) => (
                <span key={d}>{d % 10}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className={styles.still} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
      {unit && (
        <span className={styles.unit} aria-hidden="true">
          {unit}
        </span>
      )}
    </span>
  );
}

/**
 * "Who we are", after the tour: the brand's opening paragraph in large,
 * renders of what it speaks of set into its lines, its words reading in
 * from faint as it scrolls up the screen; then its figures, rolling to
 * their values once they come into view.
 */
export function Manifesto() {
  const section = useRef<HTMLElement>(null);
  const figures = useRef<HTMLDListElement>(null);
  const [rolled, setRolled] = useState(false);

  // how far the paragraph has been read: from its top at 85% down the
  // screen to its foot at 60%, once a frame at most
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let pending = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--read", String(clamp01((innerHeight * 0.85 - r.top) / (r.height * 0.75))));
    };
    const schedule = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(pending);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  // the figures roll once, the first time they are up in the middle of the
  // screen (not just over its foot), so the spin is seen
  useEffect(() => {
    const el = figures.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRolled(true);
        seen.disconnect();
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0.5 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <section ref={section} className={styles.manifesto} aria-labelledby="who-title" style={{ "--n": COUNT } as CSSProperties}>
      <h2 id="who-title" className={styles.label}>
        <span>Who we are</span>
      </h2>
      <p className={styles.text}>
        {RUNS.map((run) =>
          "photo" in run ? (
            <span key={run.at} className={styles.photo} style={{ "--i": run.at } as CSSProperties}>
              <Image src={run.photo} alt={run.alt} fill sizes="12vw" />
            </span>
          ) : (
            <span key={run.words[0]!.at} className={run.mark ? styles.mark : undefined}>
              {run.words.map(({ w, at }) => (
                <span key={at} className={styles.word} style={{ "--i": at } as CSSProperties}>
                  {w}{" "}
                </span>
              ))}
            </span>
          ),
        )}
      </p>
      <dl ref={figures} className={styles.figures}>
        {FIGURES.map((f) => (
          <div key={f.label} className={styles.fact}>
            <dt className={styles.caption}>{f.label}</dt>
            <dd className={styles.value}>
              <Figure value={f.value} unit={f.unit} on={rolled} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
