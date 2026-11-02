// The UI audit (refactor spec §12.2, §24, §26): measures every route against the design system's
// limits and exits non-zero on any violation. Run against a server on BASE_URL (default :3111).
import { BASE, launch } from "./browser.mjs";

/** Routes measured in full at 1440 × 900; the landing has its own tighter limits. */
const MEASURED = ["/", "/collection", "/products", "/about"];
/** Every route: one h1, no placeholder text, no link to /sign-in, phone checks. */
const ROUTES = [
  ...MEASURED,
  "/products/entry",
  "/inspiration",
  "/contact",
  "/quiz",
  "/help",
  "/how-it-works",
  "/why-modular",
  "/buying-guide",
  "/room-dividers",
  "/hdb-homes",
  "/workspaces",
  "/studio",
  "/terms",
  "/privacy-policy",
  "/refund-policy",
  "/no-such-page",
];

const failures = [];
const fail = (route, msg) => failures.push(`${route}: ${msg}`);

/** Everything the desktop audit reads off a page, in the browser. */
function measure() {
  const main = document.querySelector("main");
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !el.closest(".visually-hidden");
  };
  // (drawings' labels are sized in the drawing's own units, not the type scale)
  const texty = [...document.body.querySelectorAll("*")].filter(
    (el) => visible(el) && !el.closest("svg") && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()),
  );
  const families = new Set(texty.map((el) => getComputedStyle(el).fontFamily.split(",")[0].replaceAll('"', "").trim()));
  const sizes = new Set(texty.map((el) => getComputedStyle(el).fontSize));
  const weights = new Set(texty.map((el) => getComputedStyle(el).fontWeight));
  const buttons = new Set(
    [...document.querySelectorAll("main .btn-primary, main .btn-secondary, main .btn-link, footer .btn-link")].filter(visible).map((el) => {
      const s = getComputedStyle(el);
      const h = el.classList.contains("btn-link") ? "link" : `${Math.round(el.getBoundingClientRect().height)}`;
      return [s.fontFamily.split(",")[0], s.fontSize, s.textTransform, s.borderRadius, h].join(" | ");
    }),
  );
  let maxLine = 0;
  for (const p of main?.querySelectorAll("p") ?? []) {
    if (!visible(p)) continue;
    const lh = parseFloat(getComputedStyle(p).lineHeight) || parseFloat(getComputedStyle(p).fontSize) * 1.5;
    const lines = Math.max(1, Math.round(p.getBoundingClientRect().height / lh));
    if (lines < 2) continue; // a one-line p tells nothing about the measure
    maxLine = Math.max(maxLine, Math.round(p.innerText.length / lines));
  }
  return {
    screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(2),
    height: document.documentElement.scrollHeight,
    sections: main ? main.querySelectorAll("section").length : 0,
    words: main ? main.innerText.split(/\s+/).filter(Boolean).length : 0,
    families: [...families],
    sizes: sizes.size,
    weights: [...weights],
    buttons: [...buttons],
    maxLine,
  };
}

/** The checks every route gets, in the browser. */
function basics() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest(".visually-hidden");
  };
  return {
    h1: [...document.querySelectorAll("h1")].filter(visible).length,
    placeholder: /\[(Placeholder|PLACEHOLDER)[^\]]*\]/.test(document.body.innerText),
    deadCopy: (document.body.innerText.match(/coming soon|example order|example low|details to come|sign in to|isn't connected/gi) ?? []).join(", "),
    signIn: [...document.querySelectorAll("a[href]")].some((a) => new URL(a.href).pathname.startsWith("/sign-in")),
  };
}

