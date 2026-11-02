# Furnishes UI/UX professionalisation refactor — report

Branch `ui/professional-refactor`, cut from `empty` at `ae7d320` (the uncommitted collection work was committed first as `038b003`, so nothing was lost). Spec: `CLAUDE_CODE_PROMPT_furnishes_redesign.md`.

Re-run everything from `apps/web` against a production server (`pnpm build && pnpm start -p 3111`):

- `bash scripts/check-ui.sh` — the §12.1 + §24 static checks
- `pnpm audit:ui` — the §12.2 / §24 / §26 DOM audit, exits non-zero on any violation
- `pnpm shots` — §12.3 screenshots into `shots/` (git-ignored)

## 1. Before / after (table 1.1, landing at 1440 × 900)

| Metric | Before | After |
|---|---|---|
| Page height | 46,916 px = 52 screens | 7,100 px = **7.9 screens** (6.7 with reduced motion, which unpins the plan) |
| `<section>` in `<main>` | 29 | **7** |
| `<h2>` / `<h3>` | 30 / 86 | **6 / 10** (plus the h1) |
| Words in `<main>` | 5,682 | **431** |
| Pinned scroll track | 13 screens, above the fold, fading text | **1 pinned screen** (200svh track), below the hero, no text fading; static on ≤1023 px and reduced motion |
| Font families on text | 4 | **2** (Archivo + Space Mono) |
| Distinct computed font sizes | 18 | **7** on `/`, `/collection`, `/products`, `/about` |
| Button style variants | 9 | **3** (primary, secondary, link; chips are the secondary button at 36 px) |
| `grid-template-columns` recipes | 56 | **5** |
| Section `padding-top` variants | 16 | **1** (`--section`; two paper sections in a row share one gap) |
| `gap` variants | 20 | **9** token values (`--s-1…--s-8`, `--gap`), plus two fixed 24/32 values in `--gap`'s own definition. The spec's ≤ 6 isn't met: the 8-step spacing scale it defines already gives more than 6 |
| Text `max-width` variants | 8, in 4 units | **2** (`--measure` 65ch, `--measure-wide` 75ch) |
| Media-query breakpoints | 13 | **3** (`max 1023`, `max 639`, `min 1280` in globals) |
| Text-colour tokens | 9 | **4** (`--ink`, `--ink-2`, `--on-dark`, `--accent` on hover/focus only) |
| Font weights | 300–500, 95 % at 340 | **400 / 500 / 600** |
| Longest body measure | 115 characters | **66** (max per line, any page measured) |
| Image aspect ratios | 5 kinds incl. free-height collage | **4:5** cards, **16:9** bands, **1:1** thumbs |

Other measured results:

