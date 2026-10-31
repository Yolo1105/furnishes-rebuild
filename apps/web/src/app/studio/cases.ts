/**
 * The everyday cases under the tour, from the brand story's scenes (Brand &
 * Product Story v1.1, chapter 03): a
 * corner of a home, the things that gather there and what the furniture does
 * for them. No figures: the story gives none it will stand behind. `span`:
 * what the case runs between. `room`: the room
 * photo (rooms.ts, by its plan room) at the top of its card, a stand-in
 * till the product's own photos are taken. `piece`: the catalogue piece its call leads to.
 */
export const CASES: readonly {
  kind: string;
  span: string;
  title: string;
  body: string;
  room: string;
  piece: string;
}[] = [
  {
    kind: "The entryway",
    span: "Bag, coat, keys",
    title: "Give that chair back.",
    body: "Bags, coats and the odd parcel pile up by the door. A place to hang and a place to drop, made as one piece rather than a few add-ons, means less looking on the way out.",
    room: "hall",
    piece: "entry",
  },
  {
    kind: "The bedside",
    span: "Book, glasses, lamp",
    title: "What you use, within reach.",
    body: "A book, glasses, water, the phone and the lamp need not crowd one small top. Open to reach, closed to keep it calm, at the height of your bed.",
    room: "bedroom2",
    piece: "bedside",
  },
  {
    kind: "The workspace",
    span: "Tools to cables",
    title: "A desk that grows its own way.",
    body: "Tools in sight and ready, or a clear top with the cables tucked away, or work beside the things you collect, arranged for how you work.",
    room: "bedroom3",
    piece: "desk",
  },
  {
    kind: "The kitchen",
    span: "Prep to clear-up",
    title: "Close to what you are doing.",
    body: "One more surface while you cook, a place for the things you reach for, and a cart that follows you half a step to the sink.",
    room: "kitchen",
    piece: "kitchen",
  },
];
