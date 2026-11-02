import Image from "next/image";
import Link from "next/link";
import { productHref } from "../products/productHref";
import type { Marked } from "./collectionCopy";
import styles from "./MarkedRender.module.css";

/**
 * A render of our pieces in a 16:9 frame, with its parts marked: a dot on
 * each, a fine line rising from it to a label (a link, when it names a piece
 * with a page). The render and its marks sit in one box of the render's own
 * shape, centred in the frame, so the frame can crop it and the marks stay put.
 * On a phone the marks are left off and the picture fills the frame.
 */
export function MarkedRender({ render, sizes, className = "", priority }: { render: Marked; sizes: string; className?: string; priority?: boolean }) {
  return (
    <figure className={`media-band ${styles.frame} ${className}`.trim()}>
      <div className={styles.render} style={{ aspectRatio: `${render.src.width} / ${render.src.height}` }}>
        <Image src={render.src} alt={render.alt} fill sizes={sizes} placeholder="blur" priority={priority} />
        <ul className={styles.spots}>
          {render.spots.map((s) => {
            const href = s.id && productHref(s.id);
            return (
              <li key={s.label} className={styles.spot} data-side={s.side} style={{ left: `${s.at[0]}%`, top: `${s.at[1]}%` }}>
                {href ? (
                  <Link href={href} className={styles.label}>
                    {s.label}
                  </Link>
                ) : (
                  <span className={styles.label}>{s.label}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
