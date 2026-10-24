import { SiteHeader } from "@/shell/SiteHeader";

/** Every public page: the bar on top, the page's own content below. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  );
}
