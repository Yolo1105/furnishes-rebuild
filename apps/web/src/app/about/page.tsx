import type { Metadata } from "next";
import { SiteFooter } from "@/shell/SiteFooter";
import { Workshop } from "./Workshop";

export const metadata: Metadata = { title: "About" };

/** About: for now the workshop band, then the footer. */
export default function About() {
  return (
    <>
      <main>
        <h1 className="visually-hidden">About Furnishes</h1>
        <Workshop />
      </main>
      <SiteFooter />
    </>
  );
}
