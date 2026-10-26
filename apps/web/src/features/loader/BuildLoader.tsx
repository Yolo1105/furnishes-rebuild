"use client";

import { useEffect, useState } from "react";
import { LandingLoader } from "./LandingLoader";

/**
 * The home page's opening screen: the live site's loader, finishing once the
 * page behind it has loaded, then gone for good.
 */
export function BuildLoader() {
  // Already loaded if this first renders in the browser after the load event.
  const [loaded, setLoaded] = useState(() => typeof document !== "undefined" && document.readyState === "complete");
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [loaded]);

  if (gone) return null;
  return <LandingLoader ready={loaded} allowReveal={loaded} onDone={() => setGone(true)} />;
}
