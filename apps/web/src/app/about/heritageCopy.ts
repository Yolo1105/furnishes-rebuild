import { shown } from "@/lib/facts";

/** The story band's words. The history itself is a placeholder till it is written from fact. */
export const HERITAGE = {
  heading: "Our",
  we: "story",
  rest: "",
  tagline: [shown("companyStory")],
} as const;

export const HERITAGE_STEPS: readonly { title: string; tag: string; body: string }[] = [
  {
    title: "How we started",
    tag: "Origins",
    body: shown("companyStory"),
  },
  {
    title: "What we do today",
    tag: "Today",
    body: "We sell ready-made furniture and modular pieces, made by our partner factory in China, to homes and small offices in Singapore.",
  },
  {
    title: "Where we are going",
    tag: "Next",
    body: "We start in Singapore, with HDB families and startup offices first, and may deliver further once that works well.",
  },
];
