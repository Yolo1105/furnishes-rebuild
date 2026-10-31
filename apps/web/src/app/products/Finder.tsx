import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ACTIVITIES,
  type ActivityId,
  ARRANGEMENTS,
  BUDGETS,
  type BudgetId,
  CATEGORIES,
  type CategoryId,
  FAMILIES,
  type FamilyId,
  lowestPrice,
  matchesSearch,
  searchWords,
  OBJECTS,
  type ObjectId,
  OTHER_USE_STATE,
  OTHER_USES,
  priceFrom,
  type Product,
  productName,
  PRODUCTS,
  STATUS,
  type Status,
  sizeLabel,
  type UseId,
  USES,
  type WidthId,
  WIDTHS,
} from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import styles from "./Finder.module.css";
import { productHref } from "./productHref";

export const SORTS = { record: "Collection order", name: "Name", width: "Width", height: "Height" } as const;
export type SortId = keyof typeof SORTS;

/** How the pieces are laid out: as tiles, grouped, or every design in one index. */
export const VIEWS = { grid: "Pieces", family: "By family", room: "By room", all: "All designs" } as const;
export type ViewId = keyof typeof VIEWS;

/** The kinds of design in the all-designs index. */
const KINDS = {
  launch: STATUS.launch.name,
  soon: STATUS.soon.name,
  use: "Other use",
  arrangement: "Arrangement",
} as const;
type KindId = keyof typeof KINDS;

/** What the page is narrowed to and how it is laid out, all kept in the address. */
export type FinderState = {
  q?: string;
  status?: Status;
  family?: FamilyId;
  use?: UseId;
  category?: CategoryId;
  width?: WidthId;
  budget?: BudgetId;
  activity?: ActivityId;
  object?: ObjectId;
  kind?: KindId;
  sort: SortId;
  view: ViewId;
  /** The page the finder sits on, which its links stay on. */
  base: string;
};

/** The filters on the pieces, each kept under its own name in the address. */
const FILTERS = ["status", "family", "use", "category", "width", "budget", "activity", "object"] as const;
type FilterField = (typeof FILTERS)[number];
const CLEARED = Object.fromEntries([...FILTERS, "q", "kind"].map((f) => [f, undefined])) as Partial<FinderState>;

type Query = Record<string, string | string[] | undefined>;

const isIn = <T extends string>(o: Record<T, unknown>, v: unknown): v is T => typeof v === "string" && v in o;
const one = (q: Query, k: string) => (typeof q[k] === "string" ? q[k] : undefined);

/** The state from the address: ?q=, each filter, ?kind=, ?sort= and ?view=. */
export function readFinder(q: Query, base: string = routes.products): FinderState {
  const search = one(q, "q")?.trim().slice(0, 60);
  return {
    q: search || undefined,
    status: isIn(STATUS, q.status) ? q.status : undefined,
    family: isIn(FAMILIES, q.family) ? q.family : undefined,
    use: isIn(USES, q.use) ? q.use : undefined,
    category: isIn(CATEGORIES, q.category) ? q.category : undefined,
    width: isIn(WIDTHS, q.width) ? q.width : undefined,
    budget: isIn(BUDGETS, q.budget) ? q.budget : undefined,
    activity: isIn(ACTIVITIES, q.activity) ? q.activity : undefined,
    object: isIn(OBJECTS, q.object) ? q.object : undefined,
    kind: isIn(KINDS, q.kind) ? q.kind : undefined,
    sort: isIn(SORTS, q.sort) ? q.sort : "record",
    view: isIn(VIEWS, q.view) ? q.view : "grid",
    base,
  };
}

/** The address for the state with `change` made, back at the finder. */
function hrefFor(state: FinderState, change: Partial<FinderState>) {
  const s = { ...state, ...change };
  const q = new URLSearchParams();
  for (const k of ["q", ...FILTERS, "kind"] as const) {
    const v = s[k];
    if (v) q.set(k, v);
  }
  if (s.sort !== "record") q.set("sort", s.sort);
  if (s.view !== "grid") q.set("view", s.view);
  const query = q.toString();
  return `${s.base}${query ? `?${query}` : ""}#find`;
}

