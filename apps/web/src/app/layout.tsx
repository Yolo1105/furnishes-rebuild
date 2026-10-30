import type { Metadata } from "next";
import { Archivo, Instrument_Serif, Jost, Outfit } from "next/font/google";
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

// The bar's links: a clean geometric sans, at the one weight they use.
const outfit = Outfit({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-outfit",
  display: "swap",
});

// The words over the studio photos: a grotesque, set stretched wide (variable, with its width).
const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${instrumentSerif.variable} ${outfit.variable} ${archivo.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
