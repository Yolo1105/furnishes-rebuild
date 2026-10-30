import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { CaseSheets } from "./CaseSheets";
import { Journal } from "./Journal";
import { Packages } from "./Packages";
import { Questions } from "./Questions";
import { StartProject } from "./StartProject";
import { INTRO_SCRIPT } from "./intro";
import { StudioView } from "./StudioView";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then the everyday cases, the packages, the journal, the questions and a last call to start a project, then the footer. */
export default function Studio() {
  return (
    <>
      <main className={styles.page} data-page="studio">
        {/* before anything is painted: whether the arrival plays (intro.ts) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <h1 className="visually-hidden">Design your room</h1>
        <PeachBackdrop />
        <StudioView />
        <CaseSheets />
        <Packages />
        <Journal />
        <Questions />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
