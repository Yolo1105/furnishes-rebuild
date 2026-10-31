import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Heritage } from "../about/Heritage";
import { CaseSheets } from "./CaseSheets";
import { Compare } from "./Compare";
import { DesignYourRoom } from "./DesignYourRoom";
import { Furniture } from "./Furniture";
import { HowToBuy } from "./HowToBuy";
import { Manifesto } from "./Manifesto";
import { NotSure } from "./NotSure";
import { Packages } from "./Packages";
import { ReadMore } from "./ReadMore";
import { Questions } from "./Questions";
import { SoundFamiliar } from "./SoundFamiliar";
import { StartProject } from "./StartProject";
import { Swatches } from "./Swatches";
import { StudioView } from "./StudioView";
import { WhatItDoes } from "./WhatItDoes";
import { WhoFor } from "./WhoFor";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Furniture for Singapore homes and small offices" };

/** The studio: the room photos and the floor plan side by side (the plan taking the stage as it scrolls on), then the three kinds of furniture and why, the furniture, who it is for and what it can do, who we are, exploring by problem, the everyday cases, how to buy, designing your room, ways to get help, the heritage, the swatches, where to read more, the common questions, help for the unsure and a last call to start a project, then the footer. */
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
        <SoundFamiliar />
        <Manifesto />
        <CaseSheets />
        <HowToBuy />
        <DesignYourRoom />
        <Packages />
        {/* The makers come back here once they can be named. */}
        <Heritage />
        <Swatches />
        <ReadMore />
        <Questions />
        <NotSure />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
