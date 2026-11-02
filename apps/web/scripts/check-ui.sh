#!/usr/bin/env bash
# The refactor spec's static checks (§12.1 and §24), run from apps/web. Prints each check's output under its heading.
cd "$(dirname "$0")/.." || exit 1
tmp=$(mktemp -d)

echo "## 1. off-scale type outside globals (expect none)"
grep -rn "font-size\|font-weight\|letter-spacing\|line-height\|font-stretch" src --include=*.css | grep -v "globals.css" | grep -v "var(--"

echo "## 2. grid-template-columns recipes (expect <= 6)"
grep -rh "grid-template-columns" src --include=*.css | sed 's/^ *//' | sort -u
grep -rh "grid-template-columns" src --include=*.css | sed 's/^ *//' | sort -u | wc -l

echo "## 3. media queries (expect 1023px, 639px, min 1280px, prefers-reduced-motion)"
grep -rh "@media" src --include=*.css | sed 's/^ *//' | sort -u

echo "## 4. raw colours outside globals (expect none)"
grep -rn "#[0-9a-fA-F]\{3,8\}\b" src --include=*.css | grep -v "src/app/globals.css"

echo "## 5. tokens: defined but unused, then used but undefined (component-local custom properties expected in the second list)"
grep -rhoe "var(--[a-z0-9-]*)" src | sed 's/var(\(.*\))/\1/' | sort -u > "$tmp/used"
grep -oe "^\s*--[a-z0-9-]*" src/app/globals.css | sed 's/^[[:space:]]*//' | sort -u > "$tmp/defined"
echo "- defined, unused:"; comm -13 "$tmp/used" "$tmp/defined"
echo "- used, undefined in globals:"; comm -23 "$tmp/used" "$tmp/defined"

echo "## 6. placeholder copy in components (expect none)"
grep -rn "Coming soon\|COMING SOON\|Example order\|Example low\|Details to come\|Concept\." src --include=*.ts --include=*.tsx | grep -v "facts.ts\|catalogue.ts"

echo "## 7. retired fonts (expect none)"
grep -rn "Jost\|Raleway" src

echo "## 9. dead-end CTAs (expect none)"
grep -rn "Sign in to\|sign in to\|once you sign in\|isn't connected" src --include=*.tsx --include=*.ts

echo "## 10. mailto submission (expect only the 'Prefer to write' line and the footer/contact address links)"
grep -rn "mailto:" src --include=*.tsx | grep -v "Prefer to write"

echo "## 11. fill images with sizes (the two counts should match)"
grep -rn "<Image" -A6 src --include=*.tsx | grep -B6 "fill" | grep -c "sizes="
grep -rn "<Image" -A6 src --include=*.tsx | grep -c "^\S*-\s*fill$\|\sfill\s\|\sfill$"

echo "## 12. metadata"
ls src/app/icon.* src/app/opengraph-image.* 2>&1; grep -n "openGraph" src/app/layout.tsx

rm -rf "$tmp"
