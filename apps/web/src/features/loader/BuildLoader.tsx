"use client";

import { useEffect, useState } from "react";
import { LandingLoader } from "./LandingLoader";

/**
 * The home page's opening screen: the live site's loader, finishing once the
 * page behind it has loaded, then gone for good.
 */
export function BuildLoader() {
  const [loaded, setLoaded] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (gone) return null;
  return <LandingLoader ready={loaded} allowReveal={loaded} onDone={() => setGone(true)} />;
}
