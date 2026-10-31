import {
  ACTIVITIES,
  type ActivityId,
  BUDGETS,
  type BudgetId,
  lowestPrice,
  type Product,
  PRODUCTS,
  USES,
  type UseId,
  WIDTHS,
  type WidthId,
} from "@/features/products/catalogue";

import { LIFE } from "./quizCopy";

/** Each question's picks, by its id in the quiz. */
export type QuizAnswers = Record<string, readonly string[]>;

const MOST = 3;

const first = (a: QuizAnswers, id: string) => a[id]?.[0];

/** The pieces that best fit the answers, available ones first, each with why it fits. A budget or width it misses rules it out. */
export function match(a: QuizAnswers): { product: Product; reasons: string[] }[] {
  const where = first(a, "where");
  const use = (where === "office" ? "work" : where) as UseId | undefined;
  const width = first(a, "width") as WidthId | undefined;
  const budget = first(a, "budget") as BudgetId | undefined;
  const wants = (a.want ?? []) as readonly ActivityId[];
  const sharing = first(a, "who") === "sharing" || first(a, "who") === "team";

  return PRODUCTS.filter(
    (p) => (!width || WIDTHS[width].fits(p.size.w)) && (!budget || BUDGETS[budget].fits(lowestPrice(p.id))) && (!use || p.uses.includes(use)),
  )
    .map((product) => {
      const reasons: string[] = [];
      if (use) reasons.push(`It suits ${where === "office" ? "an office" : USES[use].toLowerCase()}.`);
      for (const w of wants) if (product.activities.includes(w)) reasons.push(`It ${ACTIVITIES[w].fits}.`);
      for (const l of LIFE) {
        if (a.life?.includes(l.id) && ((l.use && product.uses.includes(l.use)) || (l.activity && product.activities.includes(l.activity)))) {
          reasons.push(l.reason);
        }
      }
      if (sharing && product.activities.includes("divide")) reasons.push(`It ${ACTIVITIES.divide.fits}.`);
      if (width) reasons.push(`It fits a width of ${WIDTHS[width].name.toLowerCase()}.`);
      if (budget) reasons.push(`It's in your budget, ${BUDGETS[budget].name}.`);
      return { product, reasons: [...new Set(reasons)], score: reasons.length + (product.status === "launch" ? 0.5 : 0) };
    })
    .toSorted((x, y) => y.score - x.score)
    .slice(0, MOST)
    .map(({ product, reasons }) => ({ product, reasons }));
}

/** What to know given the answers: things the pieces alone can't settle. */
export function notes(a: QuizAnswers): string[] {
  const out: string[] = [];
  if (first(a, "home") === "rent" || first(a, "drill") === "no" || first(a, "keep") === "moves") {
    out.push("If you can't drill, check each piece's stability guidance before you choose, and your landlord's or HDB's rules.");
  }
  if (first(a, "colour") === "dark" || first(a, "colour") === "colour" || first(a, "style") === "bold") {
    out.push("We start with white matte and birch edges, and more colours follow. Our ready-made furniture may suit this better.");
  }
  if (first(a, "keep") === "most") out.push("Measure around what stays, and leave room for doors and drawers to open.");
  return out;
}
