import type { StaticImageData } from "next/image";
import { marked } from "@/lib/facts";

/**
 * The makers and collaborators, after the packages: stand-ins naming the
 * kind of maker till the studio's real partners are set. To show a real one,
 * give its `name`, its `logo` (shown in place of the trade's mark) and its
 * `href` (the card then links out). `room`: the room photo (rooms.ts, by its
 * plan room) that fills the card.
 */
export const MAKERS: readonly {
  trade: string;
  name: string;
  room: string;
  logo?: StaticImageData;
  href?: string;
}[] = [
  { trade: "Joinery", name: marked("supplierName", "Joinery workshop"), room: "kitchen" },
  { trade: "Upholstery", name: marked("supplierName", "Upholstery maker"), room: "living" },
  { trade: "Timber", name: marked("supplierName", "Timber mill"), room: "bedroom3" },
  { trade: "Stone", name: marked("supplierName", "Stone supplier"), room: "bathroom" },
  { trade: "Lighting", name: marked("supplierName", "Lighting studio"), room: "master" },
  { trade: "Textiles", name: marked("supplierName", "Textile mill"), room: "bedroom2" },
  { trade: "Finishes", name: marked("supplierName", "Paint and finish"), room: "hall" },
  { trade: "Delivery", name: marked("supplierName", "Delivery and install"), room: "shelter" },
];
