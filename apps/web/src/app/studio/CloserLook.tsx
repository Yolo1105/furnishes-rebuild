import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const PLACES: readonly { name: string; points: readonly string[]; href: string; call: string }[] = [
  {
    name: "In an HDB flat",
    points: [
      "By the door: bags, shoes and keys with nowhere to go.",
      "In a second bedroom: a study, a guest room and a store at once.",
      "If the way in is tight, choose flat-packed. Its largest box is smaller than the finished piece.",
      `Check HDB's rules before you drill or change anything fixed. ${shown("hdbRules")}`,
    ],
    href: routes.hdbHomes,
    call: "More on HDB homes",
  },
  {
    name: "In a rented or shared room",
    points: [
      "For renters who need a bedroom and somewhere to work, or for housemates and siblings sharing.",
      "Built from segments you size and arrange, holding books and belongings as they divide.",
      "Measure where windows, doors and fans are, so a divider doesn't block them.",
      "Check with your landlord before you drill or change a room.",
    ],
    href: routes.roomDividers,
    call: "More on room dividers",
  },
  {
    name: "In a startup office",
    points: [
      "Start with what the team needs now, and add a piece when someone joins.",
      "Move a screen when a project changes, and use carts for what travels between desks.",
      "A corner for calls gives privacy from view, not from sound.",
      `Tell us your team size, space and date for a quote by email. ${shown("officeTerms")}`,
    ],
    href: routes.workspaces,
    call: "More on workspaces",
  },
];

/** What matters in each of the three places the furniture is for. */
export function CloserLook() {
  return (
    <section className={styles.section} aria-labelledby="closer-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Where you'll use it</span>
        </p>
        <h2 id="closer-title">What to think about in your space.</h2>
      </header>
      <div className={styles.columns}>
        {PLACES.map((p) => (
          <div key={p.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{p.name}</h3>
            <ul className={`${styles.line} ${styles.list}`}>
              {p.points.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <span className={styles.call}>
              <ArrowLink href={p.href}>{p.call}</ArrowLink>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
