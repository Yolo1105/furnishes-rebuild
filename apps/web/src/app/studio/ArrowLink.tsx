import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

/** The studio's quiet call: its words over an underline, an arrow after, nudged on hover. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.link}>
      {children}
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
