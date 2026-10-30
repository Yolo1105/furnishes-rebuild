import type { StaticImageData } from "next/image";
import bathCartObject from "@/assets/bright-living-room.jpg";
import bedScreenObject from "@/assets/white-living-room.jpg";
import coffeeObject from "@/assets/reading-corner.jpg";
import doubleObject from "@/assets/garden-dining-room.jpg";
import dropLeafObject from "@/assets/a-frame-living-room.jpg";
import fittingObject from "@/assets/afternoon-living-room.jpg";
import grilleObject from "@/assets/staircase-reading-corner.jpg";
import islandObject from "@/assets/furniture-gallery.jpg";
import kitchenScreenObject from "@/assets/sage-sideboard.jpg";
import offsetObject from "@/assets/balcony-doors.jpg";
import openingObject from "@/assets/bright-living-room.jpg";
import phoneBoothObject from "@/assets/white-living-room.jpg";
import recordWallObject from "@/assets/reading-corner.jpg";
import shapeLObject from "@/assets/garden-dining-room.jpg";
import shapeTPlainObject from "@/assets/a-frame-living-room.jpg";
import shapeTObject from "@/assets/afternoon-living-room.jpg";
import shapeUObject from "@/assets/staircase-reading-corner.jpg";
import shapeZObject from "@/assets/furniture-gallery.jpg";
import spiceFaceObject from "@/assets/sage-sideboard.jpg";
import standingDeskObject from "@/assets/balcony-doors.jpg";
import stepsObject from "@/assets/bright-living-room.jpg";
import stripObject from "@/assets/white-living-room.jpg";
import toolScreenObject from "@/assets/reading-corner.jpg";
import tvCabinetObject from "@/assets/garden-dining-room.jpg";
import twoDesksObject from "@/assets/a-frame-living-room.jpg";
import videoBackgroundObject from "@/assets/afternoon-living-room.jpg";
import wheeledPartitionObject from "@/assets/staircase-reading-corner.jpg";
import workstationWallObject from "@/assets/furniture-gallery.jpg";
import bedsideScene from "@/assets/afternoon-living-room.jpg";
import coatStandScene from "@/assets/staircase-reading-corner.jpg";
import deviceCabinetScene from "@/assets/white-living-room.jpg";
import dividerScene from "@/assets/reading-corner.jpg";
import lowCabinetScene from "@/assets/white-living-room.jpg";
import mobileScreenScene from "@/assets/garden-dining-room.jpg";
import bedHeadStudio from "@/assets/sage-sideboard.jpg";
import bedsideStudio from "@/assets/balcony-doors.jpg";
import bookwallStudio from "@/assets/bright-living-room.jpg";
import coatStandStudio from "@/assets/white-living-room.jpg";
import consoleStudio from "@/assets/reading-corner.jpg";
import deskStudio from "@/assets/garden-dining-room.jpg";
import deviceCabinetStudio from "@/assets/a-frame-living-room.jpg";
import dividerStudio from "@/assets/afternoon-living-room.jpg";
import entryStudio from "@/assets/staircase-reading-corner.jpg";
import kitchenStudio from "@/assets/furniture-gallery.jpg";
import lowCabinetStudio from "@/assets/sage-sideboard.jpg";
import mobileScreenStudio from "@/assets/balcony-doors.jpg";
import sofaBackStudio from "@/assets/bright-living-room.jpg";
import workCartStudio from "@/assets/white-living-room.jpg";
import bedHeadScene from "@/assets/afternoon-living-room.jpg";
import bookwallScene from "@/assets/reading-corner.jpg";
import consoleScene from "@/assets/white-living-room.jpg";
import deskScene from "@/assets/garden-dining-room.jpg";
import entryScene from "@/assets/staircase-reading-corner.jpg";
import kitchenScene from "@/assets/a-frame-living-room.jpg";
import sofaBackScene from "@/assets/bright-living-room.jpg";
import workCartScene from "@/assets/furniture-gallery.jpg";

/**
 * The catalogue as the furniture record v2.0 (2026-10-13/14) sets it out,
 * read from personal_local/furnishes-landing (src/data/products.ts, claims.ts
 * and vocabulary.ts) and written fresh here:
 *
 * - launch: the three launch pieces, being made and tested now;
 * - soon: the eleven that follow, reusing a frame the launch pieces prove;
 * - uses: other uses of a piece (packs), shown with their piece;
 * - arrangements: pieces standing together, never a product of their own.
 *
 * Names are working names. No price, estimate or date is shown anywhere
 * until the launch pieces' samples, quotes and tests are done (CLAIMS).
 * Sizes in mm, width across the front × height × depth; `baseD` when a
 * steel base reaches deeper than the body.
 */

export type Status = "launch" | "soon";
export type FamilyId = "pieces" | "walls" | "screens";
export type UseId =
  | "entryway"
  | "work"
  | "bedroom"
  | "kitchen"
  | "living"
  | "dividing";
