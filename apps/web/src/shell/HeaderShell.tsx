"use client";

import { useEffect, useRef, useState } from "react";

/** Marks a section the bar should read as ink on paper while it is under the bar. */
export const INK_BAR = { "data-bar": "ink" } as const;

/**
 * The header element. It says two things about the page under it:
 * `data-scrolled` once the page has moved, so the bar can fill with the top
 * of the background when content runs under it; and `data-tone="ink"` while
 * a section marked with INK_BAR sits under it (the plan's paper), where the
 * bar is clear and its words are ink.
 */
export function HeaderShell({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [ink, setInk] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 4);
      // the bar's middle line: is an ink section under it?
      const line = (ref.current?.offsetHeight ?? 0) / 2;
      setInk(
        [...document.querySelectorAll<HTMLElement>('[data-bar="ink"]')].some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= line && r.bottom > line;
        }),
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      ref={ref}
      className={className}
      data-scrolled={scrolled ? "true" : undefined}
      data-tone={ink ? "ink" : undefined}
    >
      {children}
    </header>
  );
}
