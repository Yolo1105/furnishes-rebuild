import Link from "next/link";
import { routes } from "@/lib/routes";
import styles from "./SiteHeader.module.css";

/**
 * The bar, over the top of the page. Left: the wordmark, then ours to look at
 * (our pieces, our rooms, the quiz, who we are). Right: how to reach us,
 * then yours (designing your room, your account), with "Design your room" boxed as
 * the bar's one button.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
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

      <nav className={styles.end} aria-label="Your space">
        <Link href={routes.contact} className={styles.link}>
          Contact
        </Link>
        <Link href={routes.studio} className={`${styles.link} ${styles.primary}`}>
          Design your room
        </Link>
        <Link href={routes.signIn} className={styles.link}>
          Sign in
        </Link>
      </nav>
    </header>
  );
}
