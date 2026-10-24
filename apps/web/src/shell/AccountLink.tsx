"use client";

import Link from "next/link";
import { DEMO_NAME, firstName } from "@/features/auth/demo-account";
import { useDemoSession } from "@/features/auth/demo-session";
import { routes } from "@/lib/routes";
import styles from "./SiteHeader.module.css";

/** "Sign in", or the signed-in person's first name. */
export function AccountLink() {
  const demo = useDemoSession();
  return (
    <Link href={routes.signIn} className={styles.link}>
      {demo ? firstName(DEMO_NAME) : "Sign in"}
    </Link>
  );
}
