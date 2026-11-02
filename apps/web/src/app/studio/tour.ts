/**
 * Each room of the flat as the planner tells it, by its key in
 * flat.ts: its name and a line on what is in it (drafts, from what the plan
 * draws in each room). Picking a room on the plan brings up its line.
 */
export const ROOM_NOTES: Record<string, { name: string; line: string }> = {
  living: {
    name: "Living & dining",
    line: "The sofa faces the television, an armchair sits by the east window, and the table seats four. Light from two sides.",
  },
  kitchen: { name: "Kitchen", line: "Counters along two walls, the hob and the sink under the window, the fridge by the yard door." },
  bathroom: { name: "Bathroom", line: "A WC, a basin and a walk-in shower, shared off the hall." },
  bedroom2: { name: "Bedroom 2", line: "A single bed and its bedside table, a tall wardrobe, and a bay window to the north." },
  bedroom3: { name: "Bedroom 3", line: "A single bed, and a desk in the bay window with the wardrobe by the door." },
  master: { name: "Master bedroom", line: "A queen bed between two bedside tables, a wardrobe along the wall, and a bath of its own." },
  ensuite: { name: "Master bath", line: "The master bedroom's own bath. A walk-in shower, a WC and a basin." },
  hall: { name: "Hall", line: "The way from the living room to the bedrooms, with the bathroom and the shelter off it." },
  shelter: { name: "Shelter", line: "The household shelter. A strong room by the kitchen, used for storage." },
  yard: { name: "Yard", line: "The service yard behind the kitchen, with the washing machine and room to hang the laundry." },
};
