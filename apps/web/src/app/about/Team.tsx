import { TEAM, TEAM_HEADLINE, TEAM_LINE } from "./aboutCopy";
import styles from "./page.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The team: the index, the headline and beside it the line on who is here,
 * then a card each, two to a row over a rule. Each card: a portrait frame
 * (the initial in it, till portraits are taken), and beside it the card's
 * number, the name, the role in small capitals and a ruled schedule of
 * focus, credentials (boxed in orange, only when given) and where they are.
 */
export function Team() {
  return (
    <section className={styles.section} aria-labelledby="team-title">
      <header className={styles.teamHead}>
        <div>
          <p className={styles.index}>
            <span>Team</span>
          </p>
          <h2 id="team-title" className={styles.heading}>
            {TEAM_HEADLINE}
          </h2>
        </div>
        <p className={styles.lede}>{TEAM_LINE}</p>
      </header>
      <ul className={styles.cards}>
        {TEAM.map((m, i) => (
          <li key={m.name} className={styles.card}>
            <div className={styles.portrait} aria-hidden="true">
              {m.name[0]}
            </div>
            <div className={styles.cardText}>
              <p className={styles.cardCode}>{pad(i + 1)}</p>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.role}>{m.role}</p>
              <dl className={styles.facts}>
                <div className={styles.fact}>
                  <dt className={styles.label}>Focus</dt>
                  <dd>{m.about}</dd>
                </div>
                {m.credentials && (
                  <div className={styles.fact}>
                    <dt className={styles.label}>Credentials</dt>
                    <dd>
                      <span className={styles.badge}>{m.credentials}</span>
                    </dd>
                  </div>
                )}
                <div className={styles.fact}>
                  <dt className={styles.label}>Based in</dt>
                  <dd>{m.basedIn}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
