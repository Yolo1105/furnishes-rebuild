import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import dividerRender from "@/assets/catalogue/scene/divider.webp";
import mobileScreenRender from "@/assets/catalogue/scene/mobile-screen.webp";
import entryRender from "@/assets/render-entry.webp";
import { routes } from "@/lib/routes";
import styles from "./WhoFor.module.css";

const WHO: readonly { name: string; line: string; href: string; render: StaticImageData }[] = [
  { name: "HDB homes", line: "Pieces for the small spots that bother you, sized for a flat, from the door to the bedside.", href: routes.hdbHomes, render: entryRender },
  { name: "Rented and shared rooms", line: "Tall cabinets that split one room in two, at the size you need rather than a fixed one. Coming soon.", href: routes.roomDividers, render: dividerRender },
  { name: "Startup offices", line: "Ready-made desks and chairs for a growing team, with invoices for bulk orders. Movable screens are coming soon.", href: routes.workspaces, render: mobileScreenRender },
];

/** Who the furniture is for, each leading to its own page. */
export function WhoFor() {
  return (
    <section className={styles.who} aria-labelledby="who-for-title">
      <header className={`${styles.head} reveal`}>
        <p className={styles.index}>
          <span>Who it's for</span>
        </p>
        <h2 id="who-for-title">Made for small spaces that change.</h2>
      </header>
      <ul className={styles.list}>
        {WHO.map((w) => (
          <li key={w.name} className="reveal">
            <Link href={w.href} className={styles.item}>
              <span className={styles.picture}>
                <Image src={w.render} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" placeholder="blur" />
              </span>
              <span className={styles.name}>{w.name}</span>
              <span className={styles.line}>{w.line}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
