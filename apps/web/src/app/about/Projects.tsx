import Image from "next/image";
import { PROJECTS, PROJECTS_HEADLINE } from "./aboutCopy";
import styles from "./page.module.css";

/**
 * The projects: the index and headline, then one ruled row each (year,
 * award, project, result). A row with renders opens to show them, the
 * newest open to start with; the rest are plain rows.
 */
export function Projects() {
  return (
    <section className={styles.section} aria-labelledby="projects-title">
      <header className={styles.sectionHead}>
        <p className={styles.index}>
          <span>Projects</span>
        </p>
        <h2 id="projects-title" className={styles.heading}>
          {PROJECTS_HEADLINE}
        </h2>
      </header>
      <ul className={styles.rows}>
        {PROJECTS.map((p, i) => {
          const line = (
            <>
              <span className={styles.year}>{p.year}</span>
              <span className={styles.award}>{p.award}</span>
              <span className={styles.project}>{p.project}</span>
              <span className={styles.result}>{p.result}</span>
            </>
          );
          return (
            <li key={p.year} className={styles.projectRow}>
              {p.images ? (
                <details open={i === 0}>
                  <summary className={styles.projectLine}>
                    {line}
                    <span className={styles.toggle} aria-hidden="true" />
                  </summary>
                  <div className={styles.projectRenders}>
                    {p.images.map((img) => (
                      <Image key={img.alt} className={styles.render} src={img.src} alt={img.alt} sizes="(max-width: 900px) 100vw, 33vw" placeholder="blur" />
                    ))}
                  </div>
                </details>
              ) : (
                <div className={styles.projectLine}>{line}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
