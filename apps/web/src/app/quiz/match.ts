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
import type { QuestionId } from "./quizCopy";

/** Each question's pick, by its id in the quiz; a skipped question has none. */
export type QuizAnswers = Partial<Record<QuestionId, string>>;

const MOST = 3;

/** The pieces that best fit the answers, available ones first, each with why it fits. A budget or width it misses rules it out. */
export function match(a: QuizAnswers): { product: Product; reasons: string[] }[] {
  const { where } = a;
  const use = (where === "office" ? "work" : where) as UseId | undefined;
  const width = a.width as WidthId | undefined;
  const budget = a.budget as BudgetId | undefined;
  const want = a.want as ActivityId | undefined;

  return PRODUCTS.filter(
    (p) => (!width || WIDTHS[width].fits(p.size.w)) && (!budget || BUDGETS[budget].fits(lowestPrice(p.id))) && (!use || p.uses.includes(use)),
  )
    .map((product) => {
      const reasons: string[] = [];
      if (use) reasons.push(`It suits ${where === "office" ? "an office" : USES[use].toLowerCase()}.`);
      if (want && product.activities.includes(want)) reasons.push(`It ${ACTIVITIES[want].fits}.`);
      if (width) reasons.push(`It fits a width of ${WIDTHS[width].name.toLowerCase()}.`);
      if (budget) reasons.push(`It's in your budget, ${BUDGETS[budget].name}.`);
      return { product, reasons, score: reasons.length + (product.status === "launch" ? 0.5 : 0) };
    })
    .toSorted((x, y) => y.score - x.score)
    .slice(0, MOST)
    .map(({ product, reasons }) => ({ product, reasons }));
}
