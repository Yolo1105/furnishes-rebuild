import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { CaseSheets } from "./CaseSheets";
import { Heritage } from "./Heritage";
import { Journal } from "./Journal";
import { Manifesto } from "./Manifesto";
import { Packages } from "./Packages";
import { Partners } from "./Partners";
import { Questions } from "./Questions";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then who we are and its figures, the everyday cases, the packages, the makers, the swatches, the journal, the questions, the heritage band and a last call to start a project, then the footer. */
export default function Studio() {
  return (
    <>
      <main className={styles.page} data-page="studio">
        <h1 className="visually-hidden">Design your room</h1>
        <PeachBackdrop />
        <StudioView />
        <Manifesto />
        <CaseSheets />
        <Packages />
        <Partners />
        <Swatches />
        <Journal />
        <Questions />
        <Heritage />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
