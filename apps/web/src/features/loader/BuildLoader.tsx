"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { LandingLoader } from "./LandingLoader";

const REDUCED = "(prefers-reduced-motion: reduce)";

/** Whether the viewer has asked for less motion; false on the server. */
function useReducedMotion() {
  return useSyncExternalStore(
    (changed) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", changed);
      return () => query.removeEventListener("change", changed);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/**
 * The home page's opening screen: the live site's loader, finishing once the
 * page behind it has loaded, then gone for good. While it shows, <html>
 * carries data-loading, and the walk's 3D waits for it to go, so the two never
 * draw at once. With reduced motion asked for, there is no loader at all.
 */
export function BuildLoader() {
  // Already loaded if this first renders in the browser after the load event.
  const [loaded, setLoaded] = useState(() => typeof document !== "undefined" && document.readyState === "complete");
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();
  const showing = !gone && !reduced;

  // A layout effect, so the mark is up before the walk's own effects run.
  useLayoutEffect(() => {
    if (!showing) return;
    const root = document.documentElement;
    root.setAttribute("data-loading", "");
    return () => root.removeAttribute("data-loading");
  }, [showing]);

  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [loaded]);

  if (!showing) return null;
  return <LandingLoader ready={loaded} allowReveal={loaded} onDone={() => setGone(true)} />;
}
