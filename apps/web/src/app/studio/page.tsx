import type { Metadata } from "next";
import { PeachBackdrop } from "@/shell/PeachBackdrop";

export const metadata: Metadata = { title: "Design your room" };

/** Where a room is designed: for now, the peach backdrop under the bar. */
export default function Studio() {
  return (
    <main>
      <h1 className="visually-hidden">Design your room</h1>
      <PeachBackdrop />
    </main>
  );
}
