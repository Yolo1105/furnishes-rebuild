/**
 * Scrolling the walk a section at a time, with weight. `sections` gives the
 * page's resting places (px of scroll, in order); one scroll, however hard
 * (a wheel spin, a trackpad fling, a swipe, an arrow key), sends the page on
 * to the next one, and it glides there, closing a share of the gap each
 * frame, so every stage between plays out on its own. Within a section the
 * wheel still nudges it a little either way, never far enough to leave it.
 * Off under prefers-reduced-motion. Returns a function that takes it off.
 */

/** The share of the way to the target closed each frame. */
const DAMP = 0.06;
/** A pause this long between wheel events ends one scroll, ms; the next one moves on again. */
const GESTURE_GAP = 350;
/** A new scroll moves on again only once the glide is this close to done (a share of the way still to go). */
const READY = 0.1;
/** How much wheel in one scroll it takes to move on a section, px. */
const KICK = 24;
/** How far the wheel may nudge the page off a resting place: a share of the way to the next, and at most this, px. */
const NUDGE_SHARE = 0.08;
const NUDGE_MAX = 90;
/** The wheel counts for this little while nudging. */
const NUDGE_RATE = 0.25;

export function dampScroll(sections: () => number[]) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const root = document.scrollingElement ?? document.documentElement;
  const max = () => root.scrollHeight - window.innerHeight;
  let target = root.scrollTop;
  let current = target;
  let raf = 0;
  let at = 0; // the section the page rests at, or is gliding to
  let nudge = 0;
  let last = -Infinity; // when the wheel last turned
  let wheel = 0; // how much wheel in this scroll
  let moved = false; // whether this scroll has moved on a section yet
  let leap = 0; // how far the last move on was, px

  const points = () => sections().map((p) => Math.min(Math.max(0, p), max()));
  const nearest = (y: number) => {
    const ps = points();
    return ps.reduce((best, p, i) => (Math.abs(p - y) < Math.abs(ps[best]! - y) ? i : best), 0);
  };

  const glide = () => {
    current += (target - current) * DAMP;
    if (Math.abs(target - current) < 0.5) current = target;
    window.scrollTo({ top: current, behavior: "instant" });
    raf = current === target ? 0 : requestAnimationFrame(glide);
  };
  const go = () => {
    const ps = points();
    target = Math.min(Math.max(0, ps[at]! + nudge), max());
    if (!raf) raf = requestAnimationFrame(glide);
  };
  /** Pick up from wherever the page is, if something else (the scrollbar, a link) moved it. */
  const settle = () => {
    if (raf) return;
    current = target = root.scrollTop;
    at = nearest(current);
    nudge = current - points()[at]!;
  };
  const step = (by: number) => {
    settle();
    at = Math.min(Math.max(0, at + by), points().length - 1);
    nudge = 0;
    go();
    leap = Math.abs(target - current);
  };
  /** Whether the page has (all but) arrived where the last move on sent it. */
  const ready = () => !raf || Math.abs(target - current) <= leap * READY;

  const onWheel = (e: WheelEvent) => {
    // leave pinch-zoom (ctrl) and sideways scrolls to the browser
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    if (now - last > GESTURE_GAP) {
      settle();
      wheel = 0;
      moved = false;
    }
    last = now;
    const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    wheel += d;
    // one move on to a scroll; a scroll that starts while the last glide is
    // still well under way only nudges
    if (!moved && Math.abs(wheel) > KICK) {
      moved = true;
      if (ready()) {
        step(Math.sign(wheel));
        return;
      }
    }
    // a little either way, within the section
    const ps = points();
    const next = ps[at + Math.sign(d)] ?? ps[at]!;
    const room = Math.min(NUDGE_MAX, Math.abs(next - ps[at]!) * NUDGE_SHARE);
    nudge = Math.min(room, Math.max(-room, nudge + d * NUDGE_RATE));
    go();
  };

  const KEYS: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    if (e.altKey || e.ctrlKey || e.metaKey || el?.closest("input, textarea, select, [contenteditable]")) return;
    let by = KEYS[e.key];
    if (e.key === "Home") by = -Infinity;
    if (e.key === "End") by = Infinity;
    if (by === undefined) return;
    e.preventDefault();
    step(e.key === " " && e.shiftKey ? -1 : Number.isFinite(by) ? by : by > 0 ? 1e3 : -1e3);
  };

  // a swipe moves on a section, however long
  let touchY: number | null = null;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches.length === 1 ? e.touches[0]!.clientY : null;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touchY !== null) e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchY === null) return;
    const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
    touchY = null;
    if (Math.abs(dy) > 30) step(Math.sign(dy));
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    cancelAnimationFrame(raf);
  };
}
