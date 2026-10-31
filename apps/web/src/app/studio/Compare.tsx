import { PRODUCTS, priceFrom } from "@/features/products/catalogue";
import { READY_MADE } from "@/features/products/readyMade";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const READY = "Ready-made";
const CUSTOM = "Customizable";

const onSale = PRODUCTS.filter((p) => p.status === "launch").length;
const coming = PRODUCTS.filter((p) => p.status === "soon").length;
const cheapest = READY_MADE[0]!;
const dearest = READY_MADE[READY_MADE.length - 1]!;

const ROWS: readonly { label: string; ready: string; custom: string }[] = [
  {
    label: "What it is",
    ready: "Finished furniture from our partner factory's range.",
    custom: "Whole pieces built from 18 mm birch panels, complete as they stand.",
  },
  {
    label: "Choose it when",
    ready: "You want a usual desk, chair, cabinet, table or sofa, for a home or a team.",
    custom: "A spot has an awkward size, or a particular job to do.",
  },
  {
    label: "Range",
    ready: `${READY_MADE.length} kinds of furniture.`,
    custom: `${onSale} pieces on sale now, ${coming} coming soon.`,
  },
  {
    label: "What you can change",
    ready: "Nothing. It's sold as it is.",
    custom: "Size in set steps, finish and add-ons. You also choose built or flat-packed.",
  },
  {
    label: "Wait",
    ready: shown("leadReadyMade"),
    custom: `${shown("leadFlatPack")} flat-packed, ${shown("leadBuilt")} built.`,
  },
  {
    label: "Price",
    ready: `${cheapest.name} ${cheapest.range}, ${dearest.name.toLowerCase()} ${dearest.range}.`,
    custom: `Smallest piece ${priceFrom("bedside")}.`,
  },
  {
    label: "Later on",
    ready: "It stays as it is.",
    custom: "A piece that takes them can often have add-ons or a door added.",
  },
];

/** The two lines side by side, for someone deciding between them. */
export function Compare() {
  return (
    <section className={styles.section} aria-labelledby="compare-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Which to choose</span>
        </p>
        <h2 id="compare-title">Ready-made or customizable?</h2>
      </header>
      <table className={`${styles.table} reveal`}>
        <thead>
          <tr>
            <td />
            <th scope="col">{READY}</th>
            <th scope="col">{CUSTOM}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label}>
              <th scope="row" className={styles.rowLabel}>
                {r.label}
              </th>
              <td data-line={READY}>{r.ready}</td>
              <td data-line={CUSTOM}>{r.custom}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={styles.rowLabel}>
              See them
            </th>
            <td data-line={READY}>
              <ArrowLink href={`${routes.products}#ready-made`}>See ready-made</ArrowLink>
            </td>
            <td data-line={CUSTOM}>
              <ArrowLink href={`${routes.collection}#find`}>See customizable</ArrowLink>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
