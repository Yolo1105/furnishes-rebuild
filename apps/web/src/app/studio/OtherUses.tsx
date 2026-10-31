import Image from "next/image";
import { ARRANGEMENTS, OTHER_USES } from "@/features/products/catalogue";
import styles from "./Details.module.css";

const GROUPS = [
  { title: "Other jobs a piece can do", about: "A different set of parts on a piece we already make. Some still need testing, as marked.", items: OTHER_USES },
  { title: "Pieces standing together", about: "Ideas for arranging several pieces. They have no price of their own: you buy the pieces.", items: ARRANGEMENTS },
];

/** What the same parts can become: other uses of a piece, and arrangements of several. */
export function OtherUses() {
  return (
    <section className={styles.section} aria-labelledby="uses-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>What else it can become</span>
        </p>
        <h2 id="uses-title">The same parts, other answers.</h2>
      </header>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <h3 className={`${styles.name} ${styles.subhead} reveal`}>{g.title}</h3>
          <p className={`${styles.lede} reveal`}>{g.about}</p>
          <ul className={`${styles.columns} ${styles.four}`}>
            {g.items.map((u) => (
              <li key={u.id} className={`${styles.point} reveal`}>
                <span className={styles.picture}>
                  <Image src={u.image} alt="" fill sizes="(max-width: 700px) 100vw, 25vw" placeholder="blur" />
                </span>
                <h4 className={styles.partName}>{u.name}</h4>
                <p className={styles.line}>{u.line}</p>
                <p className={styles.line}>{u.note}</p>
                {"state" in u && u.state === "testing" && <span className={styles.tier}>Needs testing first</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