export type CategoryId = "organisers" | "storage" | "carts" | "dividers";
export type ActivityId =
  | "hang"
  | "set-down"
  | "store"
  | "display"
  | "work"
  | "divide"
  | "move";
export type ObjectId =
  | "bag-coat"
  | "keys-post"
  | "shoes"
  | "umbrella"
  | "headphones"
  | "laptop"
  | "cables"
  | "books"
  | "records"
  | "camera"
  | "phone-glasses"
  | "cups"
  | "jars"
  | "plants"
  | "tv-devices";
export type WidthId = "narrow" | "medium" | "wide";
export type KitTier = "first" | "after-test";

export type Product = {
  id: string;
  /** Its number in the furniture record. */
  record: string;
  status: Status;
  name: string;
  /** One sentence: what it is for. */
  line: string;
  category: CategoryId;
  family: FamilyId;
  size: { w: number; h: number; d: number; baseD?: number };
  uses: readonly UseId[];
  /** The normal price, once it is set; until then pages show CLAIMS.price.label. */
  price?: string;
  /** What it lets you do. */
  activities: readonly ActivityId[];
  /** The everyday things it has a place for. */
  objects: readonly ObjectId[];
  /** Everyday situations it answers, in the visitor's words. */
  situations: readonly string[];
  /** What to know before choosing it: open questions, tests, limits. */
  notes: readonly string[];
  /** What stands round it in its room render but is not included. */
  scene: string;
  /** On its own, on the studio's stone. */
  studio: StaticImageData;
  /** In its room. */
  room: StaticImageData;
};

/** Another use of a piece: a kit or a recipe on its parent. */
export type OtherUse = {
  id: string;
  record: string;
  name: string;
  line: string;
  parents: readonly string[];
  /** with-parent: follows its piece; testing: needs a test first. */
  state: "with-parent" | "testing";
  note: string;
  image: StaticImageData;
};

/** Pieces standing together. It has no price or page of its own. */
export type Arrangement = {
  id: string;
  record: string;
  name: string;
  line: string;
  members: readonly { product: string; count: number; note?: string }[];
  note: string;
  image: StaticImageData;
};

export const STATUS: Record<Status, { name: string; detail: string }> = {
  launch: {
    name: "Launch piece",
    detail:
      "One of the first three pieces, being made and tested now. Choose its version and save it. A price, what's in the box and ordering arrive once its samples, quotes and tests are done.",
  },
  soon: {
    name: "Coming soon",
    detail:
      "Comes after the launch pieces, reusing a frame they prove. Explore it, save it, and register interest. No price or date yet.",
  },
};

export const OTHER_USE_STATE: Record<OtherUse["state"], string> = {
  "with-parent": "Follows its piece",
  testing: "After testing",
};

export const FAMILIES: Record<FamilyId, { name: string; line: string }> = {
  pieces: {
    name: "Pieces",
    line: "Single pieces against a wall. By the door, beside the desk or the bed, in the kitchen.",
  },
  walls: {
    name: "Walls",
    line: "Segments that stand in the room. A line of shelves between two uses, both sides working.",
  },
  screens: {
    name: "Screens",
    line: "The function face on casters. A backdrop on one side, a working face on the other.",
  },
};

export const CATEGORIES: Record<CategoryId, string> = {
  organisers: "Organisers",
  storage: "Storage",
  carts: "Carts",
  dividers: "Screens and dividers",
};

/** What a piece lets you do; `fits` finishes "it …". */
export const ACTIVITIES: Record<ActivityId, { name: string; fits: string }> = {
  hang: { name: "Hang things up", fits: "has hooks or a rail" },
  "set-down": { name: "Set things down", fits: "has a top or a tray at hand" },
  store: { name: "Put things away", fits: "keeps things out of sight" },
  display: { name: "Show things", fits: "has shelves to show things" },
  work: { name: "Work or make", fits: "keeps tools at hand while you work" },
  divide: { name: "Divide a room", fits: "draws a line in a room" },
  move: { name: "Move it around", fits: "rolls to where it's needed" },
};

/** The everyday things a piece has a place for; `fits` names that place. */
export const OBJECTS: Record<ObjectId, { name: string; fits: string }> = {
  "bag-coat": { name: "Bag and coat", fits: "hooks for a bag and a coat" },
  "keys-post": { name: "Keys and post", fits: "a tray for keys and post" },
  shoes: { name: "Shoes", fits: "a shelf for shoes" },
  umbrella: { name: "Umbrella", fits: "a ring for the umbrella" },
  headphones: { name: "Headphones", fits: "somewhere for headphones" },
  laptop: { name: "Laptop and printer", fits: "room for a laptop or printer" },
  cables: { name: "Cables and chargers", fits: "a place for cables" },
  books: { name: "Books", fits: "shelves for books" },
  records: { name: "Records", fits: "room to show records" },
  camera: { name: "Camera and gear", fits: "a shelf for your gear" },
  "phone-glasses": {
    name: "Phone, glasses, a book",
    fits: "a top within reach",
  },
  cups: { name: "Cups", fits: "a place for cups" },
  jars: { name: "Jars and spices", fits: "room for jars" },
  plants: { name: "Plants", fits: "a top for a plant" },
  "tv-devices": { name: "Router and devices", fits: "a place for devices" },
};

