import type { Metadata } from "next";
import { EMAIL } from "@/lib/contact";
import { shown } from "@/lib/facts";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "What personal data Furnishes collects, why, and how to ask about it." };

/** A draft adapted from the older policy, till a lawyer has reviewed it against the PDPA. */
export default function Privacy() {
  return (
    <TextPage
      label="Legal"
      title="Privacy Policy"
      lede="Draft, pending legal review."
      sections={[
        { heading: "What we collect", body: ["What you give us: your name, email, phone and address, the details and photos of your room, your conversations with the AI assistant, and your orders. Card details are handled by our payment provider and don't reach our servers."] },
        { heading: "Why", body: ["To answer you, to make suggestions, to make and deliver what you order, and to send receipts and delivery updates. We only send marketing if you opt in. We don't sell your details."] },
        { heading: "Who sees it", body: [`The people and services needed to do this. That includes our partner factory and delivery companies, some of them outside Singapore. ${shown("processors")}`] },
        { heading: "Your rights", body: [`Under Singapore's PDPA, you can ask to see or correct your details, withdraw consent for marketing, or ask us to delete them. Write to ${EMAIL}. ${shown("dpoContact")}`] },
        { heading: "How long we keep it", body: [shown("dataRetention")] },
        { heading: "Security", body: ["We use reasonable technical measures to protect your details, including encrypted connections."] },
        { heading: "Cookies", body: ["We use the cookies needed for signing in and keeping your session. We don't use third-party advertising cookies."] },
        { heading: "Changes", body: ["If we change this policy, we'll update this page, and email account holders about significant changes."] },
      ]}
    />
  );
}
