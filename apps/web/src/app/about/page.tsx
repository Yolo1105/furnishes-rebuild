import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Questions } from "../studio/Questions";
import { StartProject } from "../studio/StartProject";
import { WorkWithUs } from "../studio/WorkWithUs";
import { MakingDays } from "./MakingDays";
import { Team } from "./Team";
import { WhoWeAre } from "./WhoWeAre";
import { Heritage } from "./Heritage";
import { Workshop } from "./Workshop";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "About", description: "Who Furnishes is and how we make furniture for Singapore homes and small offices." };

/** About, over the peach: who we are, how it is made and our story, a piece's way from order to door, the team, then the questions, the last call and the footer. */
export default function About() {
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <WhoWeAre />
        <Workshop />
        <Heritage />
        <MakingDays />
        {/* Recognition (Projects.tsx) comes back here once it can be shown. */}
        <Team />
        <WorkWithUs />
        <Questions />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
