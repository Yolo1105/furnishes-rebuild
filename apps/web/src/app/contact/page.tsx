import type { Metadata } from "next";
import { EMAIL, HOURS } from "@/lib/contact";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { Questions } from "../studio/Questions";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Contact" };

/**
 * Contact, over the peach in the studio's words: the index and headline on
 * the left, on the right a ruled list of how to reach us (the address to
 * write to, the hours, how soon we answer), then the studio's questions and
 * the footer.
 */
export default function Contact() {
  return (
    <>
      <main className={styles.page}>
        <PeachBackdrop />
        <section className={styles.contact} aria-labelledby="contact-title">
          <header>
            <p className={styles.index}>
              <span>A-900</span>
              <span>Contact</span>
            </p>
            <h1 id="contact-title" className={styles.title}>
              Tell us about your room
            </h1>
            <p className={styles.lede}>A site, a room or a second opinion: write to us and we will set up a time to talk.</p>
          </header>
          <dl className={styles.list}>
            <div className={styles.row}>
              <dt className={styles.label}>Email</dt>
              <dd className={styles.value}>
                <a className={styles.email} href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>Hours</dt>
              <dd className={styles.value}>
                {HOURS.map((h) => (
                  <span key={h} className={styles.hour}>
                    {h}
                  </span>
                ))}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.label}>Reply</dt>
              <dd className={styles.value}>Inside one business day</dd>
            </div>
          </dl>
        </section>
        <Questions />
      </main>
      <SiteFooter />
    </>
  );
}
