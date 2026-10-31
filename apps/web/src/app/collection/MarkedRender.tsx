import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Marked } from "./collectionCopy";
import styles from "./MarkedRender.module.css";
import { productHref } from "../products/productHref";

/**
 * A large render in a rounded frame, with its points marked: a dot on each,
 * a fine line turning up from it to a frosted label (a link, when it names a
 * product with a page). The render and its marks sit in one box of the render's own shape,
 * centred in the frame, so the frame can crop it and the marks stay put.
 * `children` lie over the frame: a panel, a pill or a caption.
 */
export function MarkedRender({
  render,
  sizes,
  className,
  soft,
  children,
}: {
  render: Marked;
  sizes: string;
  className?: string;
  /** Rounded frame and pill labels in sentence case, for the page's banner. */
  soft?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure className={`${styles.frame} ${className ?? ""}`} data-soft={soft || undefined}>
      <div className={styles.render} style={{ aspectRatio: `${render.src.width} / ${render.src.height}` }}>
        <Image className={styles.image} src={render.src} alt={render.alt} fill sizes={sizes} placeholder="blur" />
        <ul className={styles.spots}>
          {render.spots.map((s) => {
            const href = s.id && productHref(s.id);
            return (
              <li
                key={s.label}
                className={styles.spot}
                data-side={s.side}
                style={{ left: `${s.at[0]}%`, top: `${s.at[1]}%` }}
              >
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
      {children}
    </figure>
  );
}
