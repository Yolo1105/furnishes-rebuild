import type { StaticImageData } from "next/image";

/**
 * The swatches, after the makers: stand-in copy and drawn textures till the
 * real samples are photographed. `texture`: the drawn stand-in
 * (Swatches.module.css); a `photo` shows in its place once there is one.
 */
export const SWATCH_HEADLINE = { lead: "Six swatches, free.", soft: "Then decide." };

export const SWATCH_LINE = "Pick up to six woods and fabrics. They arrive in three days, and they are yours to keep.";

export const SWATCHES: readonly {
  name: string;
  texture: "oiledOak" | "smokedOak" | "cane" | "linen" | "boucle" | "wool";
  photo?: StaticImageData;
}[] = [
  { name: "Oiled oak", texture: "oiledOak" },
  { name: "Smoked oak", texture: "smokedOak" },
  { name: "Woven cane", texture: "cane" },
  { name: "Natural linen", texture: "linen" },
  { name: "Oat bouclé", texture: "boucle" },
  { name: "Pepper wool", texture: "wool" },
];
