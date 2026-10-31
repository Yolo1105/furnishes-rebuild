import { marked } from "@/lib/facts";

/** The ready-made line by kind of furniture, till its own list of products arrives. `range`: its prices, marked till real. */
export const READY_MADE: readonly { name: string; line: string; range: string }[] = [
  { name: "Office chairs", line: "For a home desk or a whole team.", range: marked("readyMadePrices", "S$280 to S$900") },
  { name: "Office desks", line: "Single desks and shared benches.", range: marked("readyMadePrices", "S$450 to S$1,500") },
  { name: "Executive desks", line: "Larger desks for a room of their own.", range: marked("readyMadePrices", "S$1,800 to S$5,000") },
  { name: "Bookcases and cabinets", line: "Storage for home or office.", range: marked("readyMadePrices", "S$500 to S$2,000") },
  { name: "Dining tables", line: "For the flat or the office pantry.", range: marked("readyMadePrices", "S$700 to S$2,500") },
  { name: "Sofas", line: "For a living room or a meeting corner.", range: marked("readyMadePrices", "S$1,200 to S$4,000") },
];
