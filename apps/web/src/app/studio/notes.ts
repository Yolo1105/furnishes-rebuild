/**
 * The journal's latest notes, after the packages. Stand-in copy till the
 * journal is written; the journal lives on the About page. `room`: the room photo
 * (rooms.ts, by its plan room) shown over each, a stand-in till the notes
 * have their own photos.
 */
export const JOURNAL: readonly {
  topic: string;
  minutes: number;
  date: string;
  title: string;
  body: string;
  room: string;
}[] = [
  {
    topic: "Sourcing",
    minutes: 3,
    date: "2026-09-02",
    title: "Lead times right now",
    body: "Upholstery is running ten to fourteen weeks, custom cabinetry eight to twelve, and stone is back to normal. Updated each quarter.",
    room: "shelter",
  },
  {
    topic: "Working with us",
    minutes: 3,
    date: "2026-08-14",
    title: "What a single room plan actually gets you",
    body: "A line-by-line look at one kitchen plan: what we drew, what we specified, and what the owners did themselves.",
    room: "kitchen",
  },
  {
    topic: "Working with us",
    minutes: 3,
    date: "2026-07-22",
    title: "Five questions to ask before you sign",
    body: "Fee structure, who orders the furniture, what happens if something arrives damaged, and two more worth asking.",
    room: "living",
  },
];
