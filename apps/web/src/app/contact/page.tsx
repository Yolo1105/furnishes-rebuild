import type { Metadata } from "next";
import { EMAIL, HOURS } from "@/lib/contact";
import { PRODUCTS } from "@/features/products/catalogue";
import { shown } from "@/lib/facts";
import { READY_MADE_PIECE } from "@/lib/routes";
import { PeachBackdrop } from "@/shell/PeachBackdrop";
import { SiteFooter } from "@/shell/SiteFooter";
import { AfterYouSend } from "./AfterYouSend";
import { Inquiry } from "./Inquiry";
import { LeadTimes } from "./LeadTimes";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Contact", description: "Ask about a piece, a room, a home visit or an office quote. We answer by email." };

/**
 * Contact, over the peach the index and headline on
 * the left, on the right a ruled list of how to reach us (the address to
 * write to, the hours, how soon we answer); the inquiry, a step at a time,
 * and what happens after it is sent; then the lead times by email and the
 * footer. A link from a piece
 * says which one, and what the enquiry is about (lib/routes.ts contactHref).
 */
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { topic, piece } = await searchParams;
  const about = piece === READY_MADE_PIECE ? "Ready-made furniture" : PRODUCTS.find((p) => p.id === piece)?.name;
  const picked = typeof topic === "string" ? topic : undefined;
  return (
    <>
      <main id="main" className={styles.page}>
        <PeachBackdrop />
        <section className={styles.contact} aria-labelledby="contact-title">
          <header>
            <p className={styles.index}>
              <span>Contact</span>
            </p>
            <h1 id="contact-title" className={styles.title}>
              How can we help?
            </h1>
            <p className={styles.lede}>A question about a piece, advice on a room, or a visit. Write to us and we reply by email.</p>
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
              <dd className={styles.value}>{`Within ${shown("replyTime")}`}</dd>
            </div>
          </dl>
        </section>
        <Inquiry key={`${picked}-${about}`} topic={picked} about={about} />
        <AfterYouSend />
        <LeadTimes />
      </main>
      <SiteFooter />
    </>
  );
}
