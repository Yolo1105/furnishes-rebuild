"use client";

import Link from "next/link";
import { useDemoSession } from "@/features/auth/demo-session";
import { routes } from "@/lib/routes";
import styles from "./SiteHeader.module.css";

/**
 * The cart: the word, with its count raised at its top right once something
 * is in it, like the other words in the bar; on phones, where words don't
 * fit, a bag icon with a badge instead. Shown only once signed in. Nothing
 * can be added yet.
 */
export function CartLink({ count = 0 }: { count?: number }) {
  const signedIn = useDemoSession();
  if (!signedIn) return null;
  return (
    <Link href={routes.cart} className={`${styles.link} ${styles.cart}`} aria-label={`Cart, ${count} items`}>
      <span className={styles.cartWord} aria-hidden="true">
        Cart
        {count ? <sup className={styles.cartSup}>{count}</sup> : null}
      </span>
      <span className={styles.cartIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M5 8h14l-1.2 12H6.2L5 8Z" strokeLinejoin="round" />
          <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
        </svg>
        {count ? <span className={styles.count}>{count}</span> : null}
      </span>
    </Link>
  );
}
