/**
 * The rooms in the order a visit walks them, from the front door: what each
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
  { key: "yard", short: "Yard", name: "Yard", line: "The washing machine, and room to hang a load, just off the kitchen." },
  { key: "shelter", short: "Shelter", name: "Shelter", line: "The household shelter: thick walls, a steel door, and the flat's best store room." },
  { key: "hall", short: "Hall", name: "Hall", line: "The spine of the flat: every bedroom and the shared bathroom open off it." },
  { key: "bathroom", short: "Bath", name: "Bathroom", line: "A WC, a basin and a walk-in shower, shared off the hall." },
  { key: "bedroom2", short: "Bed 2", name: "Bedroom 2", line: "A single bed and its bedside table, a tall wardrobe, and a bay window to the north." },
  { key: "bedroom3", short: "Bed 3", name: "Bedroom 3", line: "A single bed, and a desk in the bay window with the wardrobe by the door." },
  { key: "master", short: "Master", name: "Master bedroom", line: "A queen bed between two bedside tables, a wardrobe along the wall, and a bath of its own." },
  { key: "ensuite", short: "Ensuite", name: "Master bath", line: "A WC, a basin and a shower, the master bedroom's alone." },
] as const;

export type TourRoom = (typeof TOUR)[number]["key"];
