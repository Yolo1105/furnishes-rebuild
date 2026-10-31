import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Quiz } from "./Quiz";
import styles from "./Quiz.module.css";

export const metadata: Metadata = { title: "Quiz", description: "Answer a few questions about your space and see which Furnishes pieces suit it." };

/** The quiz, over the peach: no sign-in, any step can be skipped, and results come straight away. */
export default function QuizPage() {
  return (
    <>
      <main id="main" className={styles.page}>
        <h1 className="visually-hidden">Find what you need</h1>
        <PeachBackdrop />
        <Quiz />
      </main>
      <SiteFooter />
    </>
  );
}
