// Launches Chromium for the audit and screenshot scripts: Playwright's own build if it is installed,
// otherwise the newest headless shell already in Playwright's cache (or PW_CHROMIUM).
import { readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

export const BASE = process.env.BASE_URL ?? "http://localhost:3111";

function cachedShell() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM;
  const cache = join(homedir(), "Library/Caches/ms-playwright");
  const dirs = readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort();
  const dir = dirs.at(-1);
  return dir && join(cache, dir, "chrome-headless-shell-mac-arm64/chrome-headless-shell");
}

export async function launch() {
  try {
    return await chromium.launch();
  } catch {
    return chromium.launch({ executablePath: cachedShell() });
  }
}
