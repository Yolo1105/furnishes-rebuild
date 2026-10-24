"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { DEMO_COOKIE } from "./demo-account";

/**
 * A demo sign-in, kept in this browser only. There is no real account behind
 * it: it lets the signed-in parts of the site be seen before accounts exist,
 * and everything that shows it says "Demo".
 *
 * It lives in a cookie, not local storage, so the server can read it too and
 * send the page already showing the right state. With local storage the
 * server always sent "Sign in" and the browser swapped it a moment later.
 */

const EVENT = "furnishes-demo-session";
const MONTH = 60 * 60 * 24 * 30;

function read(): boolean {
  return document.cookie.split("; ").includes(`${DEMO_COOKIE}=1`);
}

function write(on: boolean) {
  document.cookie = on
    ? `${DEMO_COOKIE}=1; path=/; max-age=${MONTH}; samesite=lax`
    : `${DEMO_COOKIE}=; path=/; max-age=0; samesite=lax`;
  window.dispatchEvent(new Event(EVENT));
}

export const signInDemo = () => write(true);
export const signOutDemo = () => write(false);

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** What the server read from the cookie, so the first render matches it. */
const ServerDemo = createContext(false);

export function DemoSessionProvider({ initial, children }: { initial: boolean; children: React.ReactNode }) {
  return <ServerDemo.Provider value={initial}>{children}</ServerDemo.Provider>;
}

/** Whether the demo account is signed in. */
export function useDemoSession(): boolean {
  const initial = useContext(ServerDemo);
  return useSyncExternalStore(subscribe, read, () => initial);
}
