/**
 * The heritage band's words, ported as they stand from furnishes_prod's
 * homepage (content/site/heritage-content.ts): its heading, with "we" set
 * apart, the call over it, the two paragraphs beside it and the five steps
 * of the studio's history under it, each with its tag.
 */
export const HERITAGE = {
  call: "Start your project",
  heading: "Heritage",
  we: "we",
  rest: " preserve",
  tagline: [
    "From workshop roots to full interiors, craft, clarity, and lasting materials stay at the center of how we work.",
    "We still sketch with real samples, watch light move through a room, and choose finishes that feel honest in the hand. Our process stays quiet and deliberate: clear plans, steady partners, and spaces built to live well long after the first reveal.",
  ],
} as const;

export const HERITAGE_STEPS: readonly { title: string; tag: string; body: string }[] = [
  {
    title: "Workshop beginnings",
    tag: "Origins",
    body: "What began as a small workshop grew through joinery, samples, and clients who valued care over volume. That early habit of listening to materials, light, and daily use still shapes how we plan each project today.",
  },
  {
    title: "First signature spaces",
    tag: "Milestones",
    body: "Early residential and studio projects set our language of honest materials, clear plans, and rooms built to age well with daily life.",
  },
  {
    title: "Craft & collaborators",
    tag: "Makers",
    body: "We deepened ties with local makers and suppliers so bespoke details and trusted fabrication stay central to every brief.",
  },
  {
    title: "Broader commissions",
    tag: "Growth",
    body: "Larger renovations and mixed use work stretched our process while keeping the same bar for light, proportion, and finish.",
  },
  {
    title: "Today & next chapters",
    tag: "Legacy",
    body: "The studio now balances new builds and careful renewals, carrying forward a heritage of clarity, warmth, and buildable design.",
  },
];
