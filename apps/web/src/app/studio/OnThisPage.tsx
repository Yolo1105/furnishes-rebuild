import styles from "./Details.module.css";

const GROUPS: readonly { name: string; links: readonly (readonly [string, string])[] }[] = [
  {
    name: "See what there is",
    links: [["furniture-title", "The furniture"], ["who-for-title", "Who it's for"], ["does-title", "What it can do"], ["closer-title", "Your kind of space"]],
  },
  {
    name: "Work out what you need",
    links: [["familiar-title", "Start from the problem"], ["noticed-title", "Things you stop noticing"], ["swap-title", "Before and after"], ["unsure-title", "Not sure yet?"]],
  },
  {
    name: "Understand modular",
    links: [["modular-title", "Why modular, and its parts"], ["uses-title", "What else it can become"], ["keep-title", "What you already own"], ["customize-title", "What you can change"]],
  },
  {
    name: "Buy and live with it",
    links: [["buy-title", "How to buy"], ["before-title", "What to measure"], ["build-title", "Building it yourself"], ["lead-title", "How long it takes"], ["after-title", "After you buy"]],
  },
  {
    name: "Get help",
    links: [["design-title", "Design your room"], ["ai-title", "The AI assistant"], ["packages-title", "Ways to get help"], ["questions-title", "Questions"]],
  },
];

/** A guide to the long landing page, by what the visitor wants to do. */
export function OnThisPage() {
  return (
    <nav className={`${styles.section} reveal`} aria-labelledby="guide-title">
      <p id="guide-title" className={styles.index}>
        <span>On this page</span>
      </p>
      <div className={`${styles.columns} ${styles.guideColumns}`}>
        {GROUPS.map((g) => (
          <div key={g.name} className={styles.point}>
            <h3 className={styles.name}>{g.name}</h3>
            <ul className={styles.list}>
              {g.links.map(([id, label]) => (
                <li key={id}>
                  <a className={styles.link} href={`#${id}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
