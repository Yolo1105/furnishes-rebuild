import type { Metadata } from "next";
import { Inter_Tight, Jost } from "next/font/google";
import { SiteHeader } from "@/shell/SiteHeader";
import "./globals.css";

// The site's face, as a variable font so any weight between its named ones can be used.
const jost = Jost({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jost",
  display: "swap",
});

// The landing title's face: a tight grotesque, for display sizes only.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jost.variable} ${interTight.variable}`}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
