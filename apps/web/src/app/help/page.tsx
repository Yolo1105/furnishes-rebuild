import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Help", description: "Measuring, ordering, delivery, assembly, returns and safety for Furnishes furniture." };

/** The answers people need before and after buying, topic by topic, starting with how to measure. */
export default function Help() {
  return (
    <TextPage
      label="Help"
      title="What to know before and after you buy."
      lede={`Can't find it here? Write to ${EMAIL}, and we reply within ${shown("replyTime")}.`}
      jump
      sections={[
        {
          heading: "Measuring",
          body: ["Measure three things before you order. Product pages show each piece's width, height and depth."],
          points: [
            "The spot: width, depth and height where it will stand. Measure above skirting boards, and leave room for doors and drawers to open.",
            "The way in: the lift, the doors and any corners, for the piece or its largest box.",
            "The room to build it: a flat-packed piece needs clear floor around it while you put it together.",
          ],
        },
        {
          heading: "Buying a piece",
          body: [
            "We sell furniture. Each design is a complete piece with a use, and you can choose it as it is. Accessories that fit a piece can be added to it. Ask us whether a single part can be bought on its own.",
            "No piece needs customizing. The standard version is already complete, so change it only if you want a different size, finish or accessory.",
            "The pictures are 3D renders, and the lamps, books, bags and other objects in them aren't included. Each product page says what is.",
          ],
        },
        {
          heading: "Ordering and payment",
          body: [
            `Sign in to buy. Each piece shows its price before you pay. ${shown("paymentMethods")} ${shown("gstTerms")}`,
            "If you're ordering for an office or need several pieces, ask us for a quote.",
          ],
          link: { label: "Ask for a quote", href: contactHref("office") },
        },
        {
          heading: "Delivery and lead times",
          body: ["We deliver in Singapore, and every piece is made to order at our partner factory in China."],
          points: [
            `Modular, flat-packed: ${shown("leadFlatPack")}`,
            `Modular, built: ${shown("leadBuilt")}`,
            `Custom sizes: ${shown("leadCustomExtra")}`,
            `Ready-made furniture: ${shown("leadReadyMade")}`,
            `Add-ons: ${shown("leadAddOns")}`,
          ],
        },
        {
          heading: "Assembly",
          body: [
            `Flat-packed pieces come with their steps. Built pieces arrive put together, though large ones may be finished at your home. Installation costs ${shown("installPrice")}.`,
            shown("assemblyDetails"),
          ],
        },
        {
          heading: "Drilling and moving it",
          body: [
            "It depends on the piece. Taller pieces may need fixing to the wall, and pieces on casters can be moved, within limits we confirm for each one. We don't promise \"no drilling\" for the whole range.",
          ],
        },
        {
          heading: "Adding to it later",
          body: [
            "Often, yes. An accessory or a door can be added to a piece that takes it. Bigger changes need checking against the exact version you have.",
          ],
        },
        {
          heading: "Customizing",
          body: [
            `Height changes in steps of 40 cm up to 160 cm, and width is 60, 120 or 180 cm. A custom size costs ${shown("customSizePrice")} and a special colour ${shown("specialColourPrice")}. Add-ons cost ${shown("addOnPrices")}.`,
            "Anything outside these limits goes to our team for a review and a quote.",
          ],
        },
        {
          heading: "Returns and warranty",
          body: [
            `Non-custom pieces can be returned on our standard terms. Custom pieces can be returned only if they are faulty, damaged or wrong. ${shown("returnsTerms")} ${shown("warranty")}`,
            `If something arrives damaged or missing, write to ${EMAIL} with your order number and photos.`,
          ],
          link: { label: "Refund policy", href: routes.refunds },
        },
        {
          heading: "Replacement parts",
          body: [`Tell us your order number and which part you need. ${shown("replacementParts")}`],
          link: { label: "Ask about a part", href: contactHref("order") },
        },
        {
          heading: "Moving home",
          body: [
            "Measure the new spot and the way in before you move, as you did the first time. If a piece no longer fits the room, ask us what can be changed.",
            shown("takeApart"),
          ],
        },
        {
          heading: "Safety",
          body: [
            `${shown("stability")} ${shown("weightLimits")}`,
            "Our dividers and screens separate a room visually. They do not block sound. If you rent, or live in an HDB flat, check your landlord's or HDB's rules before you drill into a wall.",
          ],
        },
        {
          heading: "Support",
          body: [
            `Write to us by email, and we reply within ${shown("replyTime")}. Once you've signed in, the AI assistant can also answer questions. We don't have a phone line, live chat or a showroom.`,
          ],
          link: { label: "What the AI can do", href: `${routes.studio}#packages-title` },
        },
      ]}
      calls={[{ label: "Ask a question", href: routes.contact }]}
    />
  );
}
