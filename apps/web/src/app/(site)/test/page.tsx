import type { Metadata } from "next";
import { HeroTitle } from "@/features/stage/HeroTitle";
import { Stage } from "@/features/stage/Stage";

export const metadata: Metadata = { title: "Test", robots: { index: false } };

/** A bare test page: the bar, the moving wash, and the landing's title. */
export default function TestPage() {
  return (
    <Stage label="Test">
      <HeroTitle />
    </Stage>
  );
}
