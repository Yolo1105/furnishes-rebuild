import type { Metadata } from "next";
import { PhotoIntro } from "@/features/intro/PhotoIntro";
import { PlanWalk } from "@/features/plan/PlanWalk";

export const metadata: Metadata = { title: "Test", robots: { index: false } };

/**
 * The landing as it may become: a photo of a real room, which turns into a
 * drawing and then into the flat's plan, before the walk.
 */
export default function TestPage() {
  return <PlanWalk intro={<PhotoIntro />} />;
}
