/**
 * Every business fact the site states that is not settled, in one place.
 * `draft` values are our working answers, not confirmed facts: pages show them
 * as they stand. `placeholder` values can't be made up (test results, people,
 * awards, registration details), so they say what is missing and never
 * render: call sites check `isReal` and drop the sentence resting on one. `pnpm check:facts` lists both and fails until each is real: run it
 * before launch.
 */
type Fact = { value: string; status: "real" | "draft" | "placeholder" };

const draft = (value: string): Fact => ({ value, status: "draft" });
const placeholder = (value: string): Fact => ({ value, status: "placeholder" });

/** Weeks from order to arrival by kind of piece, for the lead-time chart. */
export const LEAD_WEEKS = {
  flatPack: { from: 6, to: 8 },
  built: { from: 8, to: 10 },
  readyMade: { from: 8, to: 12 },
  addOns: { from: 4, to: 6 },
} as const;

/** Each modular piece's price in S$, by its id in the catalogue: flat-packed, then built. */
export const PIECE_PRICES: Record<string, { flat: number; built: number }> = {
  entry: { flat: 420, built: 540 },
  desk: { flat: 450, built: 570 },
  bedside: { flat: 180, built: 260 },
  kitchen: { flat: 340, built: 440 },
  "work-cart": { flat: 340, built: 440 },
  "low-cabinet": { flat: 890, built: 1190 },
  "device-cabinet": { flat: 300, built: 400 },
  console: { flat: 560, built: 740 },
  "coat-stand": { flat: 480, built: 620 },
  divider: { flat: 1150, built: 1550 },
  "sofa-back": { flat: 1250, built: 1650 },
  bookwall: { flat: 1150, built: 1550 },
  "bed-head": { flat: 980, built: 1300 },
  "mobile-screen": { flat: 520, built: 680 },
};

const weeks = ({ from, to }: { from: number; to: number }) => `${from} to ${to} weeks`;

export const FACTS = {
  piecePrices: draft("Ask us for the price"),
  readyMadePrices: draft("Ask us for the price"),
  addOnPrices: draft("S$12 to S$35 for small add-ons, S$45 to S$160 for large ones"),
  customSizePrice: draft("15% more"),
  specialColourPrice: draft("10% more"),
  installPrice: draft("S$80 to S$250"),
  readyMadeList: draft("Ask us for the current list."),
  leadFlatPack: draft(weeks(LEAD_WEEKS.flatPack)),
  leadBuilt: draft(weeks(LEAD_WEEKS.built)),
  leadCustomExtra: draft("2 to 3 weeks more"),
  leadReadyMade: draft(weeks(LEAD_WEEKS.readyMade)),
  leadAddOns: draft(weeks(LEAD_WEEKS.addOns)),
  consultPrice: draft("S$120, credited against an order"),
  consultLength: draft("60 minutes"),
  consultArea: draft("anywhere in Singapore"),
  aiCost: draft("free with an account"),
  finishList: draft("finish"),
  hdbRules: draft("We can't confirm these for your home, so please check before you start."),
  officeTerms: draft("We quote bulk orders one by one, and we issue invoices."),
  dpoContact: placeholder("Data Protection Officer's name and email"),
  processors: draft("These include the services we use for payments, email, storage and the AI assistant."),
  dataRetention: draft("We keep your account details while your account is open, and order records for as long as the law requires."),
  liabilityCap: draft("As far as the law allows, our liability is limited to what you paid for the order concerned."),
  assemblyDetails: draft("Small pieces are usually a job for one person, and larger ones need two."),
  takeApart: draft("Ask us before you take a piece apart to move it."),
  paymentMethods: draft("You pay by card at checkout."),
  replacementParts: draft("We'll tell you the price by email."),
  replyTime: draft("one business day"),
  supportHours: draft("Monday to Friday, 10am to 6pm"),
  supplierName: draft("Our partner factory in China"),
  companyStory: draft("Furnishes started with a plain problem: rooms in Singapore are small, and standard furniture doesn't always fit them."),
  companyDetails: placeholder("UEN and registered address"),
  award: placeholder("award name, year and link"),
  team: placeholder("other team names and roles"),
  weightLimits: placeholder("tested weight limits"),
  stability: placeholder("tested stability guidance"),
  exportRoutes: draft("Two routes from China: by sea in a shared container, about 2 to 3 weeks, or by sea in a full container for larger orders, about 2 weeks. Costs are quoted per order."),
  returnsBuilt: draft("A built or installed piece can be returned on the same terms, but collection is charged at cost, and quoted before we collect."),
  careGuide: draft("Wipe surfaces with a soft, damp cloth and dry them straight away. Avoid harsh cleaners, and keep plywood out of standing water and strong sun."),
  returnsTerms: draft("You have 14 days from delivery to return an unused piece in its original packaging."),
  warranty: draft("Manufacturing faults are covered for 12 months from delivery."),
  gstTerms: draft("Prices include GST and delivery in Singapore."),
} satisfies Record<string, Fact>;

/** Whether a fact can be shown: real or a working draft, not a placeholder. */
export function isReal(key: keyof typeof FACTS): boolean {
  return (FACTS[key] as Fact).status !== "placeholder";
}

/** Whether a fact is still missing; the sentence that rests on it should not render. */
export const isPlaceholder = (key: keyof typeof FACTS): boolean => !isReal(key);

/** A fact as a page shows it; empty if it is a placeholder, so callers check `isReal` first. */
export function shown(key: keyof typeof FACTS): string {
  return isReal(key) ? FACTS[key].value : "";
}

/** Words that rest on a fact; empty if the fact is a placeholder. */
export function marked(key: keyof typeof FACTS, words: string): string {
  return isReal(key) ? words : "";
}

/** A piece's lowest price, for its card. */
export function priceFrom(id: string): string {
  const price = PIECE_PRICES[id];
  return price ? marked("piecePrices", `from S$${price.flat.toLocaleString("en-SG")}`) : shown("piecePrices");
}

/** A piece's two prices, for its own page. */
export function priceInFull(id: string): string {
  const price = PIECE_PRICES[id];
  if (!price) return shown("piecePrices");
  const [flat, built] = [price.flat, price.built].map((n) => n.toLocaleString("en-SG"));
  return marked("piecePrices", `S$${flat} flat-packed, S$${built} built`);
}
