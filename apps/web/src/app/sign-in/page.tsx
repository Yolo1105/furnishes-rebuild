import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/** Holds the address till the built sign-in is connected to this site. */
export default function SignIn() {
  return (
    <TextPage
      label="Your account"
      title="Sign in"
      lede="Sign in isn't connected on this version of the site yet."
      sections={[
        {
          heading: "What an account gives you",
          body: ["The AI assistant, the 3D view of your room, your dashboard and your orders."],
        },
      ]}
      calls={[
        { label: "Browse furniture", href: routes.collection },
        { label: "Ask a question", href: routes.contact },
      ]}
    />
  );
}
