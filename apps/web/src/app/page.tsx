import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** The landing is the studio: anyone arriving at the root is sent straight there. */
export default function Home() {
  redirect(routes.studio);
}
