import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { Button } from "./ui/Button";
import { SectionHead } from "./ui/SectionHead";

export type TextSection = {
  heading: string;
  body: readonly string[];
  /** Short items after the words, such as steps or what to check. */
  points?: readonly string[];
  /** Where to go from this section, when it is more than the page's last calls. */
  link?: { label: string; href: string };
};

const anchor = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** A plain page of words: its title and lede, its sections (heading left, words right), then calls and the footer. */
export function TextPage({
  label,
  title,
  lede,
  sections,
  calls = [],
  children,
}: {
  label: string;
  title: string;
  lede: string;
  sections: readonly TextSection[];
  calls?: readonly { label: string; href: string }[];
  /** Anything more, after the sections and before the calls. */
  children?: ReactNode;
}) {
  return (
    <>
      <main id="main">
        <div className="section container">
          <SectionHead as="h1" eyebrow={label} title={title} lede={lede} />
          {sections.map((s) => (
            <section key={s.heading} id={anchor(s.heading)} aria-labelledby={`${anchor(s.heading)}-title`} className="span-12 subgrid card">
              <h2 id={`${anchor(s.heading)}-title`} className="span-4 h2-sm">
                {s.heading}
              </h2>
              <div className="span-8">
                {s.body.filter(Boolean).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {s.points && (
                  <ul className="ruled" style={{ marginTop: "var(--s-4)" }}>
                    {s.points.filter(Boolean).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {s.link && (
                  <p style={{ marginTop: "var(--s-4)" }}>
                    <Button variant="link" href={s.link.href}>
                      {s.link.label} →
                    </Button>
                  </p>
                )}
              </div>
            </section>
          ))}
          {children}
          {calls.length > 0 && (
            <nav className="span-12 actions" aria-label="Next steps" style={{ marginTop: "var(--s-8)" }}>
              {calls.map((c, i) => (
                <Button key={c.href} variant={i === 0 ? "primary" : "secondary"} href={c.href}>
                  {c.label}
                </Button>
              ))}
            </nav>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
