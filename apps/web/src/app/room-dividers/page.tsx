import type { Metadata } from "next";
import { PiecesFor } from "@/features/products/PiecesFor";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Room dividers", description: "Divide a room with furniture: what dividers and screens can do, and what they cannot." };

/** Room dividers: who they are for, why they fit better than fixed sizes, and their limits. */
export default function RoomDividers() {
  return (
    <TextPage
      label="Room dividers"
      title="Make one room do two jobs."
      lede="Tall cabinets and screens that divide a rented or shared room, sized and arranged for that room."
      sections={[
        {
          heading: "Who it's for",
          points: [
            "Renters who need a bedroom and somewhere to work",
            "Housemates or siblings sharing a room",
            "Anyone who wants a separate space without building a wall",
          ],
          body: [],
        },
        {
          heading: "Why not a fixed-size divider?",
          body: [
            "A fixed divider comes in one size, and it does one thing. Ours are built from segments you can size and arrange for your room, and they hold books and belongings on the way. When you move, tell us about the new room and ask what can be changed.",
          ],
        },
        {
          heading: "The limits",
          points: [
            "Sound: our dividers separate a room visually. They do not block sound.",
            `Tipping: ${shown("stability")} ${shown("weightLimits")}`,
            `Rules: check with your landlord or HDB before you drill or change a room. ${shown("hdbRules")}`,
            "Light and air: measure where windows, doors and fans are, so a divider doesn't block them.",
          ],
          body: [],
        },
      ]}
      calls={[
        { label: "See dividers in the collection", href: `${routes.collection}?use=dividing#find` },
        { label: "Ask about your room", href: contactHref("room") },
        { label: "Book a visit", href: contactHref("visit") },
      ]}
    >
      <PiecesFor title="Pieces that divide a room" ids={["divider", "bookwall", "sofa-back", "bed-head", "mobile-screen"]} />
    </TextPage>
  );
}
