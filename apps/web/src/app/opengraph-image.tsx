import { ImageResponse } from "next/og";

// The share card's colours are the site's tokens (globals.css :root), written out because the card is drawn outside the page.
const PAPER = "#fffaf3";
const INK = "#2b1a10";
const INK_2 = "#7a4a33";
const ACCENT = "#e7551a";

export const alt = "furnishes. Furniture cut to fit the way you live.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card a shared link shows: the wordmark, its orange full stop, and the one line under it, on paper. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: PAPER,
          color: INK,
        }}
      >
        <div style={{ display: "flex", fontSize: 144, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>
          <span>furnishes</span>
          <span style={{ color: ACCENT }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 44, color: INK_2 }}>Furniture cut to fit the way you live.</div>
      </div>
    ),
    size,
  );
}
