import type { CSSProperties } from "react";
import styles from "./Ruler.module.css";

/** Fine ticks from one room's mark to the next's. */
const TICKS = 5;

/** Unnumbered marks the scale runs on for before the first room and after the last, so it never ends short. */
const RUN_ON = 3;

/**
 * A measuring scale up the side of the tour: fine ticks, and a long, bold
 * mark for each of `rooms`, numbered as the tour numbers them (01 on), all
 * but the room in view's, whose big number is beside it; the mark before the
 * first is the door, 00. It slides as the tour walks on (the holder's
 * --along: the room in view, with the share of the glide to the next) so the
 * room in view's mark sits at --point-y, level with its big number; that mark
 * is darkest (`at`). Only decoration, so hidden from screen readers.
 */
export function Ruler({ rooms, at }: { rooms: number; at: number }) {
  return (
    <div className={styles.ruler} aria-hidden="true">
      {Array.from({ length: (rooms - 1 + 2 * RUN_ON) * TICKS + 1 }, (_, t) => (
        <span key={t} className={styles.tick} style={{ "--t": t / TICKS - RUN_ON } as CSSProperties} />
      ))}
      {Array.from({ length: rooms + 2 * RUN_ON }, (_, k) => {
        const i = k - RUN_ON;
        const room = i >= 0 && i < rooms;
        const door = i === -1;
        return (
          <span
            key={i}
            className={styles.mark}
            data-room={room || door || undefined}
            data-on={i === at || undefined}
            style={{ "--t": i } as CSSProperties}
          >
            {(room || door) && <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>}
          </span>
        );
      })}
    </div>
  );
}
