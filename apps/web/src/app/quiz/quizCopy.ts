import { ACTIVITIES, type ActivityId, BUDGETS, USES, type UseId, WIDTHS } from "@/features/products/catalogue";

const options = (o: Record<string, { name: string }>) => Object.entries(o).map(([id, { name }]) => ({ id, name }));

/** Life situations: what each leads to, and why it would suit. */
export const LIFE: readonly { id: string; name: string; use?: UseId; activity?: ActivityId; reason: string }[] = [
  { id: "home-office", name: "I work from home", use: "work", reason: "It suits working from home." },
  { id: "children", name: "There are children", activity: "store", reason: "It keeps things out of sight, for a home with children." },
  { id: "cook", name: "I cook a lot", use: "kitchen", reason: "It helps when you cook a lot." },
  { id: "rented", name: "Small, and rented", activity: "move", reason: "It rolls, for a small rented home." },
  { id: "sharing", name: "I share the room", activity: "divide", reason: "It gives a shared room a line." },
  { id: "calls", name: "I am on calls", activity: "divide", reason: "It can stand behind you on calls." },
  { id: "books", name: "Books and records", activity: "display", reason: "It has a place for books and records." },
  { id: "no-hallway", name: "No hallway", use: "entryway", reason: "It gives coats, keys and shoes a place." },
];

/** A question's id, its words, its choices, and whether more than one can be picked. */
export type QuizGroup = { id: string; ask: string; options: readonly { id: string; name: string }[]; many?: boolean };

/** The quiz, step by step. Any step can be skipped, and any answer changed afterwards. */
export const QUIZ_STEPS: readonly { name: string; title: string; groups: readonly QuizGroup[] }[] = [
  {
    name: "Why",
    title: "What brought you here?",
    groups: [
      {
        id: "why",
        ask: "Pick the closest.",
        options: [
          { id: "problem", name: "One thing is bothering me" },
          { id: "vague", name: "Something feels off, I'm not sure what" },
          { id: "new", name: "A new home or office" },
          { id: "looking", name: "Just looking" },
        ],
      },
    ],
  },
  {
    name: "Where",
    title: "Where is it for?",
    groups: [
      {
        id: "where",
        ask: "Pick one.",
        options: [...Object.entries(USES).map(([id, name]) => ({ id, name })), { id: "office", name: "An office" }],
      },
    ],
  },
  {
    name: "What",
    title: "What do you want more of?",
    groups: [
      { id: "life", ask: "What sounds like you?", many: true, options: LIFE.map(({ id, name }) => ({ id, name })) },
      { id: "want", ask: "What do you want to do more easily?", many: true, options: options(ACTIVITIES) },
    ],
  },
  {
    name: "Who",
    title: "Who uses the space?",
    groups: [
      {
        id: "who",
        ask: "Who is it for?",
        options: [
          { id: "me", name: "Just me" },
          { id: "family", name: "A family" },
          { id: "sharing", name: "Housemates or a shared room" },
          { id: "team", name: "A team" },
        ],
      },
      {
        id: "home",
        ask: "Do you rent or own?",
        options: [
          { id: "rent", name: "Rent" },
          { id: "own", name: "Own" },
        ],
      },
    ],
  },
  {
    name: "Size",
    title: "How much room is there?",
    groups: [
      { id: "width", ask: "How wide is the spot?", options: options(WIDTHS) },
      {
        id: "drill",
        ask: "Can you drill into the wall?",
        options: [
          { id: "yes", name: "Yes" },
          { id: "no", name: "No" },
        ],
      },
    ],
  },
  {
    name: "Keeping",
    title: "What furniture are you keeping?",
    groups: [
      {
        id: "keep",
        ask: "Pick the closest.",
        options: [
          { id: "none", name: "Nothing here yet: a new room, starting from an empty wall" },
          { id: "most", name: "Everything stays: one piece next to what I keep" },
          { id: "moves", name: "Moves with me: I rent, and it has to come along" },
        ],
      },
    ],
  },
  {
    name: "Style",
    title: "What do you like the look of?",
    groups: [
      {
        id: "style",
        ask: "Which is closest?",
        options: [
          { id: "calm", name: "Calm and plain" },
          { id: "warm", name: "Warm and natural" },
          { id: "bold", name: "Bold and characterful" },
        ],
      },
      {
        id: "colour",
        ask: "Which colours?",
        options: [
          { id: "light", name: "White and birch" },
          { id: "dark", name: "Dark tones" },
          { id: "colour", name: "A strong colour" },
        ],
      },
    ],
  },
  {
    name: "Budget",
    title: "What's your budget for a piece?",
    groups: [{ id: "budget", ask: "Pick the closest.", options: options(BUDGETS) }],
  },
];
