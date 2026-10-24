# furnishes-rebuild

The Furnishes website, rebuilt. A pnpm workspace with one Next.js app in `apps/web`.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm typecheck
pnpm build
```

Needs Node 24 and pnpm 9.

## Layout of `apps/web/src`

```
app/
  layout.tsx            fonts, metadata, the demo sign-in read from its cookie
  globals.css           design tokens: every colour, size, space and timing
  (site)/layout.tsx     every public page: the bar, then the page
  (site)/page.tsx       landing
  (site)/sign-in/       sign-in (UI only, plus a demo account)
shell/                  the bar: SiteHeader, HeaderShell, CartLink, AccountLink
features/stage/         the moving orange-to-cream background (Stage, LivingGradient, wash)
features/auth/          sign-in panel and the demo session
lib/routes.ts           every address the site links to
```

Component styles use only the tokens in `globals.css`. The wash's colours live
once, in `features/stage/wash.ts`, and feed both the CSS fallback and the shader.

Accounts are not switched on yet: the sign-in buttons say so, and "Try the demo
account" signs in as a demo kept in a cookie in this browser.
