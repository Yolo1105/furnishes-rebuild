import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Heritage } from "../about/Heritage";
import { CaseSheets } from "./CaseSheets";
import { Manifesto } from "./Manifesto";
import { Packages } from "./Packages";
import { Partners } from "./Partners";
import { Questions } from "./Questions";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Design your room" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then who we are and its figures, the everyday cases, the packages, the makers, the heritage, the swatches, the questions and a last call to start a project, then the footer. */
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
        <Heritage />
        <Swatches />
        <Questions />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
