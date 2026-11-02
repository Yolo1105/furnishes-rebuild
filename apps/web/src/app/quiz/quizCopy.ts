import { ACTIVITIES, BUDGETS, USES, WIDTHS } from "@/features/products/catalogue";

const options = (o: Record<string, { name: string }>) => Object.entries(o).map(([id, { name }]) => ({ id, name }));

/** The four answers match() reads. */
export type QuestionId = "where" | "want" | "width" | "budget";

export type QuizQuestion = { id: QuestionId; title: string; lede: string; options: readonly { id: string; name: string }[] };

/** The quiz, one question a screen. Any can be skipped, and any answer changed by going back. */
export const QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "where",
    title: "Where does it bother you?",
    lede: "Pick the room, or the office.",
    options: [...Object.entries(USES).map(([id, name]) => ({ id, name })), { id: "office", name: "An office" }],
  },
  { id: "want", title: "What should it do?", lede: "Pick the one that matters most.", options: options(ACTIVITIES) },
  { id: "width", title: "How much space?", lede: "Roughly how wide is the spot, wall to wall?", options: options(WIDTHS) },
  { id: "budget", title: "What's your budget for a piece?", lede: "Pick the closest. Prices are per piece, flat-packed.", options: options(BUDGETS) },
];
