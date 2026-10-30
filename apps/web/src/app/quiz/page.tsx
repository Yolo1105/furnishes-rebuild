import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";

export const metadata: Metadata = { title: "Quiz" };

/** The quiz, over the peach: nothing on it yet. */
export default function Quiz() {
  return (
    <>
      <main>
        <PeachBackdrop />
      </main>
      <SiteFooter />
    </>
  );
}