const matches = (p: Product, s: FinderState) =>
  (!s.q || matchesSearch(p, s.q)) &&
  (!s.status || p.status === s.status) &&
  (!s.family || p.family === s.family) &&
  (!s.use || p.uses.includes(s.use)) &&
  (!s.category || p.category === s.category) &&
  (!s.width || WIDTHS[s.width].fits(p.size.w)) &&
  (!s.budget || BUDGETS[s.budget].fits(lowestPrice(p.id))) &&
  (!s.activity || p.activities.includes(s.activity)) &&
  (!s.object || p.objects.includes(s.object));

const ORDER: Record<SortId, (a: Product, b: Product) => number> = {
  record: () => 0,
  name: (a, b) => a.name.localeCompare(b.name),
  width: (a, b) => b.size.w - a.size.w,
  height: (a, b) => b.size.h - a.size.h,
};

const names = <T extends string>(o: Record<T, { name: string }>) =>
  Object.fromEntries(Object.entries<{ name: string }>(o).map(([k, v]) => [k, v.name])) as Record<T, string>;

/** Each filter's heading and its options' names, in the order they stand at the side. */
const GROUPS: { field: FilterField; name: string; options: Record<string, string>; open?: boolean }[] = [
  { field: "status", name: "Status", options: names(STATUS), open: true },
  { field: "family", name: "Family", options: names(FAMILIES), open: true },
  { field: "use", name: "Room", options: USES, open: true },
  { field: "budget", name: "Budget", options: names(BUDGETS), open: true },
  { field: "category", name: "Kind of piece", options: CATEGORIES },
  { field: "width", name: "Fits a width of", options: names(WIDTHS) },
  { field: "activity", name: "What it lets you do", options: names(ACTIVITIES) },
  { field: "object", name: "Start with what you love", options: names(OBJECTS) },
];

