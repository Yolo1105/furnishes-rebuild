import type { Metadata } from "next";
// the tokens and base rules first, so every module's own rules cascade over them
import "./globals.css";
import { Archivo, Space_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/shell/SiteHeader";

// Every word on the site, variable with its width axis: wide for reading, narrow for h1 and h2.
const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Eyebrows, dimensions, record numbers and prices in tables.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Ready-made and modular furniture for Singapore homes and small offices.",
  openGraph: { type: "website", siteName: "Furnishes", locale: "en_SG" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`}>
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
