import type { Metadata } from "next";
import { Archivo, Jost, Space_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/features/auth/demo-account";
import { DemoSessionProvider } from "@/features/auth/demo-session";
import "./globals.css";

// The same two faces as the live site (furnishes_prod), and one for the landing title.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

// The landing title's face: Jost Light, finer than Archivo goes.
const jost = Jost({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-jost",
  display: "swap",
});

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read here so the page is sent already showing the demo state, if any.
  const demo = (await cookies()).get(DEMO_COOKIE)?.value === "1";
  // Browser extensions and the page's own scripts (the walk marks <html> as
  // its panel comes in) add attributes to <html>; React need not warn of them.
  return (
    <html lang="en" className={`${archivo.variable} ${jost.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body>
        <DemoSessionProvider initial={demo}>{children}</DemoSessionProvider>
      </body>
    </html>
  );
}