/** One ruled group of the filter: its name, then its options, each with how many it would show. */
function Group({
  name,
  options,
  field,
  open,
  state,
}: (typeof GROUPS)[number] & { state: FinderState }) {
  const current = state[field];
  return (
    <details className={styles.group} open={open || Boolean(current)}>
      <summary className={styles.groupHead}>{name}</summary>
      <ul className={styles.options}>
        <li>
          <Link href={hrefFor(state, { [field]: undefined })} aria-current={current ? undefined : "true"} scroll={false}>
            Any
          </Link>
        </li>
        {Object.keys(options).map((k) => {
          const n = PRODUCTS.filter((p) => matches(p, { ...state, [field]: k })).length;
          return (
            <li key={k}>
              <Link
                href={hrefFor(state, { [field]: k })}
                aria-current={current === k ? "true" : undefined}
                data-empty={n ? undefined : true}
                scroll={false}
              >
                {options[k]} <span className={styles.n}>{n}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

/** The products as soft tiles on the studio's stone, the launch pieces large. */
function Tiles({ products }: { products: readonly Product[] }) {
  return (
    <ul className={styles.tiles}>
      {products.map((p) => {
        const large = p.status === "launch";
        const href = productHref(p.id);
        return (
          <li key={p.id} className={styles.tile} data-large={large || undefined}>
            <div className={styles.tileHead}>
              <h3 className={styles.name}>
                {href ? (
                  <Link href={href} className={styles.link}>
                    {p.name}
                  </Link>
                ) : (
                  p.name
                )}
              </h3>
              {href && <span className={styles.plus} aria-hidden="true" />}
            </div>
            <p className={styles.record}>
              No. {p.record} · {CATEGORIES[p.category]}
            </p>
            <div className={styles.stage}>
              <Image
                className={styles.object}
                src={p.studio}
                alt=""
                fill
                sizes={large ? "(max-width: 860px) 100vw, 36vw" : "(max-width: 860px) 50vw, 18vw"}
                placeholder="blur"
              />
            </div>
            <p className={styles.meta}>
              <span className={styles.status} data-status={p.status}>
                {STATUS[p.status].name}
              </span>
              <span>{priceFrom(p.id)}</span>
              <span>{sizeLabel(p.size)}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** The widest front and deepest base in the catalogue, so every footprint is drawn to one scale. */
const MAX_W = Math.max(...PRODUCTS.map((p) => p.size.w));
const MAX_D = Math.max(...PRODUCTS.map((p) => p.size.baseD ?? p.size.d));

/** A piece seen from above, to the catalogue's one scale: the body, and a reaching base dashed. */
function Footprint({ size }: { size: Product["size"] }) {
  return (
    <svg
      className={styles.footprint}
      viewBox={`0 0 ${MAX_W} ${MAX_D}`}
      preserveAspectRatio="xMinYMin meet"
      role="img"
      aria-label={`Footprint ${size.w / 10} by ${(size.baseD ?? size.d) / 10} cm`}
    >
      {size.baseD && <rect x="0" y="0" width={size.w} height={size.baseD} className={styles.base} />}
      <rect x="0" y="0" width={size.w} height={size.d} className={styles.body} />
    </svg>
  );
}

type Design = {
  id: string;
  record: string;
  kind: KindId;
  name: string;
  line: string;
  /** What it stands with: its pieces, or the pieces it goes with. */
  with?: string;
  image: StaticImageData;
  size?: Product["size"];
  href?: string;
};

/** Every design in the record: the pieces, their other uses, and the arrangements. */
const DESIGNS: readonly Design[] = [
  ...PRODUCTS.map((p) => ({
    id: p.id,
    record: p.record,
    kind: p.status,
    name: p.name,
    line: p.line,
    image: p.studio,
    size: p.size,
    href: productHref(p.id),
  })),
  ...OTHER_USES.map((u) => ({
    id: u.id,
    record: u.record,
    kind: "use" as const,
    name: u.name,
    line: u.line,
    with: `${OTHER_USE_STATE[u.state]}: ${u.parents.map(productName).join(", ")}`,
    image: u.image,
  })),
  ...ARRANGEMENTS.map((a) => ({
    id: a.id,
    record: a.record,
    kind: "arrangement" as const,
    name: a.name,
    line: a.line,
    with: a.members.map((m) => `${m.count > 1 ? `${m.count} × ` : ""}${productName(m.product)}`).join(" + "),
    image: a.image,
  })),
];

const designMatches = (d: Design, s: FinderState) =>
  (!s.kind || d.kind === s.kind) &&
  (!s.q || searchWords(s.q).every((w) => `${d.name} ${d.line} ${d.with ?? ""}`.toLowerCase().includes(w)));

/** The all-designs index: kind chips, then one ruled row per design, its footprint where it has one. */
function Index({ state }: { state: FinderState }) {
  const shown = DESIGNS.filter((d) => designMatches(d, state));
  return (
    <>
      <ul className={styles.chips} aria-label="Kind of design">
        <li>
          <Link href={hrefFor(state, { kind: undefined })} className={styles.view} aria-current={state.kind ? undefined : "true"} scroll={false}>
            Every kind <span className={styles.n}>{DESIGNS.filter((d) => designMatches(d, { ...state, kind: undefined })).length}</span>
          </Link>
        </li>
        {(Object.keys(KINDS) as KindId[]).map((k) => (
          <li key={k}>
            <Link
              href={hrefFor(state, { kind: k })}
              className={styles.view}
              aria-current={state.kind === k ? "true" : undefined}
              data-kind={k}
              scroll={false}
            >
              {KINDS[k]} <span className={styles.n}>{DESIGNS.filter((d) => designMatches(d, { ...state, kind: k })).length}</span>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length ? (
        <ol className={styles.index}>
          {shown.map((d) => (
            <li key={`${d.kind}-${d.id}`} className={styles.row}>
              <span className={styles.rowRecord}>{d.record}</span>
              <span className={styles.thumb}>
                <Image src={d.image} alt="" fill sizes="72px" />
              </span>
              <span className={styles.rowText}>
                <span className={styles.rowName}>
                  {d.href ? (
                    <Link href={d.href} className={styles.link}>
                      {d.name}
                    </Link>
                  ) : (
                    d.name
                  )}
                </span>
                <span className={styles.rowLine}>{d.line}</span>
                {d.with && <span className={styles.rowWith}>{d.with}</span>}
              </span>
              <span className={styles.kind} data-kind={d.kind}>
                {KINDS[d.kind]}
              </span>
              <span className={styles.plan}>
                {d.size ? (
                  <>
                    <Footprint size={d.size} />
                    <span>{sizeLabel(d.size)}</span>
                  </>
                ) : (
                  <span>Size with its pieces</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.none}>
          No design matches yet. <Link href={hrefFor(state, CLEARED)}>Show every design</Link>
        </p>
      )}
    </>
  );
}

/**
 * Find your piece: a search, then a quiet ruled filter at the side (status,
 * family, room, kind, width, what it lets you do, what you love; each option
 * with its count), and on the right the views, the count, the order, and the
 * pieces: as tiles, grouped by family or room, or every design in one index.
 * All of it is links and one plain form, so it works without scripts.
 */
export function Finder({ state }: { state: FinderState }) {
  const shown = PRODUCTS.filter((p) => matches(p, state)).toSorted(ORDER[state.sort]);
  const narrowed = Boolean(state.q || FILTERS.some((f) => state[f]));
  const index = state.view === "all";
  const groups =
    state.view === "family"
      ? (Object.keys(FAMILIES) as FamilyId[]).map((f) => ({
          id: f,
          name: FAMILIES[f].name,
          line: FAMILIES[f].line,
          products: shown.filter((p) => p.family === f),
        }))
      : state.view === "room"
        ? (Object.keys(USES) as UseId[]).map((u) => ({
            id: u,
            name: USES[u],
            line: undefined,
            products: shown.filter((p) => p.uses.includes(u)),
          }))
        : undefined;

  return (
    <section id="find" className={styles.finder} aria-labelledby="find-title">
      <h2 id="find-title" className={styles.title}>
        Find your piece
      </h2>

      <form className={styles.search} action={`${state.base}#find`} role="search">
        <label htmlFor="find-q" className="visually-hidden">
          Search the collection
        </label>
        <input id="find-q" name="q" type="search" defaultValue={state.q} placeholder="Coats, books, desk…" maxLength={60} />
        {[...FILTERS, "kind"].map((f) => {
          const v = state[f as keyof FinderState];
          return v ? <input key={f} type="hidden" name={f} value={v} /> : null;
        })}
        {state.view !== "grid" && <input type="hidden" name="view" value={state.view} />}
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.body}>
        <aside className={styles.filters} aria-label="Narrow the pieces">
          <p className={styles.filtersHead}>
            <span>Filters</span>
            {narrowed && (
              <Link href={hrefFor(state, CLEARED)} scroll={false}>
                Clear
              </Link>
            )}
          </p>
          {index ? (
            <p className={styles.familyLine}>The index lists every design. Narrow it by kind or search above.</p>
          ) : (
            GROUPS.map((g) => <Group key={g.field} {...g} state={state} />)
          )}
          {!index && state.family && <p className={styles.familyLine}>{FAMILIES[state.family].line}</p>}
          {!index && state.activity && <p className={styles.familyLine}>Each one {ACTIVITIES[state.activity].fits}.</p>}
          {!index && state.object && <p className={styles.familyLine}>Each one has {OBJECTS[state.object].fits}.</p>}
        </aside>

        <div>
          <ul className={styles.views} aria-label="Lay out as">
            {(Object.keys(VIEWS) as ViewId[]).map((v) => (
              <li key={v}>
                <Link href={hrefFor(state, { view: v })} className={styles.view} aria-current={state.view === v ? "true" : undefined} scroll={false}>
                  {VIEWS[v]}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.bar}>
            <p className={styles.count} aria-live="polite">
              {index
                ? `Every design ${DESIGNS.filter((d) => designMatches(d, state)).length}`
                : `Total pieces ${shown.length}`}
              {state.q && <span className={styles.searched}> for “{state.q}”</span>}
            </p>
            {!index && (
              <details className={styles.sort}>
                <summary className={styles.pill}>
                  Sort by: {SORTS[state.sort]}
                  <span className={styles.chevron} aria-hidden="true" />
                </summary>
                <ul className={styles.sortList}>
                  {(Object.keys(SORTS) as SortId[]).map((s) => (
                    <li key={s}>
                      <Link href={hrefFor(state, { sort: s })} aria-current={state.sort === s ? "true" : undefined} scroll={false}>
                        {SORTS[s]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          {index ? (
            <Index state={state} />
          ) : !shown.length ? (
            <p className={styles.none}>
              No piece has all of these yet. <Link href={hrefFor(state, CLEARED)}>Show every piece</Link>
            </p>
          ) : groups ? (
            groups
              .filter((g) => g.products.length)
              .map((g) => (
                <section key={g.id} className={styles.cluster} aria-labelledby={`cluster-${g.id}`}>
                  <header className={styles.clusterHead}>
                    <h3 id={`cluster-${g.id}`}>
                      {g.name} <span className={styles.n}>{g.products.length}</span>
                    </h3>
                    {g.line && <p>{g.line}</p>}
                  </header>
                  <Tiles products={g.products} />
                </section>
              ))
          ) : (
            <Tiles products={shown} />
          )}
          <p className={styles.note}>
            Prices are for flat-packed pieces. Sizes are nominal.
          </p>
        </div>
      </div>
    </section>
  );
}
