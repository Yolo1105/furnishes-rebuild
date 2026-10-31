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
  {
    question: "Is delivery included?",
    answer: `${shown("gstTerms")} We deliver only in Singapore for now. For other countries, write to us and we quote each order.`,
  },
  {
    question: "Can I change the size?",
    answer: `Yes, on customizable pieces. Height changes in steps of 40 cm up to 160 cm, and width is 60, 120 or 180 cm. A custom size costs ${shown("customSizePrice")} and takes ${shown("leadCustomExtra")}.`,
  },
  {
    question: "Who puts it together?",
    answer: `Flat-packed pieces come with their steps. ${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.`,
  },
  {
    question: "Can I return it?",
    answer: `${shown("returnsTerms")} Custom pieces can be returned only if they are faulty, damaged or wrong. ${shown("warranty")}`,
  },
  {
    question: "Will it fit my HDB flat, and is it allowed?",
    answer: `Product pages show each piece's width, height and depth, so measure the spot and the way in first. ${shown("hdbRules")}`,
  },
  {
    question: "Do I have to drill into the wall?",
    answer: "It depends on the piece. Taller pieces may need fixing to the wall, so we don't promise no drilling for the whole range.",
  },
  {
    question: "Can I add to it later?",
    answer: "Often, yes. An add-on or a door can be added to a piece that takes it. Bigger changes need checking against the version you have.",
  },
  {
    question: "Can I buy for an office?",
    answer: `Yes. ${shown("officeTerms")}`,
  },
  {
    question: "Are the pictures real photographs?",
    answer: "The furniture pictures are 3D renders, and the room photos show ideas, not our furniture. Lamps, books and other objects aren't included.",
  },
  {
    question: "What does the AI assistant do?",
    answer: `It answers questions about the furniture and suggests pieces for your room, and fixed rules check what it proposes. It's ${shown("aiCost")}. You need to sign in to use it and the 3D view.`,
  },
  {
    question: "What if a part breaks or goes missing?",
    answer: `Write to us with your order number and photos. ${shown("replacementParts")}`,
  },
];
