import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { LeadTimes } from "../contact/LeadTimes";
import { AfterYouBuy } from "../studio/AfterYouBuy";
import { AiHelps } from "../studio/AiHelps";
import { BeforeYouOrder } from "../studio/BeforeYouOrder";
import { BuildIt } from "../studio/BuildIt";
import details from "../studio/Details.module.css";
import { Questions } from "../studio/Questions";
import styles from "../studio/page.module.css";

export const metadata: Metadata = { title: "Buying guide", description: "What to measure, building it yourself, how long it takes, life after buying, the AI assistant and every question." };

/** The buying guide: what to measure, building it, the wait, life after buying, the AI assistant and every question. */
export default function BuyingGuide() {
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <header className={details.pageHead}>
          <h1>Buying guide</h1>
          <p className={details.lede}>Everything to know before you order and once it's home.</p>
        </header>
        <BeforeYouOrder />
        <BuildIt />
        <LeadTimes />
        <AfterYouBuy />
        <AiHelps />
        <Questions />
      </main>
      <SiteFooter />
    </>
  );
}
