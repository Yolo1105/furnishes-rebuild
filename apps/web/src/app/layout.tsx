import type { Metadata } from "next";
import { Archivo, Instrument_Serif, Jost, Space_Mono } from "next/font/google";
import { SiteHeader } from "@/shell/SiteHeader";
import { INTRO_SCRIPT } from "./studio/intro";
import "./globals.css";

// The site's face, as a variable font so any weight between its named ones can be used.
const jost = Jost({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jost",
  display: "swap",
});

// The landing title's face: a narrow serif, for display sizes only (it comes in one weight).
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

// The studio's words: the old landing's grotesque (variable, with its width, for the wide title),
// and its italic for the collection's half-slanted headings.
const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// The studio's small capitals and the footer's name: the old landing's mono, in its two weights.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jost.variable} ${instrumentSerif.variable} ${archivo.variable} ${spaceMono.variable}`}>
      <head>
        {/* before anything is painted, the studio marks whether its arrival plays (studio/intro.ts);
            here, not in the studio's page, so it is only ever server HTML and React never builds it */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
