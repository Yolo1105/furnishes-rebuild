import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/features/auth/demo-account";
import { DemoSessionProvider } from "@/features/auth/demo-session";
import "./globals.css";

// The same two faces as the live site (furnishes_prod).
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
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
  // The loader's inline script marks <html> before React hydrates (so a
  // returning visitor never sees it flash); that one attribute is expected.
  return (
    <html lang="en" className={`${archivo.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body>
        <DemoSessionProvider initial={demo}>{children}</DemoSessionProvider>
      </body>
    </html>
  );
}
