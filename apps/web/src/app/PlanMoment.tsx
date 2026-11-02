"use client";

import { useEffect, useRef, useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { productById, sizeLabel } from "@/features/products/catalogue";
import { routes } from "@/lib/routes";
import { Button } from "@/shell/ui/Button";
import styles from "./landing.module.css";

/** The piece drawn into the living room, at its real size, and where it stands, mm on the plan. */
const PIECE = productById("entry")!;
const AT = { x: 13000, y: 5900 };

/** How far through the pinned stretch the piece comes in. */
const PIECE_AT = 0.5;

/**
 * The landing's one pinned moment: on wide screens the section holds for one
 * screen of scroll while the flat's plan draws itself, then the piece appears
 * in the living room at its real size. On narrower screens, or for anyone who
 * asks for less motion, the plan is simply there, the piece in it.
 */
export function PlanMoment() {
  const track = useRef<HTMLDivElement>(null);
  const [draw, setDraw] = useState<"static" | "wait" | "play">("static");
  const [piece, setPiece] = useState(true);

  useEffect(() => {
    const pinned = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!pinned.matches || !track.current) return;
    setDraw("wait");
    setPiece(false);
    const seen = new IntersectionObserver(([e]) => e?.isIntersecting && setDraw("play"), { rootMargin: "0px 0px -40% 0px" });
    seen.observe(track.current);
    let frame = 0;
    const update = () => {
      const box = track.current?.getBoundingClientRect();
      if (!box) return;
      const p = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - innerHeight)));
      setPiece(p >= PIECE_AT);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
    };
  }, []);

  const { w, d } = PIECE.size;
  return (
    <section className="band-linen" aria-labelledby="plan-title">
      <div ref={track} className={styles.track} data-pinned={draw !== "static" || undefined}>
        <div className={`container ${styles.split}`}>
          <header className={`section-head span-4 ${styles.words}`}>
            <p className="eyebrow">Design your room</p>
            <h2 id="plan-title">Try a piece in a real HDB flat before you buy.</h2>
            <p className="lede">Pick a piece and it is drawn in where it would go, at its real size.</p>
            <div className="actions">
              <Button variant="secondary" href={routes.designYourRoom}>
                Open the room planner
              </Button>
            </div>
          </header>
          <div className={`span-8 ${styles.plan}`} data-draw={draw}>
            <FloorPlan label={`Floor plan of a five-room HDB flat, with the ${PIECE.name.toLowerCase()} drawn in the living room at its real size`}>
              <g className={styles.piece} data-on={piece || undefined}>
                <rect x={AT.x} y={AT.y} width={w} height={d} />
                <text x={AT.x + w / 2} y={AT.y - 120} fontSize={170}>
                  {PIECE.name}, {sizeLabel(PIECE.size)}
                </text>
              </g>
            </FloorPlan>
          </div>
        </div>
      </div>
    </section>
  );
}
