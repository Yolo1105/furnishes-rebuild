/**
 * The six rooms a visit walks through, in order from the front door (the
 * hall, shelter, yard and master bath left out): what each
 * is called on the tour (and in short, for the tabs) and a line on what is in it (drafts, from what the
 * plan draws in each room). `key` is the room's in flat.ts.
 */
export const TOUR = [
  {
    key: "living",
    short: "Living",
    name: "Living & dining",
    line: "The sofa faces the television, an armchair sits by the east window, and the table seats four. Light from two sides.",
  },
  { key: "kitchen", short: "Kitchen", name: "Kitchen", line: "Counters along two walls, the hob and the sink under the window, the fridge by the yard door." },
  { key: "bathroom", short: "Bath", name: "Bathroom", line: "A WC, a basin and a walk-in shower, shared off the hall." },
  { key: "bedroom2", short: "Bed 2", name: "Bedroom 2", line: "A single bed and its bedside table, a tall wardrobe, and a bay window to the north." },
  { key: "bedroom3", short: "Bed 3", name: "Bedroom 3", line: "A single bed, and a desk in the bay window with the wardrobe by the door." },
  { key: "master", short: "Master", name: "Master bedroom", line: "A queen bed between two bedside tables, a wardrobe along the wall, and a bath of its own." },
] as const;

export type TourRoom = (typeof TOUR)[number]["key"];
