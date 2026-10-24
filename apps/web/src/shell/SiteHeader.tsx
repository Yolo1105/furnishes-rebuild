import Link from "next/link";
import { routes } from "@/lib/routes";
import { AccountLink } from "./AccountLink";
import { CartLink } from "./CartLink";
import { HeaderShell } from "./HeaderShell";
import styles from "./SiteHeader.module.css";

/**
 * The bar. Left: ours to look at (our pieces, our rooms). Centre: the
 * wordmark. Right: yours (designing your room, your cart, your account),
 * with "Design your room" as the bar's one button.
 */
export function SiteHeader() {
  return (
    <HeaderShell className={styles.header}>
      <nav className={styles.start} aria-label="Browse">
        <Link href={routes.collection} className={styles.link}>
          Collection
        </Link>
        {/* Rooms to browse and the style quiz both live here. */}
        <Link href={routes.inspiration} className={styles.link}>
          Inspiration
        </Link>
      </nav>

      <Link href={routes.home} className={styles.wordmark}>
        furnishes.
      </Link>

      <nav className={styles.end} aria-label="Your space">
        <Link href={routes.studio} className={`${styles.link} ${styles.primary}`}>
          Design your room
        </Link>
        <CartLink />
        <AccountLink />
      </nav>
    </HeaderShell>
  );
}
