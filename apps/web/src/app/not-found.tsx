import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Any address the site doesn't have, with the ways back in. */
export default function NotFound() {
  return (
    <>
      <main id="main">
        <Section id="not-found">
          <SectionHead
            as="h1"
            id="not-found"
            title="That page isn't here."
            lede="It may have moved, or the address may be mistyped."
            action={
              <div className="actions">
                <Button variant="primary" href={routes.products}>
                  See the furniture
                </Button>
                <Button variant="link" href={routes.contact}>
                  Contact us →
                </Button>
              </div>
            }
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
