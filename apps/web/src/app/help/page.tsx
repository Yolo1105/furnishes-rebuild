import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import styles from "./page.module.css";
import { QUESTION_GROUPS } from "./questions";

export const metadata: Metadata = {
  title: "Help",
  description: "Ways to get help with Furnishes furniture, a home visit or email, and answers on choosing, ordering, delivery, returns and safety.",
};

const capitalised = (words: string) => words.charAt(0).toUpperCase() + words.slice(1);

/** Ways forward for someone who doesn't yet know what they want. */
const PATHS = [
  {
    title: "Answer a few questions",
    body: "For style, size and budget, or when you can't yet say what you want.",
    action: <Button variant="link" href={routes.quiz}>Find what you need →</Button>,
  },
  {
    title: "Look at ideas",
    body: "Everyday situations you may recognise, including ones you hadn't thought of as a problem.",
    action: <Button variant="link" href={routes.inspiration}>See ideas →</Button>,
  },
  {
    title: "Have us visit",
    body: `We come to your room for ${shown("consultLength")} and answer your questions, for ${shown("consultPrice")}.`,
    action: <Button variant="link" href={contactHref("visit")}>Book a visit →</Button>,
  },
  {
    title: "Ask us",
    body: `Write to ${EMAIL}, and we reply within ${shown("replyTime")}.`,
    action: <Button variant="link" href={routes.contact}>Ask a question →</Button>,
  },
];

/** The two ways to get a person's help: what each covers, row by row. */
const WAYS: readonly { name: string; line: string; rows: readonly { label: string; body: string }[]; call: string; href: string }[] = [
  {
    name: "A visit",
    line: "When the answer depends on the room itself.",
    rows: [
      { label: "Cost", body: shown("consultPrice") },
      { label: "Includes", body: "We look at the room with you, measure what matters, answer your questions and suggest what could work." },
      { label: "When", body: `${capitalised(shown("consultLength"))}, at a time we agree.` },
      { label: "Where", body: capitalised(shown("consultArea")) },
      { label: "Not included", body: "Building or renovation work." },
    ],
    call: "Book a visit",
    href: contactHref("visit"),
  },
  {
    name: "Email",
    line: "When you want a person to answer.",
    rows: [
      { label: "Cost", body: "Free" },
      { label: "Includes", body: "Product questions, advice, quotes, design reviews and help with an order." },
      { label: "When", body: `${capitalised(shown("supportHours"))}, with a reply within ${shown("replyTime")}.` },
      { label: "Where", body: EMAIL },
      { label: "Not included", body: "A phone line, live chat or a showroom." },
    ],
    call: "Write to us",
    href: routes.contact,
  },
];

/** Help: ways forward when unsure, the two ways to reach a person, then the questions by topic. */
export default function Help() {
  return (
    <>
      <main id="main">
        <Section id="unsure">
          <SectionHead
            as="h1"
            id="unsure"
            eyebrow="Help"
            title="You don't need to know what you want."
            lede={`Four ways forward, and the answers people ask for most. Can't find yours? Write to ${EMAIL}.`}
          />
          <Steps numbered={false} steps={PATHS} span="span-3 md:span-6" />
        </Section>

        <Section id="ways" tone="linen">
          <SectionHead id="ways" eyebrow="Design help" title="What each way of getting help covers." lede="You don't need either of these to buy." />
          {WAYS.map((w) => (
            <div key={w.name} className="card span-6">
              <h3>{w.name}</h3>
              <p className="meta">{w.line}</p>
              <dl className={styles.rows}>
                {w.rows.map((r) => (
                  <div key={r.label}>
                    <dt className="eyebrow">{r.label}</dt>
                    <dd>{r.body}</dd>
                  </div>
                ))}
              </dl>
              <p>
                <Button variant="link" href={w.href}>
                  {w.call} →
                </Button>
              </p>
            </div>
          ))}
        </Section>

        <Section id="questions">
          <SectionHead
            id="questions"
            eyebrow="Questions"
            title="What people ask before and after they buy."
            lede={`We reply within ${shown("replyTime")} if yours isn't here.`}
            action={
              <p className="actions">
                <Button variant="link" href={routes.buyingGuide}>
                  Read the buying guide →
                </Button>
                <Button variant="link" href={routes.refunds}>
                  Refund policy →
                </Button>
              </p>
            }
          />
          {QUESTION_GROUPS.map((g) => (
            <div key={g.topic} className="card span-12 subgrid">
              <h3 className="span-4">{g.topic}</h3>
              <ul className={`span-8 ${styles.questions}`}>
                {g.questions.map((q) => (
                  <li key={q.question}>
                    <details id={q.id} className="disclosure">
                      <summary>{q.question}</summary>
                      <p>{q.answer}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="next" tone="dark">
          <SectionHead
            id="next"
            title="Still not sure?"
            lede={`Ask us about your piece or your room. We reply within ${shown("replyTime")}, ${shown("supportHours")}.`}
            action={
              <div className="actions">
                <Button variant="primary" href={routes.contact}>
                  Ask a question
                </Button>
                <Button variant="secondary" href={contactHref("visit")}>
                  Book a visit
                </Button>
              </div>
            }
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
