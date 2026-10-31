import { shown } from "@/lib/facts";

/** The questions people ask first. Drafts for approval; fuller answers are on the help page. */
export const QUESTIONS: readonly { question: string; answer: string }[] = [
  {
    question: "What do you sell?",
    answer:
      "Ready-made furniture, and customizable pieces built from birch panels. Both are made by our partner factory in China and delivered in Singapore.",
  },
  {
    question: "How long does it take?",
    answer: `Flat-packed customizable pieces take ${shown("leadFlatPack")}, and built pieces ${shown("leadBuilt")}. Ready-made furniture takes ${shown("leadReadyMade")}.`,
  },
  {
    question: "Does it come built?",
    answer: "Customizable pieces can arrive already built or flat-packed with their steps. You choose before you order.",
  },
  {
    question: "What finishes can I choose?",
    answer: "We start with white matte faces and birch edges. More colours and textures follow once real samples are confirmed.",
  },
  {
    question: "Can someone come and look at my room?",
    answer: `Yes. We come to your room for a consultation of ${shown("consultLength")} and answer any questions. It costs ${shown("consultPrice")}. There is no showroom.`,
  },
];
