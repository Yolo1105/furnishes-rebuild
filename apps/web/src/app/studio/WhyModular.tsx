import { KIT_TIER, KITS, productById } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const REASONS: readonly { name: string; line: string }[] = [
  { name: "It fits where fixed sizes don't", line: "Standard parts in set heights and widths reach sizes a fixed product doesn't come in, without a one-off build each time." },
  { name: "It can change its job", line: "The same frame can take another pack. An entry piece can become a desk-side piece, and the parts taken off are yours to keep." },
  { name: "It can grow", line: "Add a door, a drawer, a second segment or wheels later, rather than buying a whole new piece." },
  { name: "One part can be fixed", line: "Because parts are separate, a damaged one can often be looked at on its own." },
  { name: "It can come with you", line: "Many pieces come apart. We check the parts and the new spot with you when you move." },
  { name: "You still get a finished piece", line: "You never have to plan parts yourself. Every piece is complete as it stands, and worth buying even if it never changes." },
];

const PIECES = [...new Set(KITS.flatMap((k) => k.applies))];

/** Why choose the modular line, its limits, and the add-on parts each piece can take. */
export function WhyModular() {
  return (
    <section className={styles.section} aria-labelledby="modular-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Why modular</span>
        </p>
        <h2 id="modular-title">Why build furniture from parts?</h2>
        <p className={styles.lede}>Our modular furniture is made of panels, a base and add-on parts that work together. Here's what that gets you.</p>
      </header>
      <ul className={styles.columns}>
        {REASONS.map((r) => (
          <li key={r.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{r.name}</h3>
            <p className={styles.line}>{r.line}</p>
          </li>
        ))}
      </ul>
      <p className={`${styles.lede} ${styles.foot} reveal`}>Its limits: not every part fits every piece, so we check against the version you own. Some changes leave parts over. And if a standard size suits you, ready-made furniture is simpler.</p>

      <h3 className={`${styles.name} ${styles.subhead} reveal`}>The parts each piece can take</h3>
      <div className={styles.columns}>
        {PIECES.map((id) => (
          <div key={id} className={`${styles.point} reveal`}>
            <h4 className={styles.name}>{productById(id)?.name}</h4>
            <ul className={styles.parts}>
              {KITS.filter((k) => k.applies.includes(id)).map((k) => (
                <li key={k.id}>
                  <span className={styles.partName}>{k.name}</span>
                  <span className={styles.line}>{k.line}</span>
                  <span className={styles.line}>Adds: {k.adds.join(", ")}.{k.removes.length > 0 ? ` Takes off: ${k.removes.join(", ")}.` : ""}</span>
                  <span className={styles.tier}>{KIT_TIER[k.tier].name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`${styles.foot} reveal`}>
        <ArrowLink href={`${routes.collection}#find`}>See the modular furniture</ArrowLink>
      </p>
    </section>
  );
}
