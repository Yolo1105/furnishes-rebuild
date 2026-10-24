"use client";

import { useEffect, useState } from "react";

/**
 * The header element, marked `data-scrolled` once the page has moved, so the
 * bar can fill with the top of the background only when content runs under
 * it. At the very top it stays clear.
 */
export function HeaderShell({ className, children }: { className?: string; children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 4);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={className} data-scrolled={scrolled ? "true" : undefined}>
      {children}
    </header>
  );
}
