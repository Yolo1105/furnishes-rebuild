import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Heritage } from "../about/Heritage";
import { LeadTimes } from "../contact/LeadTimes";
import { AfterYouBuy } from "./AfterYouBuy";
import { BeforeYouOrder } from "./BeforeYouOrder";
import { CaseSheets } from "./CaseSheets";
import { Compare } from "./Compare";
import { Customize } from "./Customize";
import { DesignYourRoom } from "./DesignYourRoom";
import { Furniture } from "./Furniture";
import { HowToBuy } from "./HowToBuy";
import { KeepWhatYouHave } from "./KeepWhatYouHave";
import { Manifesto } from "./Manifesto";
import { NotSure } from "./NotSure";
import { Packages } from "./Packages";
import { Questions } from "./Questions";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import { WhatItDoes } from "./WhatItDoes";
import { WhoFor } from "./WhoFor";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Furniture for Singapore homes and small offices" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then the furniture and how the two lines differ, who it is for and what it can do, who we are and its figures, the everyday cases, keeping what you own, what can be changed, how to buy, what to measure, how long it takes, life after buying, designing your room, the packages, the heritage, the swatches, the questions, help for the unsure and a last call to start a project, then the footer. */
export default function Studio() {
  return (
    <>
      <main id="main" className={styles.page} data-page="studio">
        <h1 className="visually-hidden">Furniture for Singapore homes and small offices</h1>
        <PeachBackdrop />
        <StudioView />
        <Furniture />
        <Compare />
        <WhoFor />
        <WhatItDoes />
        <Manifesto />
        <CaseSheets />
        <KeepWhatYouHave />
        <Customize />
        <HowToBuy />
        <BeforeYouOrder />
        <LeadTimes />
        <AfterYouBuy />
        <DesignYourRoom />
        <Packages />
        {/* The makers come back here once they can be named. */}
        <Heritage />
        <Swatches />
        <Questions />
        <NotSure />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
