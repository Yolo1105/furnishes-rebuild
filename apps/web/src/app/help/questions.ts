import { isReal, shown } from "@/lib/facts";

export type Question = { question: string; answer: string; /** An anchor other pages link to. */ id?: string };

/** The questions people ask, by topic. Drafts for approval. */
export const QUESTION_GROUPS: readonly { topic: string; questions: readonly Question[] }[] = [
  {
    topic: "Choosing a piece",
    questions: [
      {
        question: "What do you sell?",
        answer:
          "Three kinds: usual ready-made furniture, modular pieces we have already designed, and modular pieces you compose yourself. All are made by our partner factory in China and delivered in Singapore.",
      },
      {
        id: "measuring",
        question: "How do I measure for a piece?",
        answer:
          "Measure the spot where it will stand, above any skirting board; the way in, for the piece or its largest box; and room to build it and open its doors. Product pages show each piece's width, height and depth.",
      },
      {
        question: "Will it fit my HDB flat, and is it allowed?",
        answer: `Measure the spot and the way in first. ${shown("hdbRules")}`,
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
        question: "What finishes can I choose?",
        answer: "We start with white matte faces and birch edges. More colours and textures follow once real samples are confirmed.",
      },
      {
        question: "Will it work with furniture I already have?",
        answer: "Yes, you can plan around your own desk, bed or cabinet. Standing beside it and being fixed to it are different things, and we only connect to it where a piece's page says so.",
      },
      {
        question: "Can a bedside table go beside the sofa?",
        answer: "It can, but check the height first. A good height by a bed may not suit a sofa arm, so compare it with what you'd be reaching from.",
      },
      {
        question: "Can I have it opening to the left or the right?",
        answer: "It depends on the piece, so ask us about the one you want. Its page shows only the choices that have been checked.",
      },
      {
        question: "Are the pictures real photographs?",
        answer: "The furniture pictures are 3D renders, and the room photos show ideas, not our furniture. The list on a piece's page is what you get; lamps, books and other objects aren't included.",
      },
      {
        question: "What am I paying for?",
        answer: "A finished piece: the making and surface, its structure and add-ons, the way it's arranged for its use, and delivery. It should be worth it for what it does today.",
      },
    ],
  },
  {
    topic: "Ordering and delivery",
    questions: [
      {
        question: "How long does it take?",
        answer: `Flat-packed modular pieces take ${shown("leadFlatPack")}, and built pieces ${shown("leadBuilt")}. Ready-made furniture takes ${shown("leadReadyMade")}.`,
      },
      {
        question: "Does it come built?",
        answer: "Modular pieces can arrive already built or flat-packed with their steps. You choose before you order.",
      },
      {
        question: "Who puts it together?",
        answer: `Flat-packed pieces come with their steps. ${shown("assemblyDetails")} Installation costs ${shown("installPrice")}.`,
      },
      {
        question: "Can I change the size?",
        answer: `Yes, on modular pieces. Height changes in steps of 40 cm up to 160 cm, and width is 60, 120 or 180 cm. A custom size costs ${shown("customSizePrice")} and takes ${shown("leadCustomExtra")}.`,
      },
      {
        question: "Is delivery included?",
        answer: `${shown("gstTerms")} We deliver only in Singapore for now. For other countries, write to us and we quote each order.`,
      },
      {
        question: "Do you ship outside Singapore?",
        answer: `Mainly Singapore for now. ${shown("exportRoutes")} Write to us and we quote each order.`,
      },
      {
        question: "Can I buy for an office?",
        answer: `Yes. Tell us your team size, your space and when you need it. ${shown("officeTerms")}`,
      },
    ],
  },
  {
    topic: "Living with it",
    questions: [
      {
        question: "Can I return it?",
        answer: `${shown("returnsTerms")} Custom pieces can be returned only if they are faulty, damaged or wrong. ${shown("warranty")}`,
      },
      {
        question: "Can I return a piece once it's built or installed?",
        answer: shown("returnsBuilt"),
      },
      {
        question: "What if a part breaks or goes missing?",
        answer: `Write to us with your order number and photos. ${shown("replacementParts")}`,
      },
      {
        question: "Can I add to it later?",
        answer: "Often, yes. An add-on or a door can be added to a piece that takes it. Bigger changes need checking against the version you have.",
      },
      {
        question: "Will new parts match the ones I already have?",
        answer: "They work the same, but colour and grain can differ between batches, and older parts change with use. If a difference is noticeable, we tell you before you buy.",
      },
      {
        question: "Can I take it when I move?",
        answer: `It depends on the piece. We check the parts, how they travel and the new spot, and it may need arranging differently there. ${shown("takeApart")}`,
      },
      {
        question: "Do I have to drill into the wall?",
        answer: "It depends on the piece. Taller pieces may need fixing to the wall, so we don't promise no drilling. If you rent, check your landlord's or HDB's rules first.",
      },
      ...(isReal("weightLimits") && isReal("stability")
        ? [{ question: "How much can it hold?", answer: `${shown("weightLimits")} ${shown("stability")}` }]
        : []),
      {
        question: "Will a room divider block sound?",
        answer: "No. It gives you privacy from view, storage and two usable sides, but it isn't soundproofing and it isn't building work.",
      },
      {
        question: "Can I use accessories from other makers?",
        answer: "Accessories we offer are checked against the piece they fit. A hole spacing that looks the same doesn't mean another maker's part is safe to use.",
      },
      {
        question: "Is it made for children?",
        answer: "No. We don't claim any piece is safe for children, even if it's low or has rounded corners. Keep children from climbing on it, and fix tall pieces as their guide says.",
      },
    ],
  },
];
