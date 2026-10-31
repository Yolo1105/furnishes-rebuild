import Link from "next/link";
import { routes } from "@/lib/routes";
import { PhoneMenu } from "./PhoneMenu";
import styles from "./SiteHeader.module.css";

/**
 * The bar, over the top of the page. Left: the wordmark, then ours to look at
 * (our pieces, our rooms, the quiz, who we are). Right: how to reach us,
 * then yours (designing your room, your account), with "Design your room" boxed as
 * the bar's one button.
 */
const MENU: readonly { label: string; href: string }[] = [
  { label: "Collection", href: routes.collection },
  { label: "Inspiration", href: routes.inspiration },
  { label: "Quiz", href: routes.quiz },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Sign in", href: routes.signIn },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <svg className={styles.grain} aria-hidden="true" preserveAspectRatio="none">
        <filter id="bar-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bar-grain)" />
      </svg>
      <Link href={routes.studio} className={styles.wordmark}>
        furnishes<span className={styles.dot}>.</span>
      </Link>

      <nav className={styles.start} aria-label="Browse">
        <Link href={routes.collection} className={styles.link}>
          Collection
        </Link>
        <Link href={routes.inspiration} className={styles.link}>
          Inspiration
        </Link>
        <Link href={routes.quiz} className={styles.link}>
          Quiz
        </Link>
        <Link href={routes.about} className={styles.link}>
          About
        </Link>
      </nav>

      <PhoneMenu links={MENU} />

      <nav className={styles.end} aria-label="Your space">
        <Link href={routes.contact} className={styles.link}>
          Contact
        </Link>
        <Link href={routes.designYourRoom} className={`${styles.link} ${styles.primary}`}>
          Design your room
        </Link>
        <Link href={routes.signIn} className={styles.link}>
          Sign in
        </Link>
      </nav>
    </header>
  );
}
