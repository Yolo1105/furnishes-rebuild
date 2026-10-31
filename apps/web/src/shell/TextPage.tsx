import Link from "next/link";
import type { ReactNode } from "react";
import { PeachBackdrop } from "./PeachBackdrop";
import { SiteFooter } from "./SiteFooter";
import styles from "./TextPage.module.css";

export type TextSection = {
  heading: string;
  body: readonly string[];
  /** Short items after the words, such as steps or what to check. */
  points?: readonly string[];
  /** Where to go from this section, when it is more than the page's last calls. */
  link?: { label: string; href: string };
};

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** A plain page of words over the peach: its title and line, its sections, then calls and the footer. */
export function TextPage({
  label,
  title,
  lede,
  sections,
  calls = [],
  jump = false,
  children,
}: {
  label: string;
  title: string;
  lede: string;
  sections: readonly TextSection[];
  calls?: readonly { label: string; href: string }[];
  /** Whether a long page opens with links to its sections. */
  jump?: boolean;
  /** Anything more, after the sections and before the calls. */
  children?: ReactNode;
}) {
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <header className={styles.head}>
          <p className={styles.index}>
            <span>{label}</span>
          </p>
          <h1>{title}</h1>
          <p className={styles.lede}>{lede}</p>
          {jump && (
            <nav className={styles.jump} aria-label="On this page">
              {sections.map((s) => (
                <a key={s.heading} href={`#${anchor(s.heading)}`} className={styles.call}>
                  {s.heading}
                </a>
              ))}
            </nav>
          )}
        </header>
        {sections.map((s) => (
          <section key={s.heading} id={anchor(s.heading)} className={styles.section}>
            <h2 className={styles.heading}>{s.heading}</h2>
            <div className={styles.body}>
              {s.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {s.points && (
                <ul className={styles.points}>
                  {s.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {s.link && (
                <p>
                  <Link href={s.link.href} className={styles.call}>
                    {s.link.label}
                  </Link>
                </p>
              )}
            </div>
          </section>
        ))}
        {children}
        {calls.length > 0 && (
          <nav className={styles.calls} aria-label="Next steps">
            {calls.map((c) => (
              <Link key={c.href} href={c.href} className={styles.call}>
                {c.label}
              </Link>
            ))}
          </nav>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
