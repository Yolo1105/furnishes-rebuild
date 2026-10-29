import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { SiteHeader } from "@/shell/SiteHeader";
import "./globals.css";

// The site's one face: Light for the title, Regular for the bar, Medium for the wordmark.
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
