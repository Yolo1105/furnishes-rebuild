import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Questions } from "../studio/Questions";
import { StartProject } from "../studio/StartProject";
import { MakingDays } from "./MakingDays";
import { Projects } from "./Projects";
import { Team } from "./Team";
import { WhoWeAre } from "./WhoWeAre";
import { Workshop } from "./Workshop";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "About" };

/** About, over the peach in the studio's words: who we are, the workshop, a piece's days from order to door, the projects and the team, then the studio's questions, its last call and the footer. */
export default function About() {
  return (
    <>
      <main className={styles.page}>
        <PeachBackdrop />
        <WhoWeAre />
        <Workshop />
        <MakingDays />
        <Projects />
        <Team />
        <Questions />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
