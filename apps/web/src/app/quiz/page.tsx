import type { Metadata } from "next";
import { SiteFooter } from "@/shell/SiteFooter";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Quiz } from "./Quiz";

export const metadata: Metadata = {
  title: "Find your piece",
  description: "Four quick questions about the spot that bothers you, its space and your budget, then three Furnishes pieces that fit.",
};

/** The quiz: four questions, any of them skippable, then the pieces that fit. */
export default function QuizPage() {
  return (
    <>
      <main id="main">
        <Section id="quiz">
          <SectionHead
            as="h1"
            id="quiz"
            eyebrow="Quiz"
            title="Find your piece."
            lede="Four questions about the spot that bothers you. Skip any you're unsure of, and see what fits."
          />
          <Quiz />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