/** Widths across the front, in mm, for "fits a width of". */
export const WIDTHS: Record<
  WidthId,
  { name: string; fits: (w: number) => boolean }
> = {
  narrow: { name: "Up to 60 cm", fits: (w) => w <= 600 },
  medium: { name: "61–120 cm", fits: (w) => w > 600 && w <= 1200 },
  wide: { name: "Over 120 cm", fits: (w) => w > 1200 },
};

export const USES: Record<UseId, string> = {
  entryway: "Entryway",
  work: "Work",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  living: "Living room",
  dividing: "Sharing a room",
};

/** Every statement that depends on a fact not settled yet. Pages read these; they make no promises of their own. */
export const CLAIMS = {
  price: {
    label: "Price not set yet",
    detail:
      "Prices come after factory quotes and conversations with real buyers. Until then we don't show a price or an estimate.",
  },
  delivery: {
    label: "Delivery and assembly to be confirmed",
    detail:
      "Pieces are planned to arrive flat-packed with their steps. Delivery, assembly help and timing are confirmed before you buy.",
  },
  stability: {
    label: "Widened base, counterweight and wall strap included",
    detail:
      "Pieces 1.2 m and taller that you hang things on come with a 60 cm deep steel base and a counterweight, and a wall strap in the box. Used within the stated hanging range they can stand without fixing. Fix them with the strap whenever you want. Tip-over tests are still to come.",
  },
  fit: {
    label: "Fit needs checking",
    detail:
      "Sizes are nominal. Skirting boards, doors and the way into the room are checked before you buy.",
  },
  renders: {
    label: "Room photographs",
    detail:
      "The rooms shown set the mood and are not our pieces. Real photographs of the pieces replace them once samples exist.",
  },
  leadTime: {
    label: "Timing not set yet",
    detail:
      "No lead time is given until the factory has quoted for the launch pieces.",
  },
  assembly: {
    label: "Steps from the modelling spec",
    detail:
      "Assembly steps come from the launch pieces' modelling spec (v0). Sizes marked as assumptions there are replaced as samples are made, so the final instructions may differ.",
  },
  parts: {
    label: "Parts from the modelling spec",
    detail:
      "Every part of a version comes from the modelling spec (v0). Sizes are nominal. Some are assumptions until the first samples are measured.",
  },
  hangingFace: {
    label: "Hanging face being chosen",
    detail:
      "Two ways to hang things are being compared on samples. Locking pegs in the thick board, or a thin perforated face on spacers. Until then the face is drawn plain.",
  },
  accent: {
    label: "Accent colour to be confirmed",
    detail:
      "Accessories and add-ons come in one agreed accent colour, shown here in orange. The final colour is chosen with the samples.",
  },
} as const;

export const MATERIALS = {
  body: "18 mm birch plywood. Large faces in a quiet white matte. The edges show the layers of the birch. Steel for the base, legs and hidden hardware.",
  open: "White laminate and white paint are still being compared on samples.",
};

/** What the parts are made of, from the modelling spec (CLAIMS.parts). */
export const PART_MATERIALS: readonly { material: string; parts: string }[] = [
  {
    material: "Birch plywood",
    parts: "Sides, base beam, face panels, tops, shelves, desk top",
  },
  {
    material: "Powder-coated steel",
    parts:
      "Widened base with 4 levelling feet, leg frames, desk leg, coat hooks, umbrella ring",
  },
  {
    material: "Steel",
    parts:
      "Counterweight plate (about 10 kg), heavy brackets, stiffening tube, cable tray, pen pot, bookend",
  },
  { material: "Anodised aluminium", parts: "Rail" },
  {
    material: "Under test",
    parts:
      "Hanging face. Perforated plywood or powder-coated steel",
  },
];

/** An add-on kit for a launch piece: what it adds, and what it takes off. */
export type Kit = {
  id: string;
  name: string;
  /** The launch pieces it fits. */
  applies: readonly string[];
  tier: KitTier;
  adds: readonly string[];
  removes: readonly string[];
  line: string;
};

export const KIT_TIER: Record<KitTier, { name: string; detail: string }> = {
  first: { name: "Sold first", detail: "Planned with its launch piece." },
  "after-test": {
    name: "After a test",
    detail: "Shown now. Offered once its test is passed.",
  },
};

