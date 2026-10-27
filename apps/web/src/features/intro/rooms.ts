import type { IntroPhoto } from "./PhotoIntro";
import aFrame from "../../../public/rooms/a-frame-living-room.jpg";
import bright from "../../../public/rooms/bright-living-room.jpg";
import banner1 from "../../../public/rooms/landing-banner-1.jpg";
import banner2 from "../../../public/rooms/landing-banner-2.jpg";
import main2 from "../../../public/rooms/landing-main-2.jpg";

/** The rooms the landing's opening turns through, the dining room first: what each is, and the inks that read under the bar, the title and the small words. */
export const ROOMS: IntroPhoto[] = [
  { src: banner2, caption: "Dining room by the water", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: banner1, caption: "Living room, afternoon sun", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: main2, caption: "Reading corner", ink: { bar: "cream", title: "cream", small: "cream" } },
  { src: bright, caption: "Living room, garden side", ink: { bar: "rust", title: "rust", small: "rust" } },
  { src: aFrame, caption: "A-frame living room", ink: { bar: "rust", title: "rust", small: "rust" } },
];

