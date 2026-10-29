import type { Metadata } from "next";
import { Instrument_Serif, Jost } from "next/font/google";
import { SiteHeader } from "@/shell/SiteHeader";
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

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${instrumentSerif.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
