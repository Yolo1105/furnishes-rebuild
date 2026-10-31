import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Terms & Conditions", description: "The terms for buying from Furnishes and using this site." };

/** A draft for selling and importing furniture, adapted from the older terms, till a lawyer has reviewed it. */
export default function Terms() {
  return (
    <TextPage
      label="Legal"
      title="Terms & Conditions"
      lede="Draft, pending legal review."
      sections={[
        { heading: "Who we are", body: [`Furnishes Pte Ltd, Singapore. ${shown("companyDetails")} These terms apply when you use this site or buy from us.`] },
        { heading: "Your account", body: ["Keep your sign-in details private, and tell us if you think someone else has used your account. You can ask us to delete your account at any time."] },
        { heading: "Orders", body: ["Your order is confirmed when we accept it and your payment has gone through. Custom pieces are made for you once confirmed, so they can't be cancelled after making starts."] },
        { heading: "Prices", body: [`Prices are in Singapore dollars. ${shown("gstTerms")} We can correct a clear pricing error, and we'll tell you before you pay any difference.`] },
        { heading: "Making and delivery", body: [`Pieces are made by our partner factory in China and shipped to Singapore. Lead times are estimates: ${shown("leadFlatPack")} for flat-packed pieces, ${shown("leadBuilt")} for built pieces and ${shown("leadReadyMade")} for ready-made furniture.`] },
        { heading: "Measuring and fit", body: ["Sizes are nominal. You are responsible for checking the spot and the way in before you order, unless we measured them for you on a visit."] },
        { heading: "Using the furniture", body: [`Follow the steps, the weight limits and the stability guidance. ${shown("stability")} ${shown("weightLimits")} Check your landlord's or HDB's rules before you drill or change a room.`] },
        { heading: "The AI assistant", body: ["Its suggestions are guidance, not professional advice. For anything structural, electrical or load-bearing, ask a licensed professional. Check its suggestions against your own measurements."] },
        { heading: "Pictures", body: ["Product images are 3D renders. Finished pieces can differ slightly, and anything around a piece in an image isn't included."] },
        { heading: "Your content and ours", body: ["Photos and details of your room stay yours. You let us use them to provide what you asked for. This site, its designs and its words stay ours."] },
        { heading: "Acceptable use", body: ["Don't upload illegal content, harass others, or try to break into or overload our systems. We may suspend accounts that do."] },
        { heading: "Liability", body: [`${shown("liabilityCap")} Nothing here limits rights you have by law, including under Singapore's consumer protection law.`] },
        { heading: "Governing law", body: ["These terms follow the law of Singapore, and disputes go to the courts of Singapore."] },
        { heading: "Questions", body: [`Write to ${EMAIL}.`] },
      ]}
      calls={[
        { label: "Refund Policy", href: routes.refunds },
        { label: "Privacy Policy", href: routes.privacy },
      ]}
    />
  );
}
