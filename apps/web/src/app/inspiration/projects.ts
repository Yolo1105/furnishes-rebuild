/**
 * The projects on the inspiration page, each set out as a sheet: the room
 * on the showcase flat's plan as we drew it, and its photo as built. All of
 * them stand-ins, in the showcase flat's rooms (a key of ROOMS in
 * features/plan/flat) and with the studio's room photos (studio/rooms.ts),
 * till real projects are photographed. `view`: which side of the sheet shows
 * first. `place`: the estate it stands for.
 */
export const PROJECTS: readonly {
  slug: string;
  title: string;
  body: string;
  place: string;
  room: string;
  view: "drawn" | "built";
}[] = [
  {
    slug: "tampines-living-dining",
    title: "Tampines living and dining",
    body: "The sofa turned to face the window. One long low unit takes the TV, the books and the router.",
    place: "Tampines",
    room: "living",
    view: "built",
  },
  {
    slug: "punggol-kitchen",
    title: "Punggol kitchen",
    body: "A second surface on castors parks under the counter and rolls out to the hob when two people cook.",
    place: "Punggol",
    room: "kitchen",
    view: "drawn",
  },
  {
    slug: "bishan-study",
    title: "Bishan study",
    body: "A desk along the window wall, its cables run in the back rail, and shelves above it to the ceiling.",
    place: "Bishan",
    room: "bedroom3",
    view: "built",
  },
  {
    slug: "queenstown-master-bedroom",
    title: "Queenstown master bedroom",
    body: "The window seat kept. A bench at the foot of the bed takes the clothes that never reach the wardrobe.",
    place: "Queenstown",
    room: "master",
    view: "drawn",
  },
  {
    slug: "sengkang-reading-room",
    title: "Sengkang reading room",
    body: "The second bedroom as a reading room. Two low chairs, a lamp between them, books where the bed was.",
    place: "Sengkang",
    room: "bedroom2",
    view: "built",
  },
  {
    slug: "toa-payoh-hall",
    title: "Toa Payoh hall",
    body: "Shoes, bags and the bicycle given one wall by the door, so the hall stays a way through.",
    place: "Toa Payoh",
    room: "hall",
    view: "drawn",
  },
];
