"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.css";

/** The bar's links behind a button on phones; going to a page closes it. */
export function PhoneMenu({ links }: { links: readonly { label: string; href: string }[] }) {
  const path = usePathname();
  return (
    <details key={path} className={styles.menu}>
      <summary className={styles.menuButton}>Menu</summary>
      <ul className={styles.menuLinks}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>{l.label}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
