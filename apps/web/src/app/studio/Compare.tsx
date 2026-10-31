import { PRODUCTS, priceFrom } from "@/features/products/catalogue";
import { READY_MADE } from "@/features/products/readyMade";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const READY = "Ready-made furniture";
const DESIGNED = "Modular, already designed";
const COMPOSED = "Modular, composed by you";

const onSale = PRODUCTS.filter((p) => p.status === "launch").length;
const coming = PRODUCTS.filter((p) => p.status === "soon").length;
const cheapest = READY_MADE[0]!;
const dearest = READY_MADE[READY_MADE.length - 1]!;

const ROWS: readonly { label: string; ready: string; designed: string; composed: string }[] = [
  {
    label: "What it is",
    ready: "Usual finished furniture: chairs, desks, cabinets, tables and sofas.",
    designed: "A finished piece we designed from birch panels and parts, for one job such as an entryway or a bedside.",
    composed: "The same panels and parts, put together for your space.",
  },
  {
    label: "Why we sell it",
    ready: "Often a usual desk or sofa is all you need, and it's the simplest choice.",
    designed: "It does what usual furniture can't, without you planning anything.",
    composed: "For when no finished design suits your room, your things or your idea.",
  },
  {
    label: "Who decides the design",
    ready: "The factory.",
    designed: "We do. You just pick it.",
    composed: "You do. The AI assistant works out how your parts go together, and fixed rules check the result.",
  },
  {
    label: "What you can change",
    ready: "Nothing. It's sold as it is.",
    designed: "Nothing needed. You can make small changes, which turns it into your own composition.",
    composed: "Board size, colour, texture and add-ons, within what's been checked to work.",
  },
  {
    label: "How it reaches you",
    ready: "Delivered to you.",
    designed: "Your choice: already built, or flat-packed to build yourself with its steps.",
    composed: "Your choice: already built, or flat-packed with the steps for your own version.",
  },
  {
    label: "Range",
    ready: `${READY_MADE.length} kinds of furniture.`,
    designed: `${onSale} designs on sale now, ${coming} coming soon.`,
    composed: "Anything the parts allow. Anything beyond them goes to our team to review.",
  },
  {
    label: "Wait",
    ready: shown("leadReadyMade"),
    designed: `${shown("leadFlatPack")} flat-packed, ${shown("leadBuilt")} built.`,
    composed: `The same, plus ${shown("leadCustomExtra")} for a custom size.`,
  },
  {
    label: "Price",
    ready: `${cheapest.name} ${cheapest.range}, ${dearest.name.toLowerCase()} ${dearest.range}.`,
    designed: `Smallest piece ${priceFrom("bedside")}.`,
    composed: `The piece, plus ${shown("customSizePrice")} for a custom size and ${shown("addOnPrices")} for add-ons.`,
  },
  {
    label: "Later on",
    ready: "It stays as it is.",
    designed: "Can often take add-ons, or change its job with a new set of parts.",
    composed: "The same, checked against the version you own.",
  },
];

/** The three kinds of furniture side by side, and why all three are sold. */
export function Compare() {
  return (
    <section className={styles.section} aria-labelledby="compare-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>What we sell</span>
        </p>
        <h2 id="compare-title">Three kinds of furniture, and why.</h2>
        <p className={styles.lede}>Modular means built from panels and parts that work together. Not everyone needs that, so we sell usual furniture too. If you're choosing modular, buy one of our finished designs, or compose your own.</p>
      </header>
      <table className={`${styles.table} ${styles.three} reveal`}>
        <thead>
          <tr>
            <td />
            <th scope="col">{READY}</th>
            <th scope="col">{DESIGNED}</th>
            <th scope="col">{COMPOSED}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row" className={styles.rowLabel}>
                {r.label}
              </th>
              <td data-line={READY}>{r.ready}</td>
              <td data-line={DESIGNED}>{r.designed}</td>
              <td data-line={COMPOSED}>{r.composed}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={styles.rowLabel}>
              See them
            </th>
            <td data-line={READY}>
              <ArrowLink href={`${routes.products}#ready-made`}>See ready-made</ArrowLink>
            </td>
            <td data-line={DESIGNED}>
              <ArrowLink href={`${routes.collection}#find`}>See the designs</ArrowLink>
            </td>
            <td data-line={COMPOSED}>
              <ArrowLink href={routes.designYourRoom}>Compose your own</ArrowLink>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