- **Contrast:** axe (WCAG 2 A/AA) finds **0 violations** on `/`, `/products`, `/contact`, `/collection`, `/products/entry`, `/about`, `/studio`, `/quiz`, `/inspiration` and `/help`.
- **Product page:** `/products/entry` is **3,565 px** tall at 1440 (audit limit 3,600; the spec's target is 3,500, and 658 px of the height is the footer).
- **Landing on phones:** **8,4xx px** at 390 px, under the 9,000 limit.
- **Overflow:** none at 320 px on any route.

## 2. Static checks (§12.1 + §24), last run

```
## 1. off-scale type outside globals          → (none)
## 2. grid-template-columns recipes           → 5
     1fr auto · auto 1fr auto · minmax(0, 1fr) · repeat(12, minmax(0, 1fr)) · repeat(3, minmax(0, 1fr))
## 3. media queries                           → max-width 1023px, max-width 639px, min-width 1280px, prefers-reduced-motion (both)
## 4. raw colours outside globals             → (none)
## 5. tokens defined but unused               → (none)
      used but undefined in globals           → --at --chars --plan-at --plan-draw --plan-ease (FloorPlan's own draw-timing
                                                 properties, set in FloorPlan.tsx/.module.css) and --font-archivo --font-space-mono
                                                 (set by next/font on <html>)
## 6. placeholder copy in components          → (none)
## 7. Jost / Raleway                          → (none)
## 8. pnpm typecheck && pnpm build            → pass
## 9. dead-end CTAs                           → (none)
## 10. mailto                                 → the "Prefer to write?" line, plus the footer's address link (a contact detail, not a submission)
## 11. fill images with sizes                 → 16 / 16
## 12. metadata                               → src/app/icon.svg, src/app/opengraph-image.tsx, openGraph set in layout.tsx
```

`grep -rl Placeholder .next/server/app --include="*.html"` → empty. `pnpm check:facts` behaves as before: it lists 42 facts and exits 1.

## 3. DOM audit (§12.2), last run — all checks pass

| route | screens | height | sections | words | families | sizes | weights | button styles | max chars/line |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 6.71* | 6035* | 7 | 431 | Archivo / Space Mono | 7 | 400, 500, 600 | 3 | 54 |
| `/collection` | 17.61 | 15853 | 19 | 1900 | Archivo / Space Mono | 7 | 400, 500, 600 | 3 | 66 |
| `/products` | 7.59 | 6833 | 6 | 666 | Archivo / Space Mono | 7 | 400, 500 | 3 | 59 |
| `/about` | 6.04 | 5436 | 7 | 497 | Archivo / Space Mono | 7 | 400, 500, 600 | 3 | 55 |

\* The audit runs with reduced motion, so the plan is unpinned. With motion, the landing is 7.89 screens.

On all 20 routes the audit also checks:

- exactly one visible h1;
- no `[Placeholder…]` text, no dead-end copy and no `/sign-in` links;
- at 390 px, no hit area under 40 px and no text under 12 px;
- at 320 px, no horizontal overflow;
- the contact form reaches its success state through `/api/enquiry`;
- the quiz has 4 question screens, with Next in view on each;
- `/icon.svg` returns 200.

What the audit exempts, and why:

- inline links inside a paragraph (WCAG 2.5.8 excepts them);
- card-title links, because the whole card is the target;
- the floor plan's room regions on `/studio`, which are also offered as buttons;
- a radio inside a label that is at least 40 px tall.

## 4. Deviations from the spec, and why

- **Primary button fill:** it is `--accent` deepened 15 % (`color-mix(… 85%, black)`). White on the pure accent `#e7551a` is 3.7:1, which fails §12.4's "zero contrast violations". The deepened fill is 4.9:1. `--accent` itself is unchanged and is still used for focus rings, hover and selected states.
- **Header button on phones:** below 640 px it reads "Design" ("your room" is hidden), so the bar fits at 320 px (§10).
- **`/studio`:**
  - Its spec said "Sign in to start", which contradicts §15. It is now a working planner that needs no sign-in: pick a room and one of the 3 orderable pieces, and the piece is drawn at its real size. Front and side elevations sit beside it, and "Ask us to check it fits" goes to the contact form.
  - The 3D walk took option A: `features/walk` and the `three` / `@types/three` packages are removed. No route ships a three.js chunk.
- **Shop-by-problem tiles:**
  - There are 4 tiles, not 5. "In an office" is folded into "At the desk", one of the two options §6.2 allows.
  - They stay two-up on phones through a new `.sm:span-6`, because §10 asks for that and the spec's `md:span-6` collapses below 639 px.
- **Grid classes:**
  - `.span-*` sets only `grid-column-end`. With the spec's literal `grid-column: span N`, `.span-5.start-8` collapsed to one column.
  - Added `.span-7` and `.span-5`, which §7 and §16 use.
  - Added `.subgrid`: the 12 columns nested inside a span, without the outer padding.
- **Globals added beyond §2.2:**
  - `.actions` (a button row that stacks below 640 px), `.h2-sm` (inner-page h2 at `--text-2xl`) and `.ruled` (a list with a rule per item).
  - `.media-portrait` and `.media-square`, the 4:5 and 1:1 frames.
  - `.chips` / `.chip` and `.disclosure`: these were each defined twice in page modules, so they now live in globals once.
  - `strong` is set to weight 600, because the browser's 700 broke the weight rule.
  - `scroll-padding-top` on `html`, so anchors land clear of the sticky header.
  - `.btn-link` and `.chip` are 44 px tall below 640 px (§26 rule 17).
- **The landing's hero image:** a render of our entry piece (`render-entry.webp`), not the stock living room, per §19.
- **The landing's 16:9 band:** a render of our bookwall (`render-bookwall.webp`). The bookwall isn't orderable yet, but the band has no text or price, so it makes no product claim.
- **`/collection` h1:** "Find the piece that fits." so it doesn't repeat the landing's h1. The hero is our desk render, with pins on our own piece; the stock photo and its stock-object pins are gone (§30).
- **`/products`:** the three-kinds comparison (from `studio/Compare`) sits after the product grid, not before it, so the pieces stay on the first screen.
- **Kit tier label:** "Coming later" now reads "After testing" in `catalogue.ts` `KIT_TIER`. This is display copy, not a fact.
- **`/room`:** a noindex stock-photo route the spec doesn't mention. It is kept with compliant CSS, and nothing links to it.

## 5. Deleted files (101 files under `apps/web/src`, plus the `three` dependency)

- **`app/home/`:** `page.tsx`, `home.module.css`. The landing is now `app/page.tsx`.
- **`app/sign-in/page.tsx`**
- **`app/photos.ts`**
- **`shell/`:** `PeachBackdrop.tsx` (+ css), `TextPage.module.css`
- **`features/walk/`:** all of it: `WalkView`, `scene`, `rig`, `flat`, `order`, `finishes`, `solid`, `symbols`, `ease`, and the css.
- **`features/products/`:** `ProductCard.module.css`, `ProductGrid.module.css`, `PiecesFor.module.css`
- **`app/studio/`:**
  - Components: `AfterYouBuy`, `AiHelps`, `ArrowLink`, `BeforeAfter`, `BeforeYouOrder`, `BuildIt`, `CaseSheets`, `CloserLook`, `Compare`, `Customize`, `DesignYourRoom`, `Details.module.css`, `Dimension`, `Furniture`, `FurnitureWord`, `HowToBuy`, `KeepWhatYouHave`, `Manifesto`, `NotNoticed`, `NotSure`, `OnThisPage`, `OrderCard`, `OtherUses`, `Packages`, `Partners`, `Questions`, `RoomPhotos`, `Ruler`, `SoundFamiliar`, `StartProject`, `Swatches`, `WhatItDoes`, `WhoFor`, `WhyModular`, `WorkWithUs`, and every one of their `.module.css` files.
  - Data and CSS: `cases.ts`, `faqs.ts`, `intro.ts`, `makerList.ts`, `packageList.ts`, `rooms.ts`, `swatchList.ts`, `whoWeAre.ts`, `page.module.css`.
  - `tour.ts` keeps only `ROOM_NOTES`.
  - `app/studio/` now holds `page.tsx`, `StudioView.tsx`, `studio.module.css` and `tour.ts`.
- **`app/about/`:** `Heritage`, `MakingDays`, `Projects`, `Team`, `WhoWeAre`, `Workshop`, `heritageCopy.ts`, `page.module.css`
- **`app/collection/`:** `Assurances.tsx`, `ConsultPhotos` (+ css)
- **`app/contact/`:** `AfterYouSend` (+ css), `LeadTimes` (+ css), `leadTimeList.ts`, `inquiryCopy.ts`, `page.module.css`
- **`app/inspiration/`:** `Ideas` (+ css)
- **`app/products/`:** `sections.module.css`

## 6. Content moved (from → to)

- **Old 29-section landing → new 7-section landing:** hero, shop by problem, three orderable pieces, the pinned plan, promises (FactGrid + band), not sure yet, final call.
- **`/why-modular`:** WhyModular, OtherUses, Customize, KeepWhatYouHave, Swatches.
  - The drawn swatch textures and the future-finishes list are dropped.
  - Finishes now point to "Ask for samples" and "Book a visit".
- **`/how-it-works`:** HowToBuy (the 4 steps), the three kinds of furniture, and LeadTimes (from `/contact`, as a FactGrid).
- **`/buying-guide`:** BeforeYouOrder (measure three things), what's in and not in an order, BuildIt, AfterYouBuy.
- **`/help`:** Questions (now grouped into three topics), NotSure, Packages (reduced to two real options, "A visit" and "Email").
  - AiHelps is dropped, because no AI assistant exists.
- **`/inspiration`:** CaseSheets + NotNoticed (8 case cards), BeforeAfter, Ideas + SoundFamiliar (problems by room), WhatItDoes (the answer you want), WhoFor + CloserLook (who it's for).
  - The sheets are a vertical list with the plan first. Each stock photo is captioned "Mood reference — not our furniture".
- **`/about`:** Heritage (our story), WorkWithUs, Partners (only their one real sentence is kept), and StartProject (the final dark band).
- **`/products`:** Compare (the three kinds of furniture) and Furniture (the ready-made intro).
- **`/studio`:** DesignYourRoom became the planner and a "From the plan to your room" steps section.
- **Dropped rather than invented:**
  - Partner maker cards (stand-in names on stock photos)
  - Recognition rows (placeholder award)
  - The "Bigger ideas" concept arrangements
  - The SoundFamiliar click-through explorer
  - 14 of the 31 problem lines
  - Sofa-back and work-cart case cards
  - The "pieces that follow" and Explore sections on `/collection` (duplicates of the Finder)
  - The product page's other uses, kits, "what you can change" and "how it arrives" (all still on `/collection`)

## 7. Functional changes (addenda)

- **Enquiry form:**
  - `/contact` is one screen, with labels, inline errors, an `aria-live` region and loading, error and success states.
  - It posts to `app/api/enquiry/route.ts`, which validates the fields with the same rules as the client (`contact/enquiry.ts`).
  - With `RESEND_API_KEY` set, it sends through Resend's HTTP API (`ENQUIRY_FROM` / `ENQUIRY_TO`, defaulting to the site email). Without it, it logs the enquiry and returns 200. No new npm dependency.
- **Product page:**
  - A sticky gallery with up to 5 thumbnails that swap the main image, and the elevation drawing as the last thumbnail.
  - A buy panel with "From S$…", "Enquire to order", "Ask a question" and "See it in a flat →".
  - A facts list, a Dimensions block, and Product JSON-LD.
- **Quiz:** four one-screen questions with a sticky bar and three ProductCard results. `match.ts` keeps its scoring.
- **Finder:** one row of room chips plus search. Orderable pieces come first, then "In production". There is a designed empty state, and the `?use=` / `?activity=` / `?width=` deep links still work.
- **Placeholder facts:**
  - `shown()` / `marked()` return `""` for placeholder facts, and the new `isReal()` / `isPlaceholder()` let call sites drop the sentences that rest on them.
  - The footer copyright is "© 2026 Furnishes Pte Ltd."
- **Metadata:** `icon.svg`, `apple-icon.png`, `opengraph-image.tsx` (text only; satori can't decode `.webp`), openGraph and twitter settings, Organization JSON-LD on `/`, and a sitemap without `/sign-in` or `/home`.
- **Navigation:** `aria-current` on the header links; the phone menu closes on route change and on Escape, and its summary carries `aria-expanded`.

## 8. Open questions for the owner (§23, §28)

1. **Photography:** we need photos or photoreal renders of the three orderable pieces in a real Singapore room. Every room photo on the site shows someone else's furniture, so stock photos only appear as captioned mood references.
2. **Proof:** customer quotes with first names and estates, or press. The landing shows only service promises until these exist.
3. **Orderable pieces:** the code treats `entry`, `desk` and `bedside` (`status: "launch"`) as orderable today. Please confirm, along with real lead times per piece.
4. **Email credentials:** `RESEND_API_KEY`, `ENQUIRY_FROM` and `ENQUIRY_TO` for `/api/enquiry`. The route hasn't sent a real email yet; only the no-key path (log and return 200) has been tested.
5. **AI assistant, dashboard, orders, 3D planner:** none exist, so every mention was removed. Two draft facts still mention them and need your wording:
   - `processors` mentions "the AI assistant" (it shows on `/privacy-policy`).
   - `paymentMethods` says "You pay by card at checkout" (it shows on `/buying-guide`), but there is no checkout; ordering is by enquiry.
6. **`pnpm check:facts`:** 42 items. The placeholders (company UEN and address, DPO contact, award, team, tested weight limits, stability guidance) now stay hidden until they're real. The drafts may ship as written once you confirm them.
7. **Legal copy:** the terms' "AI assistant" clause now reads "Our advice", and the privacy policy's "conversations with the AI assistant" now reads "your messages to us". Both are drafts and need your review.
8. **Collection hero pins:** the pins on the desk render were placed by eye. Please check them.
9. **First-load JS:** Next 16's build output doesn't print per-route sizes, so the "landing ≤ 150 kB" target (§27) isn't measured. three.js is gone from every route.
10. **Lighthouse:** LCP and CLS on throttled 4G (§21) weren't run.
11. **Image formats:** the remaining `.jpg` assets weren't converted to `.webp` (§21).