/** The add-on kits (K-D5, a fold-down standing top, is research and not shown). */
export const KITS: readonly Kit[] = [
  {
    id: "K-E1",
    name: "Change to the desk-side pack",
    applies: ["entry"],
    tier: "first",
    adds: ["2 full-depth shelves", "Desk-side accessory pack"],
    removes: [
      "Slanted shoe shelf",
      "Narrow shelf",
      "Hanging face",
      "Entry accessory pack",
    ],
    line: "Same frame, another pack. The parts taken off are yours to keep for changing back.",
  },
  {
    id: "K-E2",
    name: "A second segment beside it",
    applies: ["entry"],
    tier: "first",
    adds: ["A complete second function face", "4 joining bolts"],
    removes: [],
    line: "Two entry faces side by side, bolted together.",
  },
  {
    id: "K-E3",
    name: "Door on the lower tier",
    applies: ["entry"],
    tier: "first",
    adds: ["1 door, hinges fitted"],
    removes: [],
    line: "Hides the shoes. Clips into hinge bases fitted at the factory.",
  },
  {
    id: "K-E4",
    name: "Drawer module",
    applies: ["entry", "desk"],
    tier: "first",
    adds: ["1 drawer module"],
    removes: [],
    line: "Sits on the shelf-pin rows.",
  },
  {
    id: "K-E5",
    name: "Fabric face panels",
    applies: ["entry", "desk"],
    tier: "first",
    adds: ["1 to 3 face panels in fabric"],
    removes: ["The solid face panels they replace"],
    line: "The faces slide out from the top and new ones slide in.",
  },
  {
    id: "K-E6",
    name: "Mirror",
    applies: ["entry"],
    tier: "after-test",
    adds: ["Safety mirror", "2 heavy brackets"],
    removes: [],
    line: "Fixes to structural inserts, not the hanging face.",
  },
  {
    id: "K-E7",
    name: "Shoe bench",
    applies: ["entry"],
    tier: "after-test",
    adds: ["A low block", "Thick seat board", "Cushion"],
    removes: [],
    line: "Needs a seating strength test first.",
  },
  {
    id: "K-E8",
    name: "Caster base",
    applies: ["entry", "desk"],
    tier: "after-test",
    adds: ["Caster base with brakes", "Counterweight"],
    removes: ["Widened base"],
    line: "Turns it into the mobile screen. Needs a dynamic stability test first.",
  },
  {
    id: "K-D1",
    name: "Desk top kit",
    applies: ["desk"],
    tier: "first",
    adds: [
      "Desk top 120 × 60 × 2.5 cm",
      "2 heavy brackets",
      "Full-height steel leg",
      "Stiffening tube",
    ],
    removes: [],
    line: "A desk of its own. The top locks to brackets on the face and stands on a steel leg.",
  },
  {
    id: "K-D2",
    name: "Aluminium rail",
    applies: ["desk"],
    tier: "first",
    adds: ["Aluminium rail", "2 brackets"],
    removes: [],
    line: "For heavier things or things you take down often.",
  },
  {
    id: "K-D3",
    name: "Monitor arm bracket",
    applies: ["desk"],
    tier: "after-test",
    adds: ["Heavy bracket", "Your own monitor arm"],
    removes: [],
    line: "Needs the desk top kit or a second segment, and a test.",
  },
  {
    id: "K-D4",
    name: "Change to the entry pack",
    applies: ["desk"],
    tier: "first",
    adds: [
      "Slanted shoe shelf",
      "Narrow shelf",
      "Hanging face",
      "Entry accessory pack",
    ],
    removes: ["2 full-depth shelves", "Desk-side accessory pack"],
    line: "Same frame, another pack. The parts taken off are yours to keep.",
  },
  {
    id: "K-B1",
    name: "Stack one tier (80 cm bedside)",
    applies: ["bedside"],
    tier: "after-test",
    adds: ["2 sides with joining plates", "1 face panel"],
    removes: [],
    line: "Stacking is tested first. At most three tiers.",
  },
  {
    id: "K-B2",
    name: "Stack two tiers (small cabinet)",
    applies: ["bedside"],
    tier: "after-test",
    adds: ["4 sides with joining plates", "2 face panels", "Wall strap"],
    removes: [],
    line: "Three tiers need the wall strap. Tested first.",
  },
  {
    id: "K-B3",
    name: "Caster base",
    applies: ["bedside"],
    tier: "first",
    adds: ["Caster base with brakes"],
    removes: ["Steel leg frame"],
    line: "Rolls to the sofa as a side table.",
  },
  {
    id: "K-B4",
    name: "Join two blocks",
    applies: ["bedside"],
    tier: "first",
    adds: ["4 joining bolts"],
    removes: [],
    line: "Two blocks side by side as one low cabinet bay. Needs a quantity of 2.",
  },
  {
    id: "K-B5",
    name: "Drawer or door",
    applies: ["bedside"],
    tier: "first",
    adds: ["A drawer module or a door"],
    removes: [],
    line: "Closes the lower shelf.",
  },
];

