import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Customize } from "../studio/Customize";
import details from "../studio/Details.module.css";
import { KeepWhatYouHave } from "../studio/KeepWhatYouHave";
import { OtherUses } from "../studio/OtherUses";
import { StartProject } from "../studio/StartProject";
import { WhyModular } from "../studio/WhyModular";
import styles from "../studio/page.module.css";

export const metadata: Metadata = { title: "Why modular", description: "Why Furnishes builds furniture from parts, the parts each piece takes, what they can become and what you can change." };

/** Why modular: the reasons and parts, what else they can become, keeping what you own, and what can be changed. */
export default function WhyModularPage() {
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <header className={details.pageHead}>
          <h1>Why modular</h1>
          <p className={details.lede}>What modular furniture gets you, what it doesn't, and the parts behind it.</p>
        </header>
        <WhyModular />
        <OtherUses />
        <KeepWhatYouHave />
        <Customize />
        <StartProject />
      </main>
      <SiteFooter />
    </>
  );
}
