import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import { SiteHeader } from "@/shell/SiteHeader";
import "./globals.css";

// The bar's face.
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
    <html lang="en" className={spaceMono.variable}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
