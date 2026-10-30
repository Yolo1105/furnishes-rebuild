"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ROOMS } from "@/features/plan/flat";
import type { ROOM_PHOTOS } from "./rooms";
import styles from "./RoomPhotos.module.css";

/** How far into the patch's darkest and lightest pixels a word's worst case is taken. */
const WORST = 0.1;

/** A colour's share of white (relative luminance, 0 to 1), from its sRGB channels (0 to 255). */
function luminance(r: number, g: number, b: number): number {
  const lin = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** The luminances of site colours, by their tokens' names ("#rrggbb" values), read in one go. */
function tokenLuminances<T extends string>(names: readonly T[]): Record<T, number> {
  const root = getComputedStyle(document.documentElement);
  const out = {} as Record<T, number>;
  for (const name of names) {
    const hex = root.getPropertyValue(name).trim();
    out[name] = luminance(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16));
  }
  return out;
}

/** The colours the label chooses between. */
const TOKENS = ["--color-umber", "--color-apricot", "--color-clay", "--color-linen"] as const;

/** How far apart two luminances read, from 1 (the same) to 21 (black on white). */
function contrast(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * How well `dark` and `light` (colour luminances) read over the part of `img`
 * under `box` (both as laid out on screen), as [dark, light] contrasts. The
 * patch is shrunk onto a grid of pixels and each colour is judged at its
 * worst there: the dark one against the patch's darkest pixels, the light one
 * against its lightest. Unknown (not yet loaded) favours the dark one.
 */
function readability(img: HTMLImageElement, box: DOMRect, dark: number, light: number): [number, number] {
  if (!img.complete || !img.naturalWidth) return [1, 0];
  const r = img.getBoundingClientRect();
  const scaleX = img.naturalWidth / r.width;
  const scaleY = img.naturalHeight / r.height;
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 8;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [1, 0];
  ctx.drawImage(
    img,
    (box.left - r.left) * scaleX,
    (box.top - r.top) * scaleY,
    box.width * scaleX,
    box.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const lums: number[] = [];
  for (let i = 0; i < px.length; i += 4) lums.push(luminance(px[i]!, px[i + 1]!, px[i + 2]!));
  lums.sort((x, y) => x - y);
  const darkest = lums[Math.floor(WORST * (lums.length - 1))]!;
  const lightest = lums[Math.floor((1 - WORST) * (lums.length - 1))]!;
  return [contrast(dark, darkest), contrast(light, lightest)];
}

/**
 * Whether the light colours read better than the dark ones over a set of
 * [dark, light] readabilities, taken together: each side at its weakest.
 */
function lightWins(readings: [number, number][]): boolean {
  return Math.min(...readings.map((r) => r[1])) > Math.min(...readings.map((r) => r[0]));
}

/**
 * The room photos, one at a time: `at` is the one in view, labelled
 * "Interior / Revolution" at the bottom left. All are fetched, so any can come up
 * at once (hovering a room on the plan brings its photo up). Each is cropped
 * to fill its box, `zoom` times closer, with the room's middle (`focus`) kept
 * central. The label is in its browns or its creams, whichever pair reads
 * better over the photo behind its words (unless the photo says to keep it
 * brown): measured from each photo as it loads and whenever the half changes
 * size. Each photo is
 * decoded as soon as it arrives, so it fades in without a stall. A strip of
 * every photo runs below it, the one in view framed: picking one calls
 * `onPick`, and `hold` (pointer handlers) goes on the strip to pause the turning.
 */
export function RoomPhotos({
  photos,
  at,
  onPick,
  hold,
}: {
  photos: typeof ROOM_PHOTOS;
  at: number;
  onPick: (i: number) => void;
  hold: { onPointerEnter: () => void; onPointerLeave: () => void };
}) {
  const frame = useRef<HTMLDivElement>(null);
  const lead = useRef<HTMLSpanElement>(null);
  const echo = useRef<HTMLSpanElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  // for each photo, whether cream reads better for the label
  const [dark, setDark] = useState<boolean[]>([]);

  // measures the photos given (by index), or all of them
  const measure = useCallback((only?: number) => {
    if (!frame.current || !lead.current || !echo.current) return;
    const imgs = [...frame.current.querySelectorAll("img")];
    const which = only === undefined ? imgs.map((_, i) => i) : [only];
    const lum = tokenLuminances(TOKENS);
    const leadBox = lead.current.getBoundingClientRect();
    const echoBox = echo.current.getBoundingClientRect();
    const read = (img: HTMLImageElement) =>
      lightWins([
        readability(img, leadBox, lum["--color-umber"], lum["--color-apricot"]),
        readability(img, echoBox, lum["--color-clay"], lum["--color-linen"]),
      ]);
    setDark((prev) => {
      const next = prev.slice();
      let changed = false;
      for (const i of which) {
        const img = imgs[i];
        if (!img) continue;
        const v = read(img);
        if (next[i] !== v) {
          next[i] = v;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  // all of them again when the half changes size, once a frame at most
  useEffect(() => {
    if (!frame.current || !lead.current || !echo.current) return;
    let pending = 0;
    const watch = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => measure());
    });
    watch.observe(frame.current);
    return () => {
      cancelAnimationFrame(pending);
      watch.disconnect();
    };
  }, [measure]);

  // the strip keeps the photo in view in sight, moving only itself, not the page
  useEffect(() => {
    const row = strip.current;
    const thumb = row?.children[at] as HTMLElement | undefined;
    if (!row || !thumb) return;
    row.scrollTo({ left: thumb.offsetLeft - (row.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [at]);

  const labelOnDark = photos[at]?.label !== "light" && (dark[at] ?? false);
  const ink = photos[at]?.ink;
  const nameOnDark = ink ? ink === "cream" : labelOnDark;
  const roomName = ROOMS.find((r) => r.key === photos[at]?.room)?.name;

  return (
    <div ref={frame} className={styles.frame}>
      <div className={styles.stage}>
        {photos.map(({ src, alt, focus = [50, 50], zoom = 1 }, i) => (
          <div key={src.src} className={styles.slide} data-active={i === at || undefined} aria-hidden={i !== at}>
            <div
              className={styles.canvas}
              style={
                {
                  "--ratio": src.width / src.height,
                  "--focus-x": focus[0] / 100,
                  "--focus-y": focus[1] / 100,
                  "--zoom": zoom,
                } as CSSProperties
              }
            >
              {/* the photo runs past its half: about the screen's width, more on phones */}
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(orientation: portrait) 240vw, 100vw"
                priority={i === 0}
                placeholder="blur"
                onLoad={(e) => {
                  // decoded now, not as it first fades in; measured once it is
                  e.currentTarget.decode().then(
                    () => measure(i),
                    () => measure(i),
                  );
                }}
              />
            </div>
          </div>
        ))}
        {/* the room in view */}
        <p key={roomName} className={styles.roomName} data-on-dark={nameOnDark || undefined}>
          {roomName}
        </p>
        <p className={styles.label}>
          <span ref={lead} className={styles.lead} data-on-dark={labelOnDark || undefined}>
            Interior
          </span>
          <span ref={echo} className={styles.echo} data-on-dark={labelOnDark || undefined}>
            Revolution
          </span>
        </p>
      </div>
      {/* every photo in a row below, the one in view framed; any can be picked */}
      <div ref={strip} className={styles.strip} {...hold}>
        {photos.map(({ src, alt, focus = [50, 50] }, i) => (
          <button
            key={src.src}
            type="button"
            className={styles.thumb}
            aria-label={alt}
            aria-current={i === at || undefined}
            onClick={() => onPick(i)}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="130px"
              placeholder="blur"
              loading="eager"
              style={{ objectPosition: `${focus[0]}% ${focus[1]}%` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
