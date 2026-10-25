/**
 * Scrolling the walk a section at a time, with weight. `sections` gives the
 * page's resting places (px of scroll, in order).
 *
 * The page rides a spring, so it always moves with some lag and eases into
 * where it is headed. While the wheel turns, the page follows it, but held
 * back: it moves less than the wheel and trails it. Once a scroll has turned
 * the wheel far enough to mean it, the page breaks loose and glides on to
 * the next section, carrying the speed it had; the rest of that scroll (a
 * trackpad's trailing momentum) is ignored, so it lands clean. A small
 * scroll that never means it only shifts the page a little within its
 * section. Keys and swipes move on a section too. Off under
 * prefers-reduced-motion. Returns a function that takes it off.
 */

/** How stiff the spring is while it follows the wheel, and while it glides to a section, 1/s. */
const FOLLOW = 9;
const GLIDE = 4.6;
/** How far the page moves for each px of wheel while it follows it. */
const RESIST = 0.45;
/** How much wheel in one scroll means moving on a section, px. */
const MEANT = 90;
/** How far a small scroll may shift the page off its section, px. */
const SHIFT_MAX = 80;
/** A pause this long between wheel events ends one scroll, ms. */
const GESTURE_GAP = 180;
/**
 * A trackpad's fling trails off over a second or more; a new swipe during it
 * shows as the wheel suddenly turning this many times harder, and is a new
 * scroll (once the last has run this long, ms).
 */
const SURGE = 2;
const SURGE_AFTER = 120;

export function dampScroll(sections: () => number[]) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const root = document.scrollingElement ?? document.documentElement;
  const max = () => root.scrollHeight - window.innerHeight;
  let current = root.scrollTop;
  let target = current;
  let speed = 0; // px/s
  let stiff = GLIDE;
  let then = 0; // the last frame's time
  let raf = 0;
  let at = 0; // the section the page rests at, or is gliding to
  let shift = 0; // how far a small scroll has moved the page off it
  let last = -Infinity; // when the wheel last turned
  let began = -Infinity; // when this scroll began
  let lastSize = 0; // how hard the wheel last turned
  let wheel = 0; // how much wheel in this scroll
  let done = false; // whether this scroll has already moved on a section

  const points = () => sections().map((p) => Math.min(Math.max(0, p), max()));
  const nearest = (y: number) => {
    const ps = points();
    return ps.reduce((best, p, i) => (Math.abs(p - y) < Math.abs(ps[best]! - y) ? i : best), 0);
  };

  const frame = (now: number) => {
    const dt = Math.min(1 / 30, (now - then) / 1000 || 1 / 60);
    then = now;
    // pulled toward the target, held back by its own speed: no overshoot
    speed += (stiff * stiff * (target - current) - 2 * stiff * speed) * dt;
    current += speed * dt;
    if (Math.abs(target - current) < 0.5 && Math.abs(speed) < 20) [current, speed] = [target, 0];
    window.scrollTo({ top: current, behavior: "instant" });
    raf = current === target ? 0 : requestAnimationFrame(frame);
  };
  const aim = (y: number, k: number) => {
    target = Math.min(Math.max(0, y), max());
    stiff = k;
    if (!raf) {
      then = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  /** Pick up from wherever the page is, if something else (the scrollbar, a link) moved it. */
  const settle = () => {
    if (raf) return;
    current = target = root.scrollTop;
    speed = 0;
    at = nearest(current);
    shift = current - points()[at]!;
  };
  const step = (by: number) => {
    settle();
    at = Math.min(Math.max(0, at + by), points().length - 1);
    shift = 0;
    aim(points()[at]!, GLIDE);
  };

  const onWheel = (e: WheelEvent) => {
    // leave pinch-zoom (ctrl) and sideways scrolls to the browser
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    e.preventDefault();
    const now = performance.now();
    const d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    const surge = Math.abs(d) > 24 && Math.abs(d) > lastSize * SURGE && now - began > SURGE_AFTER;
    if (now - last > GESTURE_GAP || surge) {
      settle();
      wheel = 0;
      done = false;
      began = now;
    }
    last = now;
    lastSize = Math.abs(d);
    if (done) return; // the rest of a scroll that has moved on: let the glide land
    wheel += d;
    if (Math.abs(wheel) >= MEANT) {
      done = true;
      step(Math.sign(wheel));
      return;
    }
    // not yet meant: the page follows the wheel, held back
    shift = Math.min(SHIFT_MAX, Math.max(-SHIFT_MAX, shift + d * RESIST));
    aim(points()[at]! + shift, FOLLOW);
  };

  const KEYS: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
  const onKey = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    if (e.altKey || e.ctrlKey || e.metaKey || el?.closest("input, textarea, select, [contenteditable]")) return;
    let by = KEYS[e.key];
    if (e.key === "Home") by = -1e3;
    if (e.key === "End") by = 1e3;
    if (by === undefined) return;
    e.preventDefault();
    step(e.key === " " && e.shiftKey ? -1 : by);
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
