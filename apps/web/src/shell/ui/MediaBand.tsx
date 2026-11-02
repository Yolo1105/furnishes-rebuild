import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

/** A 16:9 image across its span, with optional words over a shade at its foot. */
export function MediaBand({
  src,
  alt,
  sizes = "(max-width: 1023px) 100vw, 1280px",
  priority = false,
  className = "span-12",
  children,
}: {
  src: StaticImageData;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={`media-band ${className}`} style={{ margin: 0 }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} placeholder="blur" />
      {children && <figcaption className="over">{children}</figcaption>}
    </figure>
  );
}
