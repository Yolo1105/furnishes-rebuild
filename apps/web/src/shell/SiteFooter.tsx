import Link from "next/link";
import { EMAIL, HOURS } from "@/lib/contact";
import { isReal, shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import styles from "./SiteFooter.module.css";

/** The link columns, each under its label. */
const COLUMNS: readonly { label: string; links: readonly { label: string; href: string }[] }[] = [
  {
    label: "Shop",
    links: [
      { label: "Collection", href: routes.collection },
      { label: "Products", href: routes.products },
      { label: "Inspiration", href: routes.inspiration },
      { label: "Quiz", href: routes.quiz },
      { label: "Design your room", href: routes.designYourRoom },
      { label: "About", href: routes.about },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    label: "Guides",
    links: [
      { label: "How it works", href: routes.howItWorks },
      { label: "Why modular", href: routes.whyModular },
      { label: "Buying guide", href: routes.buyingGuide },
      { label: "Help", href: routes.help },
      { label: "Room dividers", href: routes.roomDividers },
      { label: "HDB homes", href: routes.hdbHomes },
      { label: "Workspaces", href: routes.workspaces },
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
 * The footer, on linen: the call beside how to reach us; then who we are
 * beside the link columns; then the copyright.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="span-6">
          <h2>Design a room that feels like yours.</h2>
        </div>
        <div className="span-6">
          <a className={`btn-link ${styles.email}`} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className={`subgrid ${styles.details}`}>
            <div className="md:span-6 span-6">
              <p className="eyebrow">Hours</p>
              {HOURS.map((row) => (
                <p key={row}>{row}</p>
              ))}
            </div>
            <div className="md:span-6 span-6">
              <p className="eyebrow">Studio</p>
              <p>Singapore, by appointment in your room</p>
            </div>
          </div>
        </div>

        <p className={`span-4 ${styles.about}`}>
          Ready-made and modular furniture for Singapore homes and small offices, made by our partner factory in China.
        </p>
        <nav className={`span-8 ${styles.columns}`} aria-label="Footer">
          {COLUMNS.map((col) => (
            <div key={col.label}>
              <p className="eyebrow">{col.label}</p>
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

        <p className={`span-12 meta ${styles.copy}`}>
          © {new Date().getFullYear()} Furnishes Pte Ltd.{isReal("companyDetails") && ` ${shown("companyDetails")}`}
        </p>
      </div>
    </footer>
  );
}
