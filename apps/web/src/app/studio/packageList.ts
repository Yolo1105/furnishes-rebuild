import { marked, shown } from "@/lib/facts";
import { EMAIL } from "@/lib/contact";
import { contactHref, routes } from "@/lib/routes";

const capitalised = (words: string) => words.charAt(0).toUpperCase() + words.slice(1);

/**
 * The ways to get help, after the everyday cases: what each covers, row by
 * row, what it costs first. Each row: its label, then its cell for each way, in PACKAGES' order.
 */
export const PACKAGES: readonly { name: string; line: string; call: string; href: string }[] = [
  { name: "A visit", line: "When the answer depends on the room itself", call: "Book a visit", href: contactHref("visit") },
  { name: "AI assistant", line: "When you want to try an idea", call: "Sign in to start", href: routes.signIn },
  { name: "Email", line: "When you want a person to answer", call: "Send an email", href: `mailto:${EMAIL}` },
];

export const PACKAGE_ROWS: readonly { label: string; cells: readonly [string, string, string] }[] = [
  { label: "Cost", cells: [shown("consultPrice"), marked("aiCost", "Free with an account"), "Free"] },
  {
    label: "Includes",
    cells: [
      "We look at the room with you, measure what matters, answer your questions and suggest what could work",
      "Suggestions, answers about the furniture, and proposals that fixed rules then check",
      "Product questions, advice, quotes, design reviews and help with an order",
    ],
  },
  { label: "When", cells: [`${shown("consultLength")}, at a time we agree`, "Any time, once you sign in", `A reply within ${shown("replyTime")}`] },
  { label: "Where", cells: [capitalised(shown("consultArea")), "Online", EMAIL] },
  {
    label: "Not included",
    cells: ["Building or renovation work", "Measuring your room, or deciding what is safe to make", "Phone or live chat"],
  },
];
