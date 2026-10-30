import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { ProjectSheets } from "./ProjectSheets";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Inspiration" };

/** Inspiration: the selected projects running across over the peach, each as drawn and as built, then the footer. */
export default function Inspiration() {
  return (
    <>
      <main className={styles.page} data-page="inspiration">
        <PeachBackdrop />
        <ProjectSheets />
      </main>
      <SiteFooter />
    </>
  );
}