/** At phone width: hit areas under 40 px (inline links in running text excepted) and text under 12 px. */
function phone() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest(".visually-hidden, [aria-hidden='true']");
  };
  const small = [...document.querySelectorAll("a[href], button, summary, input, select, textarea, [role='button']")]
    .filter(visible)
    // inline links in running text are exempt (WCAG 2.5.8), as is a card's title link, whose hit area is the whole card,
    // and the plan's rooms, which the planner also lists as buttons
    .filter((el) => !(el.tagName === "A" && el.closest("p") && !el.matches("[class*='btn']")))
    .filter((el) => !el.matches(".card-title a") && !el.closest("svg"))
    // a radio or checkbox inside its label: the label is the target
    .filter((el) => !(el.matches("input[type=radio], input[type=checkbox]") && el.closest("label")?.getBoundingClientRect().height >= 40))
    // a word-long text link is narrow by nature: its height is the finger's target; anything without text needs both
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height < 40 || (!el.innerText?.trim() && r.width < 40);
    })
    .map((el) => `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(" ")[0] : ""} "${(el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 24)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`);
  const tiny = [...document.body.querySelectorAll("*")]
    .filter((el) => visible(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
    .filter((el) => el.closest("svg") === null && parseFloat(getComputedStyle(el).fontSize) < 12).length;
  return { small, tiny, height: document.documentElement.scrollHeight };
}

const browser = await launch();
const desk = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rows = [];

for (const route of ROUTES) {
  const res = await desk.goto(BASE + route, { waitUntil: "networkidle" });
  if (route !== "/no-such-page" && res?.status() !== 200) fail(route, `status ${res?.status()}`);
  const b = await desk.evaluate(basics);
  if (b.h1 !== 1) fail(route, `${b.h1} visible h1`);
  if (b.placeholder) fail(route, "renders [Placeholder…] text");
  if (b.deadCopy) fail(route, `dead-end copy: ${b.deadCopy}`);
  if (b.signIn) fail(route, "links to /sign-in");

  if (MEASURED.includes(route)) {
    const m = await desk.evaluate(measure);
    rows.push({ route, ...m, families: m.families.join(" / "), weights: m.weights.join(","), buttons: m.buttons.length });
    if (route === "/") {
      if (m.screens > 8) fail(route, `${m.screens} screens (≤ 8)`);
      if (m.sections !== 7) fail(route, `${m.sections} sections (= 7)`);
      if (m.words > 1000) fail(route, `${m.words} words (≤ 1000)`);
    }
    if (!m.families.every((f) => /archivo|space.?mono/i.test(f))) fail(route, `font families ${m.families.join(", ")}`);
    if (m.sizes > 10) fail(route, `${m.sizes} font sizes (≤ 10)`);
    if (!m.weights.every((w) => ["400", "500", "600"].includes(w))) fail(route, `font weights ${m.weights.join(", ")}`);
    if (m.buttons.length > 3) fail(route, `${m.buttons.length} button styles (≤ 3): ${m.buttons.join(" ; ")}`);
    if (m.maxLine > 78) fail(route, `${m.maxLine} characters per line (≤ 78)`);
  }

  if (route === "/products/entry") {
    const h = await desk.evaluate(() => document.documentElement.scrollHeight);
    if (h > 3600) fail(route, `${h}px tall (≤ 3600)`);
    const first = desk.locator("main .btn-primary").first();
    const cta = (await first.count()) ? await first.innerText() : "(none)";
    if (cta.trim() !== "Enquire to order") fail(route, `first primary button is "${cta}"`);
  }
}

// the contact form, sent through the route handler
await desk.goto(`${BASE}/contact?topic=product&piece=entry`, { waitUntil: "networkidle" });
try {
  await desk.locator("#enquiry-name").fill("Audit Test");
  await desk.locator("#enquiry-email").fill("audit@example.com");
  await desk.locator("#enquiry-message").fill("Checking the enquiry form end to end.");
  await desk.locator("main form .btn-primary").click();
  await desk.getByText(/thanks/i).first().waitFor({ timeout: 8000 });
} catch (e) {
  fail("/contact", `form did not reach its success state (${e.message.split("\n")[0]})`);
}

// the quiz: four screens, Next always in view
await desk.goto(`${BASE}/quiz`, { waitUntil: "networkidle" });
let screens = 0;
for (let i = 0; i < 6; i++) {
  const next = desk.locator("main .btn-primary").first();
  if (!(await next.count())) break;
  const box = await next.boundingBox();
  if (!box || box.y + box.height > 900) fail("/quiz", `Next out of view on screen ${i + 1}`);
  const option = desk.locator("main input[type=radio]").first();
  if (!(await option.count())) break;
  screens++;
  await option.check({ force: true });
  await next.click();
  await desk.waitForTimeout(150);
}
if (screens !== 4) fail("/quiz", `${screens} question screens (= 4)`);

const icon = await desk.request.get(`${BASE}/icon.svg`);
if (icon.status() !== 200) fail("/icon.svg", `status ${icon.status()}`);

// phones
const phonePage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
for (const route of ROUTES) {
  await phonePage.goto(BASE + route, { waitUntil: "networkidle" });
  const p = await phonePage.evaluate(phone);
  if (p.small.length) fail(route, `390px: ${p.small.length} hit areas under 40px: ${p.small.slice(0, 6).join("; ")}`);
  if (p.tiny) fail(route, `390px: ${p.tiny} text elements under 12px`);
  if (route === "/" && p.height > 9000) fail(route, `390px: ${p.height}px tall (≤ 9000)`);
}
await phonePage.setViewportSize({ width: 320, height: 700 });
for (const route of ROUTES) {
  await phonePage.goto(BASE + route, { waitUntil: "networkidle" });
  const w = await phonePage.evaluate(() => document.documentElement.scrollWidth);
  if (w !== 320) fail(route, `320px: scrollWidth ${w}`);
}

await browser.close();
console.table(rows);
if (failures.length) {
  console.log(`\n${failures.length} violation${failures.length === 1 ? "" : "s"}:`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exitCode = 1;
} else {
  console.log("\nall checks pass");
}
