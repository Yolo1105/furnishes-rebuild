import Link from "next/link";
import type { CSSProperties } from "react";
import button from "@/features/plan/InkButton.module.css";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { routes } from "@/lib/routes";
import room from "../../../public/rooms/a-frame-living-room.jpg";
import styles from "./PhotoIntro.module.css";

/**
 * The walk's opening, laid over it: a photo of a real room, the title and
 * the way in. As the page scrolls (PlanWalk sets --intro, 0 to 1) the
 * room's main lines draw themselves over the photo, the photo fades away
 * under them, and then the sketch fades too, leaving the plan beneath.
 *
 * The lines are traced from the photo, in its own pixels (2000 x 1334).
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
  // the skylights in the left slope, and the screen on that wall
  { d: "M205 248H272L222 388L163 385Z", at: 0.2 },
  { d: "M330 248H393L345 428L284 425Z", at: 0.23 },
  { d: "M418 248H478L424 460L366 456Z", at: 0.26 },
  { d: "M235 650H338L298 800L178 826Z", at: 0.3 },
  // the stair: its stringer and its treads, and the door behind it
  { d: "M1395 235L1225 880", at: 0.28 },
  {
    d: "M1160 268H1540M1155 345H1515M1150 410H1495M1145 480H1470M1140 540H1455M1135 595H1435M1125 670H1395M1120 745H1380M1115 805H1355M1110 865H1345",
    at: 0.32,
  },
  { d: "M1060 880V525H1110V880", at: 0.36 },
  // the pendant lights
  { d: "M1205 210V490M1272 130V460M1358 15V415", at: 0.34 },
  {
    d: "M1205 520m-30 0a30 32 0 1 0 60 0a30 32 0 1 0 -60 0M1272 492m-34 0a34 36 0 1 0 68 0a34 36 0 1 0 -68 0M1358 450m-38 0a38 40 0 1 0 76 0a38 40 0 1 0 -76 0",
    at: 0.4,
  },
  // the skylight in the right slope, and the kitchen counter under it
  { d: "M1640 420L1835 378L1975 692L1790 700Z", at: 0.42 },
  { d: "M1560 855L2000 935M1575 870L2000 962", at: 0.46 },
  // the island
  {
    d: "M1035 880H1400L1880 1135H1230ZM1230 1135V1334M1880 1135V1334M1035 880V1195L1230 1334",
    at: 0.5,
  },
  // the sofa, the round table, the stump, the two velvet chairs
  {
    d: "M560 870L720 860M710 840L940 820M725 860L975 862L978 1040L790 1045",
    at: 0.56,
  },
  { d: "M545 912m-110 0a110 25 0 1 0 220 0a110 25 0 1 0 -220 0", at: 0.6 },
  { d: "M372 985H470V1115H372Z", at: 0.62 },
  { d: "M190 1025m-160 0a160 115 0 1 0 320 0a160 115 0 1 0 -320 0", at: 0.66 },
  { d: "M643 1020m-147 0a147 115 0 1 0 294 0a147 115 0 1 0 -294 0", at: 0.7 },
];

export function PhotoIntro() {
  return (
    // a light picture under the bar (PlanWalk clears it once the photo has gone); the wordmark at the bar's left
    <div
      className={styles.intro}
      data-intro
      data-light-under-bar
      data-wordmark-left
    >
      <div className={styles.paper} />
      <svg
        className={styles.room}
        viewBox="0 0 2000 1334"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A bright A-frame living room: two orange velvet chairs and a cream sofa under triangular windows onto pine woods, an open stair and a stone kitchen island"
      >
        <image
          className={styles.photo}
          href={room.src}
          width="2000"
          height="1334"
        />
        <g className={styles.lines}>
          {LINES.map((l, i) => (
            <path
              key={i}
              d={l.d}
              pathLength={1}
              style={{ "--at": l.at } as CSSProperties}
            />
          ))}
        </g>
      </svg>
      <div className={styles.hero}>
        <HeroTitle className={styles.place}>
          <p className={styles.slogan}>
            Made for your room, to the millimetre.
          </p>
          <Link
            href={routes.studio}
            className={`${button.button} ${styles.start}`}
          >
            Explore your journey
          </Link>
        </HeroTitle>
      </div>
      {/* the page goes on below */}
      <svg className={styles.cue} viewBox="0 0 24 12" aria-hidden="true">
        <path d="M2 2l10 8 10-8" />
      </svg>
    </div>
  );
}
