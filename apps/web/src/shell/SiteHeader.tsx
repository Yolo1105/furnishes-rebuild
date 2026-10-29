import Link from "next/link";
import { routes } from "@/lib/routes";
import styles from "./SiteHeader.module.css";

/**
 * The bar, over the top of the page. Left: ours to look at (our pieces, our
 * rooms). Centre: the wordmark. Right: yours (designing your room, your
 * account). All plain links: the page under it has the button.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.start} aria-label="Browse">
        <Link href={routes.collection} className={styles.link}>
          Collection
        </Link>
        <Link href={routes.inspiration} className={styles.link}>
          Inspiration
        </Link>
      </nav>

      <Link href={routes.home} className={styles.wordmark}>
        furn<span className={styles.accent}>i</span>shes<span className={styles.accent}>.</span>
      </Link>

      <nav className={styles.end} aria-label="Your space">
        <Link href={routes.studio} className={styles.link}>
          Design your room
        </Link>
        <Link href={routes.signIn} className={styles.link}>
          Sign in
        </Link>
      </nav>
    </header>
  );
}
