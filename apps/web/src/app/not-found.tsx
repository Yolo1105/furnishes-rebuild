import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { TextPage } from "@/shell/TextPage";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Any address the site doesn't have, with the ways back in. */
export default function NotFound() {
  return (
    <TextPage
      label="Page not found"
      title="We can't find that page."
      lede="It may have moved, or the address may be mistyped."
      sections={[]}
      calls={[
        { label: "See the furniture", href: routes.collection },
        { label: "Go to the homepage", href: routes.studio },
        { label: "Ask a question", href: routes.contact },
      ]}
    />
  );
}
