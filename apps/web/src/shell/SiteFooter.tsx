import Link from "next/link";
import { EMAIL, HOURS } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import styles from "./SiteFooter.module.css";

/** Our accounts elsewhere; none is live yet, so each shows greyed out without a link. */
const SOCIAL: readonly { label: string; href: string | null }[] = [
  { label: "Instagram", href: null },
  { label: "Behance", href: null },
];

/** The link columns, each under its label. */
const COLUMNS: readonly { label: string; links: readonly { label: string; href: string }[] }[] = [
  {
    label: "Navigation",
    links: [
      { label: "Studio", href: routes.studio },
      { label: "Collection", href: routes.collection },
      { label: "Products", href: routes.products },
      { label: "Inspiration", href: routes.inspiration },
      { label: "About", href: routes.about },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    label: "Account",
    links: [
      { label: "Design your room", href: routes.designYourRoom },
      { label: "How it works", href: routes.howItWorks },
      { label: "Why modular", href: routes.whyModular },
      { label: "Buying guide", href: routes.buyingGuide },
      { label: "Help", href: routes.help },
      { label: "Room dividers", href: routes.roomDividers },
      { label: "HDB homes", href: routes.hdbHomes },
      { label: "Workspaces", href: routes.workspaces },
      { label: "Sign in", href: routes.signIn },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms & Conditions", href: routes.terms },
      { label: "Privacy Policy", href: routes.privacy },
      { label: "Refund Policy", href: routes.refunds },
    ],
  },
];

/**
 * The footer, over the page's own ground, in three bands ruled apart: the
 * call (a label over a large two-line headline)
 * beside how to reach us (the address to write to, large, then the hours and
 * where we are); then who we are and where else to find us beside the link
 * columns; then the copyright, centred.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <p className={styles.label}>Open for collaboration</p>
          <p className={styles.call}>
            <span>Design a room</span>
            <span>that feels like yours.</span>
          </p>
        </div>
        <div>
          <p className={styles.label}>Get in touch</p>
          <a className={styles.email} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className={styles.details}>
            <div>
              <p className={styles.label}>Hours</p>
              <p className={styles.body}>
                {HOURS.map((row) => (
                  <span key={row} className={styles.row}>
                    {row}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className={styles.label}>Studio</p>
              <p className={styles.body}>
                <span className={styles.row}>Singapore</span>
                <span className={styles.row}>By appointment, in your room</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.about}>
          <p className={styles.body}>
            Ready-made and modular furniture for Singapore homes and small offices, made by our partner factory in China.
          </p>
          <div>
            <p className={styles.visit}>Visit us on</p>
            <ul className={styles.social}>
              {SOCIAL.map(({ label, href }) => (
                <li key={label}>
                  {href ? (
                    <a className={styles.link} href={href}>
                      {label}
                    </a>
                  ) : (
                    <span className={styles.off} aria-disabled="true">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className={styles.columns} aria-label="Footer">
          {COLUMNS.map((col) => (
            <div key={col.label}>
              <p className={styles.label}>{col.label}</p>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link className={styles.link} href={l.href}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <p className={styles.copy}>Copyright © {new Date().getFullYear()} Furnishes Pte Ltd. All rights reserved. {shown("companyDetails")}</p>
    </footer>
  );
}
