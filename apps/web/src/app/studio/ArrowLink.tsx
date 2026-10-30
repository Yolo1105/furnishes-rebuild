import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

/** The site's secondary call: the outline button. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  );
}