export const PRODUCTS: readonly Product[] = [
  {
    id: "entry",
    record: "1.1",
    status: "launch",
    name: "Function face, entry pack",
    line: "Hooks, a key tray and a slanted shoe shelf. A place by the door for what you carry in and out.",
    category: "organisers",
    family: "pieces",
    size: { w: 600, h: 1278, d: 400, baseD: 600 },
    uses: ["entryway"],
    activities: ["hang", "set-down"],
    objects: ["bag-coat", "keys-post", "shoes", "umbrella"],
    situations: [
      "Coats and bags pile up on the chair by the door",
      "Keys, post and the umbrella have no place",
    ],
    notes: [
      "Depth is being compared at about 30 and 40 cm with full-size models in real homes. A 30 cm version would only be offered fixed to a wall.",
      "Comes with a widened steel base and counterweight, and a wall strap in the box.",
    ],
    scene: "Shoes, the bag, the door and the basket are not included.",
    studio: entryStudio,
    room: entryScene,
  },
  {
    id: "desk",
    record: "1.2",
    status: "launch",
    name: "Function face, desk-side pack",
    line: "Keep the desk you like. Shelves, a cable tray and a pen pot stand beside it, on their own.",
    category: "organisers",
    family: "pieces",
    size: { w: 600, h: 1278, d: 400, baseD: 600 },
    uses: ["work"],
    activities: ["store", "display", "work"],
    objects: ["headphones", "laptop", "cables", "books", "camera"],
    situations: [
      "Tools and cables take over the desk",
      "A desk I like, with nowhere to put things beside it",
    ],
    notes: [
      "Stands on its own. It doesn't lean on your desk.",
      "An aluminium rail is optional, for things you hang and take down often.",
    ],
    scene: "The desk, chair, laptop and books are yours, not included.",
    studio: deskStudio,
    room: deskScene,
  },
  {
    id: "bedside",
    record: "1.3",
    status: "launch",
    name: "Bedside block",
    line: "A top within reach, a shallow tray for the charger and a quiet shelf below.",
    category: "storage",
    family: "pieces",
    size: { w: 600, h: 568, d: 400 },
    uses: ["bedroom"],
    activities: ["set-down", "store"],
    objects: ["phone-glasses", "books", "cups"],
    situations: ["Phone and book on the floor by the bed"],
    notes: [
      "Finished height is about 57 cm, to be confirmed with full-size models beside real beds.",
    ],
    scene: "The bed, lamp, cup and books are not included.",
    studio: bedsideStudio,
    room: bedsideScene,
  },
  {
    id: "kitchen",
    record: "1.4",
    status: "soon",
    name: "Kitchen prep cart",
    line: "A little more counter, close to where you cook, that rolls back to its place.",
    category: "carts",
    family: "pieces",
    size: { w: 600, h: 800, d: 400 },
    uses: ["kitchen"],
    activities: ["set-down", "move", "work"],
    objects: ["jars", "cups"],
    situations: ["The counter is too short when I cook"],
    notes: [
      "We still have to show what it does better than a simple ready-made trolley.",
    ],
    scene: "Jars, board, towel and plant are not included.",
    studio: kitchenStudio,
    room: kitchenScene,
  },
  {
    id: "work-cart",
    record: "1.6",
    status: "soon",
    name: "Work side cart",
    line: "Printer, paper and tools on two tiers, rolled up beside the desk.",
    category: "carts",
    family: "pieces",
    size: { w: 600, h: 800, d: 400 },
    uses: ["work"],
    activities: ["work", "move", "store"],
    objects: ["laptop", "cables", "camera"],
    situations: ["The printer lives on the floor"],
    notes: [
      "A neighbouring choice to the desk-side pack. Compare footprint, reach and moving it.",
    ],
    scene: "The desk, laptop and books are not included.",
    studio: workCartStudio,
    room: workCartScene,
  },
  {
    id: "low-cabinet",
    record: "1.10",
    status: "soon",
    name: "Low cabinet",
    line: "Segments under one long top. Records out, devices and boxes behind doors.",
    category: "storage",
    family: "pieces",
    size: { w: 1800, h: 800, d: 400 },
    uses: ["living"],
    activities: ["store", "display", "set-down"],
    objects: ["records", "tv-devices", "books", "plants"],
    situations: ["Cables and boxes under the TV"],
    notes: ["A long top across segments needs a support at every segment."],
    scene: "The TV, lamp, books and plant are not included.",
    studio: lowCabinetStudio,
    room: lowCabinetScene,
  },
  {
    id: "device-cabinet",
    record: "1.14",
    status: "soon",
    name: "Device cabinet",
    line: "The router and the chargers behind a door, with room for the cables to come out.",
    category: "storage",
    family: "pieces",
    size: { w: 600, h: 800, d: 400 },
    uses: ["living", "work"],
    activities: ["store"],
    objects: ["tv-devices", "cables"],
    situations: ["The router and all the chargers"],
    notes: [
      "How far a pull-out shelf can reach, and what the devices weigh, is still to be tested.",
    ],
    scene: "The router, boxes and plant are not included.",
    studio: deviceCabinetStudio,
    room: deviceCabinetScene,
  },
  {
    id: "console",
    record: "1.16",
    status: "soon",
    name: "Entry console",
    line: "A waist-high top by the door for post, keys and a plant.",
    category: "storage",
    family: "pieces",
    size: { w: 1200, h: 800, d: 400 },
    uses: ["entryway"],
    activities: ["set-down", "store"],
    objects: ["keys-post", "plants", "shoes"],
    situations: ["Post and keys need somewhere by the door"],
    notes: [
      "A mirror would fix to structural inserts, never to the light hanging face.",
    ],
    scene: "The door, bowl, post and plant are not included.",
    studio: consoleStudio,
    room: consoleScene,
  },
  {
    id: "coat-stand",
    record: "1.17",
    status: "soon",
    name: "Coat stand",
    line: "One full-height segment with a rail. Every coat off the chair.",
    category: "organisers",
    family: "pieces",
    size: { w: 600, h: 1600, d: 400 },
    uses: ["entryway", "bedroom"],
    activities: ["hang"],
    objects: ["bag-coat", "shoes"],
    situations: ["No hallway. Coats land on the chair by the door"],
    notes: [
      "Offered after tests with coats hung unevenly, including a tip-over test.",
    ],
    scene: "The coats, bag and basket are not included.",
    studio: coatStandStudio,
    room: coatStandScene,
  },
  {
    id: "divider",
    record: "2.1",
    status: "soon",
    name: "Second-bedroom divider",
    line: "A straight line of shelves that turns one room into two, with a side for each.",
    category: "dividers",
    family: "walls",
    size: { w: 1200, h: 1600, d: 400 },
    uses: ["bedroom", "dividing"],
    activities: ["divide", "display"],
    objects: ["books", "plants"],
    situations: ["Two people share one room, with no line between them"],
    notes: [
      "Which side panels it uses is decided by a sideways-sway test.",
      "A visual divider, not a sound barrier.",
    ],
    scene: "The books, basket and rug are not included.",
    studio: dividerStudio,
    room: dividerScene,
  },
  {
    id: "sofa-back",
    record: "2.2",
    status: "soon",
    name: "Behind-the-sofa divider",
    line: "Low segments behind the sofa. A shelf on one side, a long top on the other.",
    category: "dividers",
    family: "walls",
    size: { w: 1800, h: 1250, d: 400 },
    uses: ["living", "dividing"],
    activities: ["divide", "display", "set-down"],
    objects: ["books", "cups", "plants"],
    situations: ["The sofa has its back to the whole room"],
    notes: ["The 1.8 m top needs a support at every segment."],
    scene: "The books, lamp and plant are not included.",
    studio: sofaBackStudio,
    room: sofaBackScene,
  },
  {
    id: "bookwall",
    record: "2.9",
    status: "soon",
    name: "Double-sided bookshelf wall",
    line: "Books on one side, records on the other. A wall you can use from both.",
    category: "dividers",
    family: "walls",
    size: { w: 1200, h: 1600, d: 400 },
    uses: ["living", "dividing"],
    activities: ["divide", "display"],
    objects: ["books", "records", "camera"],
    situations: ["Books and records with no wall to live on"],
    notes: [
      "The two narrow shelves leave about 2 mm to spare. The drawings are being checked.",
      "A visual divider, not a sound barrier.",
    ],
    scene: "The books, chair and plant are not included.",
    studio: bookwallStudio,
    room: bookwallScene,
  },
  {
    id: "bed-head",
    record: "2.12",
    status: "soon",
    name: "Bed-head divider",
    line: "Segments behind the bed. A soft face toward the pillows, storage on the other side.",
    category: "dividers",
    family: "walls",
    size: { w: 1200, h: 1200, d: 400 },
    uses: ["bedroom", "dividing"],
    activities: ["divide", "set-down"],
    objects: ["phone-glasses", "books"],
    situations: ["The bed and the living room are the same room"],
    notes: [
      "Whether the fabric face is its own panel is still open.",
      "It stands on its own. The bed is not what keeps it upright.",
    ],
    scene: "The bed, lamp and books are not included.",
    studio: bedHeadStudio,
    room: bedHeadScene,
  },
  {
    id: "mobile-screen",
    record: "3.1",
    status: "soon",
    name: "Mobile screen",
    line: "The function face on a caster base. A backdrop on one side, hooks and shelves on the other.",
    category: "dividers",
    family: "screens",
    size: { w: 600, h: 1200, d: 400 },
    uses: ["work", "dividing"],
    activities: ["divide", "hang", "move", "work"],
    objects: ["headphones", "camera", "bag-coat"],
    situations: ["A screen between two desks"],
    notes: [
      "Offered after a dynamic stability test on its caster base.",
      "A visual divider, not a sound barrier.",
    ],
    scene: "The desk, chair, laptop and plant are not included.",
    studio: mobileScreenStudio,
    room: mobileScreenScene,
  },
];

