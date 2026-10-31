/**
 * The ideas on the inspiration page, each set out as a sheet: the room on an
 * example HDB plan, and a mood photo (studio/rooms.ts) that is not of our
 * pieces. Concepts, not finished jobs. `view`: which side of the sheet shows first.
 */
export const PROJECTS: readonly {
  slug: string;
  title: string;
  body: string;
  room: string;
  view: "plan" | "photo";
}[] = [
  {
    slug: "living-dining",
    title: "Living and dining",
    body: "Turn the sofa to face the window. Let one long low unit take the TV, the books and the router.",
    room: "living",
    view: "photo",
  },
  {
    slug: "kitchen",
    title: "Kitchen",
    body: "A second surface on casters that rolls out to the hob when two people cook.",
    room: "kitchen",
    view: "plan",
  },
  {
    slug: "study",
    title: "Study",
    body: "A desk along the window wall, its cables run in the back rail, and shelves above it to the ceiling.",
    room: "bedroom3",
    view: "photo",
  },
  {
    slug: "master-bedroom",
    title: "Master bedroom",
    body: "Keep the window seat. A bench at the foot of the bed could take the clothes that never reach the wardrobe.",
    room: "master",
    view: "plan",
  },
  {
    slug: "reading-room",
    title: "Reading room",
    body: "Make the second bedroom a reading room. Two low chairs, a lamp between them, books where the bed was.",
    room: "bedroom2",
    view: "photo",
  },
  {
    slug: "hall",
    title: "Hall",
    body: "Give shoes, bags and the bicycle one wall by the door, so the hall stays a way through.",
    room: "hall",
    view: "plan",
  },
];
