import Link from "next/link";
import { routes } from "@/lib/routes";
import styles from "./DesignYourRoom.module.css";

const STEPS = [
  { title: "Tell the AI assistant about your room", line: "What bothers you, and what you want it to do." },
  { title: "See it in 3D", line: "Try furniture in a model of your room." },
  { title: "Keep it, or ask us", line: "Save your design, buy the pieces, or ask our team to review it." },
] as const;

/** What "Design your room" is: the tools behind signing in, their steps, and the way in. */
export function DesignYourRoom() {
  return (
    <section id="design-your-room" className={styles.section} aria-labelledby="design-title">
      <header className={styles.head}>
        <p className={styles.index}>
          <span>Design your room</span>
        </p>
        <h2 id="design-title" className={styles.title}>
          Try it in your room before you buy.
        </h2>
        <p className={styles.lede}>You need to sign in for this. You can buy furniture without it.</p>
        <div className={styles.calls}>
          <Link href={routes.signIn} className={styles.primary}>
            Sign in to start
          </Link>
          <Link href={routes.howItWorks} className={styles.call}>
            How it works
          </Link>
        </div>
      </header>
      <ol className={styles.steps}>
        {STEPS.map((s) => (
          <li key={s.title}>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p>{s.line}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
