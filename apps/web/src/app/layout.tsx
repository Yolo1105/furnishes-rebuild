import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Furnishes", template: "%s · Furnishes" },
  description: "Modular furniture you can see in your own home before you buy it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
