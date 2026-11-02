// Screenshots of the main routes at desktop (fold, 40 %, 80 %) and phone (fold, 50 %), into shots/.
// Run against a dev or production server: BASE_URL=http://localhost:3111 node scripts/shots.mjs
import { mkdirSync } from "node:fs";
import { BASE, launch } from "./browser.mjs";

const ROUTES = ["/", "/collection", "/products", "/about", "/contact", "/studio"];
const VIEWS = [
  { name: "desktop", width: 1440, height: 900, at: [0, 0.4, 0.8] },
  { name: "phone", width: 390, height: 844, at: [0, 0.5] },
];

mkdirSync("shots", { recursive: true });
const browser = await launch();
for (const view of VIEWS) {
  const page = await browser.newPage({ viewport: { width: view.width, height: view.height }, reducedMotion: "reduce" });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    for (const at of view.at) {
      await page.evaluate((f) => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), at);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `shots/${slug}-${view.name}-${Math.round(at * 100)}.png` });
    }
  }
  await page.close();
}
await browser.close();
console.log("saved to shots/");
