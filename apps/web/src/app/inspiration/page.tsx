import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Ideas } from "./Ideas";
import { ProjectSheets } from "./ProjectSheets";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Inspiration", description: "Everyday room problems in Singapore homes, and ideas for what furniture can do about them." };

/** Inspiration: the ideas running across over the peach, each as drawn and as a mood photo, then ways to find a need, then the footer. */
export default function Inspiration() {
  return (
    <>
      <main id="main" className={styles.page} data-page="inspiration">
        <PeachBackdrop />
        <ProjectSheets />
        <Ideas />
      </main>
      <SiteFooter />
    </>
  );
}