export const OTHER_USES: readonly OtherUse[] = [
  {
    id: "coffee",
    record: "1.9",
    name: "Coffee corner and plant stand",
    line: "Cups on hooks, the machine at the right height, beans below.",
    parents: ["entry", "desk"],
    state: "with-parent",
    note: "Water, heat and power are checked for each setting.",
    image: coffeeObject,
  },
  {
    id: "spice-face",
    record: "1.5",
    name: "Spice face",
    line: "An upstand on the top for jars and spices.",
    parents: ["bedside", "kitchen"],
    state: "testing",
    note: "Upstand kit. Offered after testing.",
    image: spiceFaceObject,
  },
  {
    id: "bath-cart",
    record: "1.7",
    name: "Bathroom and laundry cart",
    line: "Towels on the rail, bottles on the tray, the basket below.",
    parents: ["kitchen"],
    state: "testing",
    note: "Damp rooms need their own check first.",
    image: bathCartObject,
  },
  {
    id: "tv-cabinet",
    record: "1.15",
    name: "TV cabinet",
    line: "A back panel standing up from the top to carry the TV and its cables.",
    parents: ["low-cabinet"],
    state: "testing",
    note: "TV panel kit. Offered after testing.",
    image: tvCabinetObject,
  },
  {
    id: "drop-leaf",
    record: "4.1",
    name: "Fold-down worktop and end panel",
    line: "A top that folds down to work at and folds back up.",
    parents: ["low-cabinet", "divider"],
    state: "with-parent",
    note: "Needs its leg when folded down. The end panel carries no load.",
    image: dropLeafObject,
  },
  {
    id: "grille",
    record: "2.16",
    name: "Grille face",
    line: "An open lattice in the upper tier, so light and a look get through.",
    parents: ["divider"],
    state: "testing",
    note: "Face option. The change in stiffness has to be checked.",
    image: grilleObject,
  },
  {
    id: "opening",
    record: "2.19",
    name: "Face with an opening",
    line: "One face left open, to look through or pass a cup.",
    parents: ["divider"],
    state: "testing",
    note: "Face option. Stiffness without the face has to be checked.",
    image: openingObject,
  },
  {
    id: "record-wall",
    record: "2.24",
    name: "Record display",
    line: "Tilted boards for covers and dividers between them.",
    parents: ["bookwall"],
    state: "with-parent",
    note: "Tilted boards and dividers on the shelf-pin rows.",
    image: recordWallObject,
  },
  {
    id: "video-background",
    record: "3.4",
    name: "Video backdrop",
    line: "The quiet side behind you on calls. The light and the tablet on the other.",
    parents: ["mobile-screen"],
    state: "with-parent",
    note: "At 1.2 m it suits calls taken sitting down.",
    image: videoBackgroundObject,
  },
  {
    id: "standing-desk",
    record: "3.5",
    name: "Standing work screen",
    line: "A fold-down top on the working side, a whiteboard above it.",
    parents: ["mobile-screen"],
    state: "with-parent",
    note: "The fold-down top needs its leg.",
    image: standingDeskObject,
  },
  {
    id: "fitting",
    record: "3.6",
    name: "Fitting screen",
    line: "A full-length mirror on one side, hooks on the other.",
    parents: ["mobile-screen"],
    state: "testing",
    note: "Full-height safety mirror. Offered after testing.",
    image: fittingObject,
  },
  {
    id: "bed-screen",
    record: "3.7",
    name: "Bed screen",
    line: "Between the bed and the rest of the room, with nothing sticking out on the bed side.",
    parents: ["mobile-screen"],
    state: "with-parent",
    note: "It doesn't rely on the bed to stand.",
    image: bedScreenObject,
  },
  {
    id: "kitchen-screen",
    record: "3.9",
    name: "Kitchen prep screen",
    line: "A wipe-clean face beside the counter. Knives on the strip, cloth on the rail.",
    parents: ["mobile-screen"],
    state: "with-parent",
    note: "The 1.2 m top is not a prep surface.",
    image: kitchenScreenObject,
  },
  {
    id: "tool-screen",
    record: "3.10",
    name: "Tool and whiteboard screen",
    line: "Tools on one side, a whiteboard on the other.",
    parents: ["mobile-screen"],
    state: "with-parent",
    note: "Built on two mobile screens joined into one double unit.",
    image: toolScreenObject,
  },
];

