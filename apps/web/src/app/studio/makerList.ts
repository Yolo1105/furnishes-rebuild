import type { StaticImageData } from "next/image";

/**
 * The makers and collaborators, after the packages: stand-ins naming the
 * kind of maker till the studio's real partners are set. To show a real one,
 * give its `name`, its `logo` (shown in place of the trade's mark) and its
 * `href` (the card then links out). `room`: the room photo (rooms.ts, by its
 * plan room) that comes up behind the card when it is pointed at.
 */
export const MAKERS: readonly {
  trade: string;
  name: string;
  room: string;
  logo?: StaticImageData;
  href?: string;
}[] = [
  { trade: "Joinery", name: "Joinery workshop", room: "kitchen" },
  { trade: "Upholstery", name: "Upholstery maker", room: "living" },
  { trade: "Timber", name: "Timber mill", room: "bedroom3" },
  { trade: "Stone", name: "Stone supplier", room: "bathroom" },
  { trade: "Lighting", name: "Lighting studio", room: "master" },
  { trade: "Textiles", name: "Textile mill", room: "bedroom2" },
  { trade: "Finishes", name: "Paint and finish", room: "hall" },
  { trade: "Delivery", name: "Delivery and install", room: "shelter" },
];
