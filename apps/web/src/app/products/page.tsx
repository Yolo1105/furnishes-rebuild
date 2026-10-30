import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, STATUS, type Status, type UseId, USES } from "@/features/products/catalogue";
import { ProductGrid } from "@/features/products/ProductGrid";
import { routes } from "@/lib/routes";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { ArrowLink } from "../studio/ArrowLink";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Products" };

const ROOMS = Object.keys(USES) as UseId[];

const isRoom = (r: unknown): r is UseId => typeof r === "string" && r in USES;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The products: an index line, the headline and how the catalogue stands, a
 * row of rooms to narrow it to (kept in the address, `?room=`), then the
 * products as cards in two groups, the launch pieces first, then the footer.
 */
export default async function Products({ searchParams }: { searchParams: Promise<{ room?: string | string[] }> }) {
  const { room } = await searchParams;
  const current = isRoom(room) ? room : undefined;
  const shown = current ? PRODUCTS.filter((p) => p.uses.includes(current)) : PRODUCTS;
  const count = (s: Status) => PRODUCTS.filter((p) => p.status === s).length;
  const groups = (Object.keys(STATUS) as Status[])
    .map((s) => ({ status: s, products: shown.filter((p) => p.status === s) }))
    .filter((g) => g.products.length > 0);

  return (
    <>
      <main className={styles.page} data-page="products">
        <PeachBackdrop />
        <header className={styles.head}>
          <p className={styles.index}>
            <span>P-100</span>
            <span>Products</span>
          </p>
          <h1 className={styles.title}>The pieces.</h1>
          <p className={styles.lede}>
            {PRODUCTS.length} pieces from one family of birch panels. The first {count("launch")} are being made and tested now;
            the other {count("soon")} follow on frames they prove.
          </p>
        </header>

        <nav className={styles.rooms} aria-label="Narrow by room">
          <Link href={routes.products} className={styles.chip} aria-current={current ? undefined : "page"} scroll={false}>
            Any room
          </Link>
          {ROOMS.map((r) => (
            <Link
              key={r}
              href={`${routes.products}?room=${r}`}
              className={styles.chip}
              aria-current={current === r ? "page" : undefined}
              scroll={false}
            >
              {USES[r]}
            </Link>
          ))}
        </nav>

        {groups.map((g) => (
          <section key={g.status} className={styles.group} aria-labelledby={`group-${g.status}`}>
            <div className={styles.count}>
              <h2 id={`group-${g.status}`} className={styles.groupName}>
                {STATUS[g.status].name}
              </h2>
              <span>
                {pad(g.products.length)} {g.products.length === 1 ? "piece" : "pieces"}
                {current && ` · ${USES[current]}`}
              </span>
            </div>
            <p className={styles.groupLine}>{STATUS[g.status].detail}</p>
            <ProductGrid products={g.products} />
          </section>
        ))}

        <div className={styles.end}>
          <p className={styles.index}>Not sure which?</p>
          <ArrowLink href={routes.studio}>Design your room first</ArrowLink>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