export const ARRANGEMENTS: readonly Arrangement[] = [
  {
    id: "island",
    record: "1.11",
    name: "Island from two carts",
    line: "Two kitchen carts under one long top.",
    members: [{ product: "kitchen", count: 2 }],
    note: "Plus one long top. The carts' own two tops are set aside, and counted.",
    image: islandObject,
  },
  {
    id: "strip",
    record: "1.18",
    name: "Long mixed strip",
    line: "Low, middle and tall segments along one wall, each standing on its own first.",
    members: [
      { product: "low-cabinet", count: 1 },
      { product: "entry", count: 1 },
      { product: "coat-stand", count: 1 },
    ],
    note: "Layout and seat height are not settled.",
    image: stripObject,
  },
  {
    id: "shape-l",
    record: "2.3",
    name: "L arrangement",
    line: "One segment along, one across. A corner where there was none.",
    members: [
      { product: "divider", count: 1, note: "two segments, one turned" },
    ],
    note: "What the corner piece does is still to be defined.",
    image: shapeLObject,
  },
  {
    id: "shape-u",
    record: "2.4",
    name: "U arrangement",
    line: "Three segments around a place to read or work, open on one side.",
    members: [{ product: "divider", count: 1, note: "three segments" }],
    note: "Arrangement only. A version with a seat is not offered.",
    image: shapeUObject,
  },
  {
    id: "shape-t-plain",
    record: "2.5",
    name: "T arrangement",
    line: "One segment meets the middle of another. Both sides get a face.",
    members: [{ product: "divider", count: 1, note: "two segments" }],
    note: "The joint in the middle is not resolved yet.",
    image: shapeTPlainObject,
  },
  {
    id: "steps",
    record: "2.6",
    name: "Stepped line",
    line: "Segments of different heights in a row, low end to high end.",
    members: [{ product: "divider", count: 1, note: "three segments" }],
    note: "Arrangement only.",
    image: stepsObject,
  },
  {
    id: "workstation-wall",
    record: "2.11",
    name: "Workstation wall",
    line: "A divider with a desk top on one side.",
    members: [
      { product: "divider", count: 1 },
      { product: "desk", count: 1, note: "desk top kit with its steel leg" },
    ],
    note: "The far end of the top stands on a steel leg assembly.",
    image: workstationWallObject,
  },
  {
    id: "shape-z",
    record: "2.17",
    name: "Z arrangement",
    line: "Two turns. Display on one side, storage on the other.",
    members: [{ product: "divider", count: 1, note: "three segments" }],
    note: "Not yet tested for stability.",
    image: shapeZObject,
  },
  {
    id: "offset",
    record: "2.18",
    name: "Offset line",
    line: "Two segments stepped past each other, so the wall has a fold.",
    members: [{ product: "divider", count: 1, note: "two segments" }],
    note: "The offset piece is not designed yet.",
    image: offsetObject,
  },
  {
    id: "wheeled-partition",
    record: "2.20",
    name: "Wheeled partition",
    line: "Two function faces on casters, as one partition that moves.",
    members: [{ product: "mobile-screen", count: 2 }],
    note: "Needs a whole-unit dynamic test.",
    image: wheeledPartitionObject,
  },
  {
    id: "two-desks",
    record: "2.22",
    name: "Two-person workstation",
    line: "A T of segments with a desk top on each side, back to back.",
    members: [
      { product: "divider", count: 1, note: "T of segments" },
      { product: "desk", count: 2, note: "desk top kits" },
    ],
    note: "Arrangement only.",
    image: twoDesksObject,
  },
  {
    id: "shape-t",
    record: "2.23",
    name: "Bed head with two bedsides",
    line: "A bed-head segment with a bedside block on each side.",
    members: [
      { product: "bed-head", count: 1 },
      { product: "bedside", count: 2 },
    ],
    note: "The joining height is still to be drawn.",
    image: shapeTObject,
  },
  {
    id: "phone-booth",
    record: "2.29",
    name: "Phone-booth work corner",
    line: "Three 1.2 m segments around a desk top, with a curtain.",
    members: [
      { product: "bed-head", count: 1, note: "three 1.2 m segments" },
      { product: "desk", count: 1, note: "desk top kit" },
    ],
    note: "The desk top is supported at sitting height, never on the 1.2 m tops. Not soundproof.",
    image: phoneBoothObject,
  },
  {
    id: "double",
    record: "3.2",
    name: "Two-unit mobile screen",
    line: "Two mobile screens joined. A longer wall that still rolls.",
    members: [{ product: "mobile-screen", count: 2 }],
    note: "Moving joined and moving apart are different states.",
    image: doubleObject,
  },
];

/** A search's words: two letters or more, split at spaces and commas. */
export const searchWords = (q: string) =>
  q
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((w) => w.length > 1);

/** Whether every word of a search (two letters or more) appears in what the piece is called, is for or holds. */
export function matchesSearch(p: Product, q: string) {
  const words = searchWords(q);
  const hay = [
    p.name,
    p.line,
    CATEGORIES[p.category],
    ...p.uses.map((u) => USES[u]),
    ...p.activities.map((a) => ACTIVITIES[a].name),
    ...p.objects.map((o) => OBJECTS[o].name),
    ...p.situations,
  ]
    .join(" ")
    .toLowerCase();
  return words.every((w) => hay.includes(w));
}

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

/** How many designs the catalogue holds: products, other uses and arrangements. */
/** A product's name, by its id. */
export const productName = (id: string) => productById(id)?.name ?? id;

export const DESIGN_COUNT =
  PRODUCTS.length + OTHER_USES.length + ARRANGEMENTS.length;

/** "60 × 127.8 × 40 cm": width × height × depth. */
export const sizeLabel = ({ w, h, d }: Product["size"]) =>
  `${w / 10} × ${h / 10} × ${d / 10} cm`;
