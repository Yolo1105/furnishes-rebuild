import type { Metadata } from "next";
// the tokens and base rules first, so every module's own rules cascade over them
import "./globals.css";
import { Archivo, Jost, Space_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/shell/SiteHeader";
import { INTRO_SCRIPT } from "./studio/intro";

// The wordmark's face, and nothing else's.
const jost = Jost({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jost",
  display: "swap",
});

// Every word on the site: the old landing's grotesque, variable, with its width axis (set narrow
// for the words, wide for the photo label).
const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// The small capitals: the old landing's mono, in its one weight.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Ready-made and customizable furniture for Singapore homes and small offices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jost.variable} ${archivo.variable} ${spaceMono.variable}`}>
      <head>
        {/* before anything is painted, the studio marks whether its arrival plays (studio/intro.ts);
            here, not in the studio's page, so it is only ever server HTML and React never builds it */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
