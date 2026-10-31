import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Refund Policy", description: "When Furnishes orders can be returned or refunded, and how to ask." };

/** A draft till a lawyer has reviewed it. */
export default function Refunds() {
  return (
    <TextPage
      label="Legal"
      title="Refund Policy"
      lede="Draft, pending legal review."
      sections={[
        { heading: "Non-custom pieces", body: [`These can be returned on our standard terms. ${shown("returnsTerms")}`] },
        { heading: "Custom pieces", body: ["Because these are made for you, they can be returned only if they are faulty, damaged or wrong."] },
        { heading: "Damaged or missing parts", body: [`Write to ${EMAIL} with your order number and photos. We'll send a replacement part or arrange a return.`] },
        { heading: "Cancelling", body: ["You can cancel before making starts. After that, the terms above apply."] },
        { heading: "Visits", body: [`A visit costs ${shown("consultPrice")}.`] },
        { heading: "Warranty", body: [shown("warranty")] },
        { heading: "Your rights by law", body: ["Nothing here limits your rights under Singapore's consumer protection law."] },
      ]}
    />
  );
}
