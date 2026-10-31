import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const PATHS: readonly { name: string; line: string; href: string; call: string }[] = [
  { name: "Answer a few questions", line: "For style, size and budget, or for when you can't yet say what you want. It helps you work that out.", href: routes.quiz, call: "Find what you need" },
  { name: "Look at ideas", line: "Everyday situations you may recognise, including ones you hadn't thought of as a problem.", href: routes.inspiration, call: "See ideas" },
  { name: "Have us visit", line: `We come to your room for ${shown("consultLength")} and answer your questions, for ${shown("consultPrice")}.`, href: contactHref("visit"), call: "Book a visit" },
  { name: "Ask us", line: `Email ${EMAIL}, or sign in and ask the AI assistant. You never have to use the assistant to buy.`, href: routes.contact, call: "Ask a question" },
];

/** Ways forward for someone who doesn't yet know what they want. */
export function NotSure() {
  return (
    <section className={styles.section} aria-labelledby="unsure-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Not sure yet?</span>
        </p>
        <h2 id="unsure-title">You don't need to know what you want.</h2>
      </header>
      <ul className={`${styles.columns} ${styles.four}`}>
        {PATHS.map((p) => (
          <li key={p.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{p.name}</h3>
            <p className={styles.line}>{p.line}</p>
            <span className={styles.call}>
              <ArrowLink href={p.href}>{p.call}</ArrowLink>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
