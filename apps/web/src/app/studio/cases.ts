/**
 * The everyday cases under the tour, from the brand story's scenes (Brand &
 * Product Story v1.1, chapter 03, with each scene's call from chapter 05): a
 * corner of a home, the things that gather there and what the furniture does
 * for them. No figures: the story gives none it will stand behind. `span`:
 * what the case runs between, set on its dimension line. `room`: the room
 * photo (rooms.ts, by its plan room) that comes up behind it, a stand-in
 * till the product's own photos are taken.
 */
export const CASES: readonly {
  kind: string;
  span: string;
  title: string;
  body: string;
  call: string;
  room: string;
}[] = [
  {
    kind: "The entryway",
    span: "Bag, coat, keys",
    title: "Give that chair back.",
    body: "Bags, coats and the odd parcel pile up by the door. A place to hang and a place to drop, made as one piece rather than a few add-ons, means less looking on the way out.",
    call: "A place for each thing",
    room: "hall",
  },
  {
    kind: "The bedside",
    span: "Book, glasses, lamp",
    title: "What you use, within reach.",
    body: "A book, glasses, water, the phone and the lamp need not crowd one small top. Open to reach, closed to keep it calm, at the height of your bed.",
    call: "Bring it a little closer",
    room: "bedroom2",
  },
  {
    kind: "The workspace",
    span: "Tools to cables",
    title: "A desk that grows its own way.",
    body: "Tools in sight and ready, or a clear top with the cables tucked away, or work beside the things you collect: arranged for how you work.",
    call: "Find your way of working",
    room: "bedroom3",
  },
  {
    kind: "The kitchen",
    span: "Prep to clear-up",
    title: "Close to what you are doing.",
    body: "One more surface while you cook, a place for the things you reach for, and a cart that follows you half a step to the sink.",
    call: "One more place to prepare",
    room: "kitchen",
  },
];
