import { routes } from "@/lib/routes";
import { ArrowLink } from "./ArrowLink";
import styles from "./Details.module.css";

const POINTS: readonly { name: string; line: string }[] = [
  { name: "Say it your own way", line: "\"I want my desk calmer, but I'm keeping it and my collection.\" It separates what you like from what you need, and what you're still unsure of." },
  { name: "Correct it", line: "What it understood stays visible, so you can change it. A guess shouldn't quietly become a rule, especially your budget or exact sizes." },
  { name: "Only useful questions", line: "It asks what changes the answer, such as your desk height or how often you'd move a piece, and leaves the rest for later." },
  { name: "It won't make things up", line: "It can't invent a weight limit, size, price or delivery date. If something is unknown, it says what's missing." },
  { name: "It can say don't buy", line: "If you're keeping your furniture, it won't grow the job. Keeping things as they are, waiting, or not buying are all fair answers." },
  { name: "Your photos and details", line: "We only ask for what the current idea needs, and tell you why. Rough sizes are fine to start with, and exact ones come before you order." },
];

/** What to expect from the AI assistant, for someone deciding whether to sign in. */
export function AiHelps() {
  return (
    <section className={styles.section} aria-labelledby="ai-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>The AI assistant</span>
        </p>
        <h2 id="ai-title">What to expect from it.</h2>
        <p className={styles.lede}>You never need it to buy. It's there if you find it easier to describe what you want than to browse.</p>
      </header>
      <ul className={styles.columns}>
        {POINTS.map((p) => (
          <li key={p.name} className={`${styles.point} reveal`}>
            <h3 className={styles.name}>{p.name}</h3>
            <p className={styles.line}>{p.line}</p>
          </li>
        ))}
      </ul>
      <p className={`${styles.foot} reveal`}>
        <ArrowLink href={routes.signIn}>Sign in to try it</ArrowLink>
      </p>
    </section>
  );
}
