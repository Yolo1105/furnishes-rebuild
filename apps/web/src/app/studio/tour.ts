import { STOPS } from "@/features/walk/rig";

/**
 * Each room of the flat as the tour's first step tells it, by its key in
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

/**
 * The tour's steps, as the landing-page branch's walk told them: first the
 * plan, a room at a time as you pick them; then the walls go up, you step
 * inside, the bookcase is built, the materials go on, and the room is yours;
 * then a piece is ordered for it, from picking it to having it at home.
 * Each has its headline (a lead line, then softer lines) and, from the
 * second, its label and a line on it. `walk` is the stretch of the 3D walk
 * (rig.ts STOPS) it plays: the first holds on the plan.
 */
export const STEPS: readonly {
  lead: string;
  soft: readonly string[];
  label?: string;
  body?: string;
  walk: readonly [number, number];
}[] = [
  { lead: "Start at the door,", soft: ["and walk through", "every room."], walk: [STOPS.sheet, STOPS.sheet] },
  {
    lead: "Then the walls",
    soft: ["go up."],
    label: "The walls",
    body: "The drawing becomes rooms you can stand in, at their real height, with light through their windows. What was a line on paper now has a corner to look into and a wall you can place something against.",
    walk: [STOPS.sheet, STOPS.lifted],
  },
  {
    lead: "Step inside.",
    soft: [],
    label: "Inside",
    body: "Through the front door at eye level, the way you will walk in on the first day. Look around from where you would actually stand, and see how each room opens onto the next before anything is moved.",
    walk: [STOPS.lifted, STOPS.walked],
  },
  {
    lead: "Made for that wall,",
    soft: ["board by board."],
    label: "The Furnishes bookcase",
    body: "Cut to the millimetre from 18 mm boards, and put together in your home. Every piece we make starts from your plan, so it meets the wall, the corner and the things you already own as it should.",
    walk: [STOPS.walked, STOPS.built],
  },
  {
    lead: "Then choose what",
    soft: ["it is made of."],
    label: "Materials",
    body: "Oak or walnut, wool or linen, any colour. Try a finish across the whole room before you decide, and see how it sits beside the floor, the walls and everything else that stays.",
    walk: [STOPS.built, STOPS.finished],
  },
  {
    lead: "Try another layout.",
    soft: ["Make it yours."],
    label: "Your turn",
    body: "Turn the sofa, move the table, see what fits. Try the arrangement you have always wondered about, and put it back if it does not work. Then start on your own room.",
    walk: [STOPS.finished, STOPS.away],
  },
  {
    lead: "Seen one you like?",
    soft: ["Try it in your room."],
    label: "Pick a piece",
    body: "Choose a piece and it is drawn in where it would go, at its real size, before anything is ordered. You see how much room it takes and what it sits beside, not just how it looks on its own.",
    walk: [STOPS.away, STOPS.picked],
  },
  {
    lead: "Change what you like,",
    soft: ["and watch it change."],
    label: "Your choices",
    body: "Try each finish on the piece itself, in your room's light, and keep the one that suits it. Every change shows straight away, so you are deciding from the piece in its place, not from a swatch.",
    walk: [STOPS.picked, STOPS.made],
  },
  {
    lead: "Into the cart,",
    soft: ["and it is ordered."],
    label: "Cart and checkout",
    body: "The piece with every choice on it, so you can read through exactly what you are getting. Pick where and when it comes, check it over once more, then place the order.",
    walk: [STOPS.made, STOPS.ordered],
  },
  {
    lead: "On its way,",
    soft: ["and you can see where."],
    label: "Delivery",
    body: "Made to your choices, then out for delivery. Each stage shows as it happens, from the workshop to your door, and you can see when it is near, so you know when to be home.",
    walk: [STOPS.ordered, STOPS.sent],
  },
  {
    lead: "Here it is.",
    soft: ["Just as you saw it."],
    label: "In your room",
    body: "Put together in your home, where you first drew it in, and everything as it was on the plan. The same wall, the same finish, the same size you saw before you ordered, now there to use.",
    walk: [STOPS.sent, STOPS.home],
  },
];

/** The first step of the order: the order's card shows from here on (OrderCard). */
export const FIRST_ORDER_STEP = 6;
