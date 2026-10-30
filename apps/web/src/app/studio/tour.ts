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
  ensuite: { name: "Master bath", line: "The master bedroom's own bath: a walk-in shower, a WC and a basin." },
  hall: { name: "Hall", line: "The way from the living room to the bedrooms, with the bathroom and the shelter off it." },
  shelter: { name: "Shelter", line: "The household shelter: a strong room by the kitchen, used for storage." },
  yard: { name: "Yard", line: "The service yard behind the kitchen, with the washing machine and room to hang the laundry." },
};

/** The room the tour's first step opens on. */
export const FIRST_ROOM = "living";

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
    body: "The drawing becomes rooms you can stand in, at their real height, with light through their windows.",
    walk: [STOPS.sheet, STOPS.lifted],
  },
  {
    lead: "Step inside.",
    soft: [],
    label: "Inside",
    body: "Through the front door at eye level, the way you will walk in on the first day.",
    walk: [STOPS.lifted, STOPS.walked],
  },
  {
    lead: "Made for that wall,",
    soft: ["board by board."],
    label: "The Furnishes bookcase",
    body: "Cut to the millimetre from 18 mm boards, and put together in your home. Every piece we make starts from your plan.",
    walk: [STOPS.walked, STOPS.built],
  },
  {
    lead: "Then choose what",
    soft: ["it is made of."],
    label: "Materials",
    body: "Oak or walnut, wool or linen, any colour: try a finish across the whole room before you decide.",
    walk: [STOPS.built, STOPS.finished],
  },
  {
    lead: "Try another layout.",
    soft: ["Make it yours."],
    label: "Your turn",
    body: "Turn the sofa, move the table, see what fits. Then start on your own room.",
    walk: [STOPS.finished, STOPS.away],
  },
  {
    lead: "Seen one you like?",
    soft: ["Try it in your room."],
    label: "Pick a piece",
    body: "Choose a piece and it is drawn in where it would go, at its real size, before anything is ordered.",
    walk: [STOPS.away, STOPS.picked],
  },
  {
    lead: "Change what you like,",
    soft: ["and watch it change."],
    label: "Your choices",
    body: "Try each finish on the piece itself, in your room's light, and keep the one that suits it.",
    walk: [STOPS.picked, STOPS.made],
  },
  {
    lead: "Into the cart,",
    soft: ["and it is ordered."],
    label: "Cart and checkout",
    body: "The piece with every choice on it. Pick where and when it comes, then place the order.",
    walk: [STOPS.made, STOPS.ordered],
  },
  {
    lead: "On its way,",
    soft: ["and you can see where."],
    label: "Delivery",
    body: "Made to your choices, then out for delivery: each stage shows as it happens, and when it is near.",
    walk: [STOPS.ordered, STOPS.sent],
  },
  {
    lead: "Here it is.",
    soft: ["Just as you saw it."],
    label: "In your room",
    body: "Put together in your home, where you first drew it in, and everything as it was on the plan.",
    walk: [STOPS.sent, STOPS.home],
  },
];

/** The first step of the order: the order's card shows from here on (OrderCard). */
export const FIRST_ORDER_STEP = 6;
