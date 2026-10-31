import type { Metadata } from "next";
import { shown } from "@/lib/facts";
import { contactHref, routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "How it works", description: "Buy Furnishes furniture ready-made or adjust it to fit, from choosing a piece to delivery in Singapore." };

/** How buying works, in plain words: what is sold, what can change, what the AI does, then the way to your door. */
export default function HowItWorks() {
  return (
    <TextPage
      label="How it works"
      title="Ready-made, already designed, or composed by you."
      lede="Furnishes sells furniture for Singapore homes and small offices, made by our partner factory in China. You can browse and buy without talking to anyone."
      jump
      sections={[
        {
          heading: "Three kinds of furniture",
          body: [
            `Ready-made furniture is sold as it is: office, storage, dining and living pieces. Choose this when a standard size suits the space. ${shown("readyMadeList")}`,
            "Modular furniture, already designed, is 18 mm birch plywood on one grid, standing on a base or on casters. We've designed each piece for a job, and it is complete as it stands. Choose this when a standard size doesn't fit, or when you may want the piece to do something else later.",
            "Modular furniture, composed by you, uses the same panels and parts. You choose the board size, colour, texture and add-ons, and the AI assistant works out how your version goes together. Choose this when no finished design suits your space.",
            "Both modular kinds can arrive already built, or flat-packed for you to build yourself.",
          ],
        },
        {
          heading: "Why modular",
          body: ["Modular furniture is built from panels and parts that work together. If a standard size suits you, ready-made furniture is simpler."],
          points: [
            "It fits where fixed sizes don't, using parts in set heights and widths.",
            "It can change its job: the same frame can take another set of parts.",
            "It can grow, with a door, a drawer, a second segment or wheels added later.",
            "A damaged part can often be looked at on its own.",
            "Not every part fits every piece, so we check against the version you own.",
          ],
        },
        {
          heading: "What you can customize",
          body: ["Start with a finished piece, then change only what you need. Its page shows what applies to it and what it costs."],
          points: [
            `Size: height in steps of 40 cm up to 160 cm, width of 60, 120 or 180 cm, at a fixed 40 cm depth. A custom size costs ${shown("customSizePrice")}.`,
            `Colour: white matte with birch edges to start. A special colour, once offered, costs ${shown("specialColourPrice")}.`,
            "Texture: more follow once real samples are confirmed.",
            `Add-ons: hooks, trays, doors, drawers and more, offered only where they have been checked to fit. They cost ${shown("addOnPrices")}.`,
            "Anything else goes to our team for a review and a quote.",
          ],
          link: { label: "Ask about a custom size", href: contactHref("custom") },
        },
        {
          heading: "How the AI helps",
          body: [
            "The AI assistant helps you work out what you need and proposes how to put it together. Fixed rules then check the parts, the price and the steps. If a proposal falls outside those rules, it goes to our team, who review it and send a quote.",
            "The AI proposes. It does not decide what is safe to make.",
          ],
        },
        {
          heading: "Tools after you sign in",
          body: ["You need to sign in to use these, and you can buy furniture without them."],
          points: [
            "AI assistant: ask about your space and get suggestions.",
            "3D view: see furniture in a model of your room before you buy.",
            "Dashboard: keep your designs and follow your orders.",
          ],
        },
        {
          heading: "From order to your home",
          body: ["Every piece is made to order, so there is a wait."],
          points: [
            "You order and pay. Each page shows the price before you buy.",
            `The factory in China makes it. Flat-packed modular pieces take ${shown("leadFlatPack")}, built pieces ${shown("leadBuilt")}, and ready-made furniture ${shown("leadReadyMade")}. Custom sizes add ${shown("leadCustomExtra")}.`,
            `It is shipped to Singapore and delivered to you. ${shown("gstTerms")}`,
            `Flat-packed pieces come with their steps for you to build yourself. Built pieces arrive put together, though large ones may be finished at your home. Installation costs ${shown("installPrice")}.`,
          ],
        },
      ]}
      calls={[
        { label: "See the furniture", href: routes.collection },
        { label: "Find what you need", href: routes.quiz },
        { label: "Ask a question", href: routes.contact },
      ]}
    />
  );
}
