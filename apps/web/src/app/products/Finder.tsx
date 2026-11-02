import Link from "next/link";
import {
  ACTIVITIES,
  type ActivityId,
  matchesSearch,
  type Product,
  PRODUCTS,
  STATUS,
  type Status,
  type UseId,
  USES,
  type WidthId,
  WIDTHS,
} from "@/features/products/catalogue";
import { ProductGrid } from "@/features/products/ProductGrid";
import { routes } from "@/lib/routes";
import { Button } from "@/shell/ui/Button";
import styles from "./Finder.module.css";

/** What the pieces are narrowed to, all kept in the address so a link can land on it. */
export type FinderState = {
  q?: string;
  use?: UseId;
  /** From the landing's and the guides' links; shown as a line that can be cleared, not as a chip. */
  activity?: ActivityId;
  width?: WidthId;
  /** The page the finder sits on, which its links stay on. */
  base: string;
};

type Query = Record<string, string | string[] | undefined>;

const isIn = <T extends string>(o: Record<T, unknown>, v: unknown): v is T => typeof v === "string" && v in o;

/** The state from the address: ?q=, ?use=, ?activity= and ?width=. */
export function readFinder(q: Query, base: string = routes.products): FinderState {
  const search = typeof q.q === "string" ? q.q.trim().slice(0, 60) : "";
  return {
    q: search || undefined,
    use: isIn(USES, q.use) ? q.use : undefined,
    activity: isIn(ACTIVITIES, q.activity) ? q.activity : undefined,
    width: isIn(WIDTHS, q.width) ? q.width : undefined,
    base,
  };
}

const FIELDS = ["q", "use", "activity", "width"] as const;

/** The address for the state with `change` made, back at the finder. */
function hrefFor(state: FinderState, change: Partial<FinderState>) {
  const s = { ...state, ...change };
  const query = new URLSearchParams();
  for (const k of FIELDS) {
    const v = s[k];
    if (v) query.set(k, v);
  }
  const qs = query.toString();
  return `${s.base}${qs ? `?${qs}` : ""}#find`;
}

const matches = (p: Product, s: FinderState) =>
  (!s.q || matchesSearch(p, s.q)) &&
  (!s.use || p.uses.includes(s.use)) &&
  (!s.activity || p.activities.includes(s.activity)) &&
  (!s.width || WIDTHS[s.width].fits(p.size.w));

/** The two groups, in order: what can be ordered, then what is being made. */
const GROUPS: readonly { status: Status; name: string }[] = [
  { status: "launch", name: STATUS.launch.name },
  { status: "soon", name: "In production" },
];

const pieces = (n: number) => `${String(n).padStart(2, "0")} ${n === 1 ? "piece" : "pieces"}`;

/**
 * Find your piece: one row of room chips, a search where asked for, the count,
 * then the pieces as the site's cards, those that can be ordered first and the
 * rest under one "In production" rule. All links and one plain form, so it
 * works without scripts. Sits inside a page's `Section id="find"`.
 */
export function Finder({ state, search = true, priority = false }: { state: FinderState; search?: boolean; priority?: boolean }) {
  const shown = PRODUCTS.filter((p) => matches(p, state));
  const narrowed = Boolean(state.q || state.use || state.activity || state.width);
  const cleared = hrefFor(state, { q: undefined, use: undefined, activity: undefined, width: undefined });

  return (
    <>
      <nav className="span-12 chips" aria-label="Narrow by room">
        <Link href={hrefFor(state, { use: undefined })} className="chip" aria-current={state.use ? undefined : "true"} scroll={false}>
          Any room
        </Link>
        {(Object.keys(USES) as UseId[]).map((u) => (
          <Link key={u} href={hrefFor(state, { use: u })} className="chip" aria-current={state.use === u ? "true" : undefined} scroll={false}>
            {USES[u]}
          </Link>
        ))}
      </nav>

      {search && (
        <form className={`span-6 md:span-6 ${styles.search}`} action={`${state.base}#find`} role="search">
          <label htmlFor="find-q" className="visually-hidden">
            Search the pieces
          </label>
          <input id="find-q" className={styles.input} name="q" type="search" defaultValue={state.q} placeholder="Coats, books, desk…" maxLength={60} />
          {(["use", "activity", "width"] as const).map((f) => (state[f] ? <input key={f} type="hidden" name={f} value={state[f]} /> : null))}
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>
      )}

      <div className={`span-12 ${styles.status}`}>
        <p className="meta" aria-live="polite">
          {shown.length} {shown.length === 1 ? "piece" : "pieces"}
          {state.q && ` for “${state.q}”`}
          {state.activity && `, each of which ${ACTIVITIES[state.activity].fits}`}
          {state.width && `, ${WIDTHS[state.width].name.toLowerCase()} wide`}
        </p>
        {narrowed && shown.length > 0 && (
          <Button variant="link" href={cleared} className="meta">
            Clear filters
          </Button>
        )}
      </div>

      {shown.length ? (
        GROUPS.map((g, i) => {
          const products = shown.filter((p) => p.status === g.status);
          if (!products.length) return null;
          return (
            <section key={g.status} className="span-12 subgrid" aria-labelledby={`group-${g.status}`}>
              <div className={`span-12 ${styles.rule}`}>
                <h3 id={`group-${g.status}`} className="eyebrow">
                  {g.name}
                </h3>
                <span className="mono">{pieces(products.length)}</span>
              </div>
              <ProductGrid products={products} priority={priority && i === 0} />
            </section>
          );
        })
      ) : (
        <div className={`span-8 ${styles.empty}`}>
          <h3>No pieces match.</h3>
          <p className="meta">Try another room or fewer words, or see every piece.</p>
          <p>
            <Button variant="secondary" href={cleared}>
              Clear filters
            </Button>
          </p>
        </div>
      )}
    </>
  );
}
