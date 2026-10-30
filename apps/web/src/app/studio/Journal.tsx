import Image from "next/image";
import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import { JOURNAL } from "./notes";
import { ROOM_PHOTOS } from "./rooms";
import styles from "./Journal.module.css";

/**
 * The journal's latest notes, after the packages: the index and headline
 * with a call to the whole journal, then a column for each note, its photo,
 * its topic, length and date in small capitals, its title kept to a line,
 * its words and a call to read it.
 */
export function Journal() {
  return (
    <section className={styles.journal} aria-labelledby="journal-title">
      <header className={`${styles.head} reveal`}>
        <div>
          <p className={styles.index}>
            <span>A-700</span>
            <span>Journal</span>
          </p>
          <h2 id="journal-title" className={styles.title}>
            From the journal
          </h2>
        </div>
        <ArrowLink href={routes.about}>Read the journal</ArrowLink>
      </header>
      <ol className={styles.notes}>
        {JOURNAL.map((n) => {
          const photo = ROOM_PHOTOS.find((p) => p.room === n.room);
          return (
            <li key={n.title} className={`${styles.note} reveal`}>
              {photo && (
                <div className={styles.frame}>
                  <Image
                    className={styles.photo}
                    src={photo.src}
                    alt=""
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                    placeholder="blur"
                  />
                </div>
              )}
              <p className={styles.meta}>
                <span>{n.topic}</span>
                <span aria-hidden="true">/</span>
                <span>{n.minutes} min</span>
                <span aria-hidden="true">/</span>
                <time dateTime={n.date}>{n.date}</time>
              </p>
              <h3 className={styles.noteTitle} title={n.title}>
                {n.title}
              </h3>
              <p className={styles.body}>{n.body}</p>
              <div className={styles.read}>
                <ArrowLink href={routes.about}>Read it</ArrowLink>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
