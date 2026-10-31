import { shown } from "@/lib/facts";

/** The questions people ask first. Drafts for approval; fuller answers are on the help page. */
export const QUESTIONS: readonly { question: string; answer: string }[] = [
  {
    question: "What do you sell?",
    answer:
      "Three kinds: usual ready-made furniture, modular pieces we have already designed, and modular pieces you compose yourself. All are made by our partner factory in China and delivered in Singapore.",
  },
  {
    question: "How long does it take?",
    answer: `Flat-packed modular pieces take ${shown("leadFlatPack")}, and built pieces ${shown("leadBuilt")}. Ready-made furniture takes ${shown("leadReadyMade")}.`,
  },
  {
    question: "Does it come built?",
    answer: "Modular pieces can arrive already built or flat-packed with their steps. You choose before you order.",
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
    answer: `Yes, on modular pieces. Height changes in steps of 40 cm up to 160 cm, and width is 60, 120 or 180 cm. A custom size costs ${shown("customSizePrice")} and takes ${shown("leadCustomExtra")}.`,
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
  {
    question: "Do you sell furniture, or parts?",
    answer: "Furniture. You start with a whole piece and never need to learn how the parts work. Add-ons are sold for the pieces that take them.",
  },
  {
    question: "Do I have to compose my own?",
    answer: "No. The standard version is complete as it stands. Change something only if it makes a real difference for you.",
  },
  {
    question: "Do I have to use the AI assistant?",
    answer: "No. You can browse, compare and buy without ever chatting to it. It's there for people who find it easier to describe what they want.",
  },
  {
    question: "Will it work with furniture I already have?",
    answer: "Yes, you can plan around your own desk, bed or cabinet. Standing beside it and being fixed to it are different things, and we only connect to it where a piece's page says so.",
  },
  {
    question: "Is everything in the picture included?",
    answer: "No. The list on the piece's page is what you get. Computers, old desks, lamps and decorations in a picture may not be part of the sale.",
  },
  {
    question: "What am I paying for?",
    answer: "A finished piece: the making and surface, its structure and add-ons, the way it's arranged for its use, and delivery. It should be worth it for what it does today, not only for what you might add later.",
  },
  {
    question: "Can I take it when I move?",
    answer: "It depends on the piece. We check the parts, how they travel and the new spot, and it may need arranging differently there. We don't promise it for the whole range.",
  },
  {
    question: "Will a room divider block sound?",
    answer: "No. It gives you privacy from view, storage and two usable sides, but it isn't soundproofing and it isn't building work.",
  },
  {
    question: "Do you ship outside Singapore?",
    answer: `Mainly Singapore for now, with worldwide delivery planned. ${shown("exportRoutes")} Write to us and we quote each order.`,
  },
  {
    question: "Will new parts match the ones I already have?",
    answer: "They work the same, but colour and grain can differ between batches, and older parts change with use. If a difference is noticeable, we tell you before you buy.",
  },
  {
    question: "Can I have it opening to the left or the right?",
    answer: "It depends on the piece, so ask us about the one you want. Its page shows only the choices that have been checked.",
  },
  {
    question: "Can a bedside table go beside the sofa?",
    answer: "It can, but check the height first. A good height by a bed may not suit a sofa arm, so compare it with what you'd be reaching from.",
  },
];
