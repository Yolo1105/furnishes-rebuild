"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

/** The bar's links behind a button on narrower screens; going to a page or pressing Escape closes it. */
export function PhoneMenu({ links }: { links: readonly { label: string; href: string }[] }) {
  const path = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menu.current) menu.current.open = false;
    };
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);

  return (
    <details key={path} ref={menu} className={styles.menu} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className={`btn-secondary ${styles.menuButton}`} aria-expanded={open}>
        Menu
      </summary>
      <ul className={styles.menuLinks}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} aria-current={path === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
