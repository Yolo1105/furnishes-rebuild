import Link from "next/link";
import { type CSSProperties, Fragment } from "react";
import button from "@/features/plan/InkButton.module.css";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { routes } from "@/lib/routes";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room, the title and
 * the way in. As the page scrolls (PlanWalk sets --intro, 0 to 1) the
 * room's main lines draw themselves over the photo, the photo fades away
 * under them, and then the sketch fades too, leaving the plan of that one
 * room beneath (01, told either side of it); then the rest of the flat
 * grows in round it (02, the same way).
 *
 * The lines are the building's only (roof, windows, stair, door), not its
 * furniture, traced from the photo in its own pixels (2000 x 1334).
 */

type Line = { d: string; at: number }; // `at`: when it starts to draw, 0 to 1 of the drawing

const LINES: Line[] = [
  // the ceiling, and the slopes of the roof
  { d: "M0 248H1560L2000 150", at: 0 },
  { d: "M612 248L372 770", at: 0.05 },
  // the A-frame window: its sill, its bar, and the lattice
  { d: "M372 770H990", at: 0.1 },
  { d: "M490 470H980", at: 0.12 },
  { d: "M650 250L870 755", at: 0.15 },
  { d: "M825 250L625 770", at: 0.18 },
  { d: "M975 470L865 750", at: 0.21 },
  { d: "M470 490L578 770", at: 0.24 },
  // the skylights in the left slope
  { d: "M205 248H272L222 388L163 385Z", at: 0.2 },
  { d: "M330 248H393L345 428L284 425Z", at: 0.23 },
  { d: "M418 248H478L424 460L366 456Z", at: 0.26 },
  // the stair: its stringer and its treads, and the door behind it
  { d: "M1395 235L1225 880", at: 0.28 },
  {
    d: "M1160 268H1540M1155 345H1515M1150 410H1495M1145 480H1470M1140 540H1455M1135 595H1435M1125 670H1395M1120 745H1380M1115 805H1355M1110 865H1345",
    at: 0.32,
  },
  { d: "M1060 880V525H1110V880", at: 0.36 },
  // the skylight in the right slope
  { d: "M1640 420L1835 378L1975 692L1790 700Z", at: 0.42 },
];

/** The two steps the opening tells beside the plan, before the walk's own panel takes over at 03. */
const SIDES = [
  {
    no: "01",
    at: "one",
    label: "An idea",
    headline: "Every home starts with an idea.",
    body: "A room you love, a feeling you want to come home to. We begin where you do: with one room.",
    facts: ["Living & dining", "6.8 × 6.6 m", "Drawn to scale"],
  },
  {
    no: "02",
    at: "two",
    label: "The whole home",
    headline: "Then it becomes a plan.",
    body: "Your idea, drawn into the whole flat: every room to scale, every wall and window where it really is.",
    facts: ["5-room HDB flat", "3 bedrooms · 2 bathrooms", "Kitchen, yard and shelter"],
  },
] as const;

export function PhotoIntro() {
  return (
    // a light picture under the bar (PlanWalk clears it once the photo has gone); the wordmark at the bar's left
    <div className={styles.intro} data-intro data-light-under-bar data-wordmark-left>
      <div className={styles.scene}>
        <svg
          className={styles.room}
          viewBox="0 0 2000 1334"
          role="img"
          aria-label="A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
        >
          <image className={styles.photo} href={room.src} width="2000" height="1334" />
          <g className={styles.lines}>
            {LINES.map((l, i) => (
              <path key={i} d={l.d} pathLength={1} style={{ "--at": l.at } as CSSProperties} />
            ))}
          </g>
        </svg>
      </div>
      <div className={styles.hero}>
        <HeroTitle className={styles.place}>
          <p className={styles.slogan}>Made for your room, to the millimetre.</p>
          <Link href={routes.studio} className={`${button.button} ${styles.start}`}>
            Explore your journey
          </Link>
        </HeroTitle>
      </div>
      {/* once the sketch has turned into the living room's plan, then as the rest of the flat grows round it */}
      {SIDES.map((side) => (
        <Fragment key={side.no}>
          {/* the plan sits between: what the stage is on its left, what it shows on its right */}
          <section className={`${styles.side} ${styles.left} ${styles[side.at]}`} data-side="left">
            <p className={styles.no}>{side.no}</p>
            <p className={styles.label}>
              {side.no} · {side.label}
            </p>
            <h2 className={styles.headline}>{side.headline}</h2>
          </section>
          <section className={`${styles.side} ${styles.right} ${styles[side.at]}`} data-side="right">
            <p className={styles.body}>{side.body}</p>
            <ul className={styles.facts}>
              {side.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </section>
        </Fragment>
      ))}
      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </div>
  );
}
