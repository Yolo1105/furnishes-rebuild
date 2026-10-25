"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WASH_CSS } from "@/features/stage/wash";
import styles from "./LandingLoader.module.css";
import type { LandingLoaderPhase, LandingLoaderSceneHandle } from "./three/landing-scene-types";
import { LOADER_TIMING } from "./three/loader-timing";

/**
 * The live site's opening screen (furnishes_prod, LandingLoader), brought
 * over as it is: on the orange wash, an isometric modular sofa drops in
 * block by block while a line traces round it and the count runs to 100;
 * then the pieces hop and are swallowed into the middle, and the cover
 * fades away to the landing. "furnishes." stays where the bar's wordmark is.
 *
 * Changed from furnishes_prod: its probe that sized --nav-h from a hidden copy
 * of its header is left out (this site's bar is set by --nav-h), as are the
 * skip and force-release paths nothing here uses; its two CSS durations come
 * from LOADER_TIMING.
 */

type LandingLoaderProps = {
  /** When true (default), the loader may finish after the min duration. */
  ready?: boolean;
  /**
   * When true, start the opacity crossfade that reveals the landing underneath.
   * Parent should set this only after the page under it has painted.
   */
  allowReveal?: boolean;
  onDone: () => void;
};

function useOneShot(callback: (() => void) | undefined) {
  const ref = useRef(callback);
  const firedRef = useRef(false);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);
  return useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    ref.current?.();
  }, []);
}

export function LandingLoader({ ready = true, allowReveal = false, onDone }: LandingLoaderProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<LandingLoaderSceneHandle | null>(null);
  const readyRef = useRef(ready);
  const phaseRef = useRef<LandingLoaderPhase>("run");
  const exitTimersRef = useRef<number[]>([]);
  const revealStartedRef = useRef(false);

  const fireDone = useOneShot(onDone);

  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<LandingLoaderPhase>("run");
  /** Cover held opaque after collapse until the page is ready to crossfade. */
  const [holding, setHolding] = useState(false);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearExitTimers = useCallback(() => {
    exitTimersRef.current.forEach((id) => window.clearTimeout(id));
    exitTimersRef.current = [];
  }, []);

  const beginExit = useCallback(() => {
    if (phaseRef.current !== "run") return;
    phaseRef.current = "breath";
    setPhase("breath");
    exitTimersRef.current.push(
      window.setTimeout(() => {
        phaseRef.current = "exit";
        setPhase("exit");
      }, LOADER_TIMING.dwellMs),
    );
    /* After pieces collapse: hold the cover, then dispose loader GL so the
       page never shows through a transparent frame. */
    exitTimersRef.current.push(
      window.setTimeout(() => {
        phaseRef.current = "hold";
        setPhase("hold");
        setHolding(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            handleRef.current?.releaseRenderer();
          });
        });
      }, LOADER_TIMING.dwellMs + LOADER_TIMING.exitMs),
    );
  }, []);

  /* Crossfade only once the page under it has painted (or parent forced reveal). */
  useEffect(() => {
    if (!allowReveal || !holding || revealStartedRef.current) return;
    let cancelled = false;
    let doneTimer = 0;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (cancelled || revealStartedRef.current) return;
        revealStartedRef.current = true;
        phaseRef.current = "wipe";
        setPhase("wipe");
        setWiping(true);
        doneTimer = window.setTimeout(() => {
          phaseRef.current = "gone";
          setPhase("gone");
          fireDone();
        }, LOADER_TIMING.revealMs);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(doneTimer);
    };
  }, [allowReveal, holding, fireDone]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let handle: LandingLoaderSceneHandle | null = null;

    void import("./three/createLandingLoaderScene")
      .then(({ createLandingLoaderScene }) => {
        if (cancelled) return;
        handle = createLandingLoaderScene({
          mount,
          getReady: () => readyRef.current,
          getPhase: () => phaseRef.current,
          onPct: setPct,
          onLift: beginExit,
        });

        if (!handle) {
          setHolding(true);
          return;
        }

        handleRef.current = handle;
      })
      .catch(() => {
        if (cancelled) return;
        setHolding(true);
      });

    return () => {
      cancelled = true;
      clearExitTimers();
      handle?.dispose();
      handleRef.current = null;
    };
  }, [beginExit, clearExitTimers]);

  const exiting = phase === "exit" || phase === "hold" || phase === "wipe" || phase === "gone" || holding;
  const holdClass = holding ? styles.introHold : "";
  const revealClass = wiping || phase === "gone" ? styles.introWipe : "";

  return (
    <div
      className={`${styles.intro}${exiting ? ` ${styles.introExit}` : ""}${holdClass ? ` ${holdClass}` : ""}${revealClass ? ` ${revealClass}` : ""}`}
      role="dialog"
      aria-label="Loading Furnishes"
      aria-busy={phase === "run"}
      style={{ "--exit": `${LOADER_TIMING.exitMs}ms`, "--reveal": `${LOADER_TIMING.revealMs}ms` } as React.CSSProperties}
    >
      {/* Single stage-matched wash: under the canvas during run; sole cover after hold. */}
      <div className={styles.introCover} style={{ backgroundImage: WASH_CSS }} aria-hidden="true" />

      <div ref={mountRef} className={styles.introCanvas} aria-hidden="true" />

      <div className={styles.introBrand} aria-hidden="true">
        furnishes.
      </div>

      <div className={styles.introCount}>
        <div className={styles.introCountLabel}>loading</div>
        <div className={styles.introCountNum} data-testid="landing-loader-progress">
          <span className={styles.introBrO} aria-hidden="true">
            「
          </span>
          {String(pct).padStart(2, "0")}
          <span className={styles.introBrC} aria-hidden="true">
            」
          </span>
          <span className={styles.introPct} aria-hidden="true">
            %
          </span>
        </div>
      </div>

      <div className={styles.introMeta}>
        <div className={styles.introMetaMono}>[ Modular furniture · Made to measure ]</div>
        <div className={styles.introMetaTop}>Made for your home</div>
      </div>
    </div>
  );
}
