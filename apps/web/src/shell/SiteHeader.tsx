import Link from "next/link";
import { routes } from "@/lib/routes";
import { NavLink } from "./NavLink";
import { PhoneMenu } from "./PhoneMenu";
import styles from "./SiteHeader.module.css";

/** Every link the bar carries, for the phone menu: browsing first, then reaching us. */
const MENU: readonly { label: string; href: string }[] = [
  { label: "Collection", href: routes.collection },
  { label: "Inspiration", href: routes.inspiration },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

/**
 * The bar, on paper with a hairline under it. Left: the wordmark, then the
 * browsing links. Right: contact and the bar's one button.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href={routes.home} className={styles.wordmark}>
        furnishes<span className={styles.dot}>.</span>
      </Link>

      <nav className={styles.start} aria-label="Browse">
        {MENU.slice(0, 3).map((l) => (
          <NavLink key={l.href} href={l.href} className={styles.link}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.end}>
        <NavLink href={routes.contact} className={`${styles.link} ${styles.wide}`}>
          Contact
        </NavLink>
        <Link href={routes.designYourRoom} className={`btn-primary ${styles.primary}`}>
          Design<span className={styles.more}> your room</span>
        </Link>
        <PhoneMenu links={MENU} />
      </div>
    </header>
  );
}
