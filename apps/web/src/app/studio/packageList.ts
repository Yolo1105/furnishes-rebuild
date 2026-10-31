import { marked, shown } from "@/lib/facts";
import { EMAIL } from "@/lib/contact";

/**
 * The ways to get help, after the everyday cases: what each covers, row by
 * row. `rows`: each row's label, then its cell for each way, in PACKAGES' order.
 */
export const PACKAGES: readonly { name: string; line: string }[] = [
  { name: "A visit", line: "When the answer depends on the room itself" },
  { name: "AI assistant", line: "When you want to try an idea" },
  { name: "Email", line: "When you want a person to answer" },
];

export const PACKAGE_ROWS: readonly { label: string; cells: readonly [string, string, string] }[] = [
  {
    label: "Includes",
    cells: [
      "We look at the room with you, measure what matters, answer your questions and suggest what could work",
      "Suggestions, answers about the furniture, and proposals that fixed rules then check",
      "Product questions, advice, quotes, design reviews and help with an order",
    ],
  },
  { label: "When", cells: [`${shown("consultLength")}, at a time we agree`, "Any time, once you sign in", `A reply within ${shown("replyTime")}`] },
  { label: "Where", cells: [shown("consultArea"), "Online", EMAIL] },
  { label: "Cost", cells: [shown("consultPrice"), marked("aiCost", "Free with an account"), "Free"] },
  {
    label: "Not included",
    cells: ["Building or renovation work", "Measuring your room, or deciding what is safe to make", "Phone or live chat"],
  },
];
