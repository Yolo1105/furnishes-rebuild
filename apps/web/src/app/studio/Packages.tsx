import { contactHref } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import { PACKAGE_ROWS, PACKAGES } from "./packageList";
import styles from "./Packages.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The packages, after the cases, set out like a drawing's schedule: the
 * headline on the left, each package's number, name and line across the
 * top, then a ruled row for each thing they differ on, its label in small
 * capitals, and a call at the foot. On phones each row's cells carry their package's name.
 */
export function Packages() {
  return (
    <section className={styles.packages} aria-labelledby="packages-title">
      <table className={`${styles.table} reveal`} aria-labelledby="packages-title">
        <thead>
          <tr>
            <td className={styles.head}>
              <p className={styles.index}>
                <span>Design help</span>
              </p>
              <h2 id="packages-title" className={styles.title}>
                What each way of getting help covers
              </h2>
            </td>
            {PACKAGES.map((p, i) => (
              <th key={p.name} scope="col" className={styles.package}>
                <span className={styles.code}>{pad(i + 1)}</span>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.line}>{p.line}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PACKAGE_ROWS.map((row) => (
            <tr key={row.label} className={styles.row}>
              <th scope="row" className={styles.label}>
                {row.label}
              </th>
              {row.cells.map((cell, i) => (
                <td key={PACKAGES[i]!.name} className={styles.cell} data-package={PACKAGES[i]!.name}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer className={`${styles.foot} reveal`}>
        <p>You don't need any of these to buy.</p>
        <ArrowLink href={contactHref("visit")}>Book a visit</ArrowLink>
      </footer>
    </section>
  );
}
