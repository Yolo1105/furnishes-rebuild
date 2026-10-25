/**
 * Scrolling the walk a section at a time, with weight. `sections` gives the
 * page's resting places (px of scroll, in order); one scroll, however hard
 * (a wheel spin, a trackpad fling, a swipe, an arrow key), sends the page on
 * to the next one, and it glides there like something with weight: it
 * takes a moment to get going, gathers speed, and eases to a stop (a
 * critically damped spring), so every stage between plays out on its own;
 * another scroll mid-glide carries the speed on rather than starting over. Within a section the
 * wheel still nudges it a little either way, never far enough to leave it.
 * Off under prefers-reduced-motion. Returns a function that takes it off.
 */

/** How stiff the spring the page glides on is, 1/s: about 4 / this seconds to settle. */
const SPRING = 4.2;
/** A pause this long between wheel events ends one scroll, ms; the next one moves on again. */
const GESTURE_GAP = 180;
/**
 * A trackpad's fling trails off over a second or more; a new swipe during it
 * shows as the wheel suddenly turning this many times harder, and is a new
 * scroll (once the last has run this long, ms).
 */
const SURGE = 2;
const SURGE_AFTER = 120;
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
  let speed = 0; // px/s
  let then = 0; // the last frame's time
  let raf = 0;
  let at = 0; // the section the page rests at, or is gliding to
  let nudge = 0;
  let last = -Infinity; // when the wheel last turned
  let wheel = 0; // how much wheel in this scroll
  let moved = false; // whether this scroll has moved on a section yet
  let began = -Infinity; // when this scroll began
  let lastSize = 0; // how hard the wheel last turned

  const points = () => sections().map((p) => Math.min(Math.max(0, p), max()));
  const nearest = (y: number) => {
    const ps = points();
    return ps.reduce((best, p, i) => (Math.abs(p - y) < Math.abs(ps[best]! - y) ? i : best), 0);
  };

  const glide = (now: number) => {
    const dt = Math.min(1 / 30, (now - then) / 1000 || 1 / 60);
    then = now;
    // pulled toward the target, held back by its own speed: no overshoot
    speed += (SPRING * SPRING * (target - current) - 2 * SPRING * speed) * dt;
    current += speed * dt;
    if (Math.abs(target - current) < 0.5 && Math.abs(speed) < 20) [current, speed] = [target, 0];
    window.scrollTo({ top: current, behavior: "instant" });
    raf = current === target ? 0 : requestAnimationFrame(glide);
  };
  const go = () => {
    const ps = points();
    target = Math.min(Math.max(0, ps[at]! + nudge), max());
    if (!raf) {
      then = performance.now();
      raf = requestAnimationFrame(glide);
    }
  };
  /** Pick up from wherever the page is, if something else (the scrollbar, a link) moved it. */
  const settle = () => {
    if (raf) return;
    current = target = root.scrollTop;
    speed = 0;
    at = nearest(current);
    nudge = current - points()[at]!;
  };
  const step = (by: number) => {
    settle();
    at = Math.min(Math.max(0, at + by), points().length - 1);
    nudge = 0;
    go();
  };

  const onWheel = (e: WheelEvent) => {
    // leave pinch-zoom (ctrl) and sideways scrolls to the browser
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    const surge = Math.abs(d) > KICK && Math.abs(d) > lastSize * SURGE && now - began > SURGE_AFTER;
    if (now - last > GESTURE_GAP || surge) {
      settle();
      wheel = 0;
      moved = false;
      began = now;
    }
    last = now;
    lastSize = Math.abs(d);
    wheel += d;
    // one move on to a scroll, straight away, even mid-glide (it goes on from where that glide is headed)
    if (!moved && Math.abs(wheel) > KICK) {
      moved = true;
      step(Math.sign(wheel));
      return;
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
