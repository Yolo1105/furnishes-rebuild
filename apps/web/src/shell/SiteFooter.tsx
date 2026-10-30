import Link from "next/link";
import { EMAIL, HOURS } from "@/lib/contact";
import { routes } from "@/lib/routes";
import styles from "./SiteFooter.module.css";

/** Our accounts elsewhere; none is live yet, so each shows greyed out without a link. */
const SOCIAL: readonly { label: string; href: string | null }[] = [
  { label: "Instagram", href: null },
  { label: "Behance", href: null },
];

const LEGAL = [
  { label: "Terms & Conditions", href: routes.terms },
  { label: "Privacy Policy", href: routes.privacy },
  { label: "Refund Policy", href: routes.refunds },
] as const;

/**
 * The footer, as the old landing's: on the warm espresso dark, a large call to
 * get in touch (its halves part on hover for an arrow between them), then
 * four columns (who we are, our hours, how to reach us, the studio), then the
 * legal links and the year.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Link className={styles.call} href={routes.contact}>
        <span className={styles.callA}>Interested? Let&apos;s get in</span>
        <span className={styles.callMid} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 17L17 7" />
            <path d="M17 7v6M17 7h-6" />
          </svg>
        </span>
        <span className={styles.callB}>touch today!</span>
      </Link>

      <div className={styles.grid}>
        <div>
          <p className={styles.name}>furnishes.</p>
          <p className={styles.body}>
            A design studio for high-quality, modern interiors. A seamless process that shapes each space around how you
            live, work, and rest.
          </p>
        </div>
        <div>
          <p className={styles.label}>[ Hours ]</p>
          <p className={styles.body}>
            {HOURS.map((row) => (
              <span key={row}>
                {row}
                <br />
              </span>
            ))}
          </p>
        </div>
        <div>
          <p className={styles.label}>[ Contact ]</p>
          <p className={styles.body}>
            <a className={styles.link} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
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
        <div>
          <p className={styles.label}>[ Studio ]</p>
          <p className={styles.body}>Visual development & support across the full 3D pipeline.</p>
          <p className={styles.small}>By appointment · demo location</p>
        </div>
      </div>

      <div className={styles.legal}>
        <div className={styles.legalLinks}>
          {LEGAL.map(({ label, href }) => (
            <Link key={label} className={styles.link} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()} Furnishes.</p>
      </div>
    </footer>
  );
}
