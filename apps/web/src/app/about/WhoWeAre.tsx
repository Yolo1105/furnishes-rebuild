import Image from "next/image";
import readingCorner from "@/assets/reading-corner.jpg";
import gardenDining from "@/assets/garden-dining-room.jpg";
import { WHO_COLUMNS, WHO_HEADLINE, WHO_LEAD, WHO_TAGLINE } from "./aboutCopy";
import styles from "./page.module.css";

/**
 * Who we are, over the peach: the index and the headline (its two words in
 * orange) with the tagline on the left, two photographs on the right, the
 * second set lower; under them the lead in large type and the two columns.
 */
export function WhoWeAre() {
  return (
    <section className={`${styles.section} ${styles.intro}`} aria-labelledby="about-title">
      <div className={styles.split}>
        <header>
          <p className={styles.index}>
            <span>Who we are</span>
          </p>
          <h1 id="about-title" className={styles.title}>
            {WHO_HEADLINE.map((part) => (part.highlight ? <em key={part.text}>{part.text}</em> : part.text))}
          </h1>
          <p className={styles.lede}>{WHO_TAGLINE}</p>
        </header>
        <div className={styles.pair}>
          <Image className={styles.render} src={readingCorner} alt="A reading corner with wall shelves and an orange armchair" sizes="(max-width: 900px) 50vw, 30vw" placeholder="blur" priority />
          <Image className={styles.render} src={gardenDining} alt="A dining table in a glass room facing a garden" sizes="(max-width: 900px) 50vw, 30vw" placeholder="blur" priority />
        </div>
      </div>
      <div className={styles.split}>
        <p className={styles.lead}>{WHO_LEAD}</p>
        <div className={styles.columns}>
          {WHO_COLUMNS.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
