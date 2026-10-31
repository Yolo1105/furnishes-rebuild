import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Heritage } from "../about/Heritage";
import { CaseSheets } from "./CaseSheets";
import { DesignYourRoom } from "./DesignYourRoom";
import { Furniture } from "./Furniture";
import { HowToBuy } from "./HowToBuy";
import { Manifesto } from "./Manifesto";
import { Packages } from "./Packages";
import { Questions } from "./Questions";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import { WhoFor } from "./WhoFor";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Furniture for Singapore homes and small offices" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then the furniture and who it is for, who we are and its figures, the everyday cases, how to buy, designing your room, the packages, the heritage, the swatches, the questions and a last call to start a project, then the footer. */
export default function Studio() {
  return (
    <>
      <main id="main" className={styles.page} data-page="studio">
        <h1 className="visually-hidden">Furniture for Singapore homes and small offices</h1>
        <PeachBackdrop />
        <StudioView />
        <Furniture />
        <WhoFor />
        <Manifesto />
        <CaseSheets />
        <HowToBuy />
        <DesignYourRoom />
        <Packages />
        {/* The makers come back here once they can be named. */}
        <Heritage />
        <Swatches />
        <Questions />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
