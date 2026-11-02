import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import { SiteFooter } from "@/shell/SiteFooter";
import { Button } from "@/shell/ui/Button";
import { Section } from "@/shell/ui/Section";
import { SectionHead } from "@/shell/ui/SectionHead";
import { Steps } from "@/shell/ui/Steps";
import { StudioView } from "./StudioView";

export const metadata: Metadata = {
  title: "Design your room",
  description: "Try a Furnishes piece in a real HDB flat plan at its real size, then ask us to check it fits your room.",
};

/** Design your room: the planner, then how it goes from here. */
export default function Studio() {
  return (
    <>
      <main id="main">
        <Section id="design-your-room">
          <SectionHead
            as="h1"
            id="design-your-room"
            eyebrow="Room planner"
            title="Design your room."
            lede="Pick a room on the plan and a piece, and it is drawn in at its real size. Send it to us and we check it fits your own room."
            action={
              <div className="actions">
                <Button variant="secondary" href={routes.howItWorks}>
                  How it works
                </Button>
              </div>
            }
          />
          <StudioView />
        </Section>
        <Section id="next" tone="linen">
          <SectionHead id="next" title="From the plan to your room." />
          <Steps
            steps={[
              { title: "Try it on the plan", body: "See the piece at its real size in a room like yours." },
              { title: "Send us your room", body: "Your measurements or a photo; we check the piece fits and suggest a size." },
              { title: "Order it", body: "We confirm the price and the date by email, then make it for you." },
            ]}
          />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
