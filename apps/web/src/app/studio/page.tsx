import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Heritage } from "../about/Heritage";
import { LeadTimes } from "../contact/LeadTimes";
import { AfterYouBuy } from "./AfterYouBuy";
import { AiHelps } from "./AiHelps";
import { BeforeAfter } from "./BeforeAfter";
import { BeforeYouOrder } from "./BeforeYouOrder";
import { BuildIt } from "./BuildIt";
import { CaseSheets } from "./CaseSheets";
import { CloserLook } from "./CloserLook";
import { Compare } from "./Compare";
import { Customize } from "./Customize";
import { DesignYourRoom } from "./DesignYourRoom";
import { Furniture } from "./Furniture";
import { HowToBuy } from "./HowToBuy";
import { KeepWhatYouHave } from "./KeepWhatYouHave";
import { Manifesto } from "./Manifesto";
import { NotNoticed } from "./NotNoticed";
import { NotSure } from "./NotSure";
import { OtherUses } from "./OtherUses";
import { Packages } from "./Packages";
import { Questions } from "./Questions";
import { SoundFamiliar } from "./SoundFamiliar";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import { WhatItDoes } from "./WhatItDoes";
import { WhoFor } from "./WhoFor";
import { WhyModular } from "./WhyModular";
import { WorkWithUs } from "./WorkWithUs";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Furniture for Singapore homes and small offices" };

/** The studio: the room photos and the flat's floor plan side by side over the peach (the plan taking the stage as it scrolls on), then the three kinds of furniture and why, the furniture itself, who it is for, what it can do and what matters in each space, exploring by problem, why modular, its parts and what else they can become, who we are and its figures, the everyday cases, needs you may not have noticed, before and after, keeping what you own, what can be changed, how to buy, what to measure, building it yourself, how long it takes, life after buying, what the AI does, designing your room, the packages, the heritage, the swatches, the questions, help for the unsure, partners and a last call to start a project, then the footer. */
export default function Studio() {
  return (
    <>
      <main id="main" className={styles.page} data-page="studio">
        <h1 className="visually-hidden">Furniture for Singapore homes and small offices</h1>
        <PeachBackdrop />
        <StudioView />
        <Compare />
        <Furniture />
        <WhoFor />
        <WhatItDoes />
        <CloserLook />
        <SoundFamiliar />
        <WhyModular />
        <OtherUses />
        <Manifesto />
        <CaseSheets />
        <NotNoticed />
        <BeforeAfter />
        <KeepWhatYouHave />
        <Customize />
        <HowToBuy />
        <BeforeYouOrder />
        <BuildIt />
        <LeadTimes />
        <AfterYouBuy />
        <AiHelps />
        <DesignYourRoom />
        <Packages />
        {/* The makers come back here once they can be named. */}
        <Heritage />
        <Swatches />
        <Questions />
        <NotSure />
        <WorkWithUs />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
