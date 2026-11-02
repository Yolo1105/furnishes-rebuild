"use client";

import { useState } from "react";
import { FloorPlan } from "@/features/plan/FloorPlan";
import { ROOMS } from "@/features/plan/flat";
import { PRODUCTS, priceFrom, sizeLabel } from "@/features/products/catalogue";
import { Elevation, elevationWidth } from "@/features/products/Elevation";
import { contactHref } from "@/lib/routes";
import { Button } from "@/shell/ui/Button";
import { ROOM_NOTES } from "./tour";
import styles from "./studio.module.css";

/** The pieces that can be ordered today: the ones to try in a room. */
const PIECES = PRODUCTS.filter((p) => p.status === "launch");

/** Every room with a note: these answer the pointer on the plan. */
const LINKED: ReadonlySet<string> = new Set(Object.keys(ROOM_NOTES));

/**
 * The room planner: the flat's plan beside the controls. Pick a room (on the
 * plan or in the list) and a piece, and the piece is drawn in the middle of
 * that room at its real size, with its front and side drawn to scale below.
 */
export function StudioView() {
  const [room, setRoom] = useState("living");
  const [pieceId, setPieceId] = useState(PIECES[0]!.id);
  const piece = PIECES.find((p) => p.id === pieceId)!;
  const r = ROOMS.find((x) => x.key === room)!;
  const { w, h, d } = piece.size;
  const at = { x: r.x + r.w / 2 - w / 2, y: r.y + r.d / 2 - d / 2 };
  const scale = elevationWidth(Math.max(w, d)) * 1.1;

  return (
    <div className="span-12 subgrid">
      <div className={`span-8 ${styles.plan}`}>
        <FloorPlan grid linked={LINKED} active={room} onRoom={setRoom}>
          <g className={styles.piece}>
            <rect x={at.x} y={at.y} width={w} height={d} />
          </g>
        </FloorPlan>
      </div>

      <div className={`span-4 ${styles.controls}`}>
        <fieldset className={styles.group}>
          <legend className="eyebrow">Room</legend>
          <div className="chips">
            {ROOMS.filter((x) => LINKED.has(x.key)).map((x) => (
              <button key={x.key} type="button" className="chip" aria-pressed={x.key === room} onClick={() => setRoom(x.key)}>
                {x.name}
              </button>
            ))}
          </div>
          <p className="meta" aria-live="polite">
            {ROOM_NOTES[room]?.line}
          </p>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className="eyebrow">Piece</legend>
          <div className="chips">
            {PIECES.map((p) => (
              <button key={p.id} type="button" className="chip" aria-pressed={p.id === pieceId} onClick={() => setPieceId(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
          <p className="card-row">
            <span className="mono">{sizeLabel(piece.size)}</span>
            <span className="price">{priceFrom(piece.id)}</span>
          </p>
        </fieldset>

        <div className={styles.elevations}>
          <Elevation across={w} high={h} label="Front" scale={scale} />
          <Elevation across={d} high={h} label="Side" scale={scale} />
        </div>

        <div className="actions">
          <Button variant="primary" href={contactHref("room", piece.id)}>
            Ask us to check it fits
          </Button>
        </div>
      </div>
    </div>
  );
}
