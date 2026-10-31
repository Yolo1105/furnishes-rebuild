import type { StaticImageData } from "next/image";
import { marked } from "@/lib/facts";

/**
 * The swatches, after the makers: stand-in copy and drawn textures till the
 * real samples are photographed. `texture`: the drawn stand-in
 * (Swatches.module.css); a `photo` shows in its place once there is one.
 */
export const SWATCH_HEADLINE = { lead: "See the finish.", soft: "Then decide." };

export const SWATCH_LINE = "Pieces come in white matte faces and birch edges today, and you can ask to see samples before you decide. The finishes shown here are not on sale yet: they are the ones we are looking at next.";

export const SWATCHES: readonly {
  name: string;
  texture: "oiledOak" | "smokedOak" | "cane" | "linen" | "boucle" | "wool";
  photo?: StaticImageData;
}[] = [
  { name: marked("finishList", "Oiled oak"), texture: "oiledOak" },
  { name: marked("finishList", "Smoked oak"), texture: "smokedOak" },
  { name: marked("finishList", "Woven cane"), texture: "cane" },
  { name: marked("finishList", "Natural linen"), texture: "linen" },
  { name: marked("finishList", "Oat bouclé"), texture: "boucle" },
  { name: marked("finishList", "Pepper wool"), texture: "wool" },
];
