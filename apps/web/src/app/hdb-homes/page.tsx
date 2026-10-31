import type { Metadata } from "next";
import { PiecesFor } from "@/features/products/PiecesFor";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "HDB homes", description: "Furniture for HDB flats in Singapore: what to measure, what to check and which pieces suit." };

/** HDB homes: common problems room by room, getting a piece in, and pieces that suit. */
export default function HdbHomes() {
  return (
    <TextPage
      label="HDB homes"
      title="Furniture for how an HDB flat is really used."
      lede="Small changes for the corners that keep getting in the way, delivered in Singapore."
      sections={[
        {
          heading: "Common problems",
          points: [
            "By the door: bags, shoes and keys pile up with nowhere to go.",
            "In the bedroom: a phone and book end up on the floor beside the bed.",
            "In a second bedroom: it has to be a study, a guest room and a store.",
            "In the kitchen: there's never one more surface when you cook.",
            "In the living room: cables and boxes gather under the TV.",
          ],
          body: [],
        },
        {
          heading: "Getting it in",
          body: [
            "Before you order, measure the lift, your door and any tight corners on the way to the spot. If the way in is tight, choose flat-packed. Its largest box is smaller than the finished piece.",
          ],
          link: { label: "How to measure", href: `${routes.help}#measuring` },
        },
        {
          heading: "Rules",
          body: [`Check HDB's rules before you drill or change anything fixed. ${shown("hdbRules")}`],
        },
      ]}
      calls={[
        { label: "See the collection", href: routes.collection },
        { label: "Take the quiz", href: routes.quiz },
        { label: "Book a visit", href: contactHref("visit") },
      ]}
    >
      <PiecesFor title="Pieces that suit HDB homes" ids={["entry", "bedside", "desk", "kitchen", "low-cabinet", "divider"]} />
    </TextPage>
  );
}
