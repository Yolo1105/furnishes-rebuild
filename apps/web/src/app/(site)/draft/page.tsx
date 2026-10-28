import Image from "next/image";
import { Backdrop } from "@/features/stage/Backdrop";
import showroom from "../../../../public/rooms/craft-showroom.jpg";
import styles from "./draft.module.css";

/** A page in the making: the bar, the site's background, a two-line headline and a photo under it. */
export default function DraftPage() {
  return (
    <div className={styles.page} data-bar-large>
      <Backdrop />
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Furniture made by hand,
          <br />
          for rooms that feel like home.
        </h1>
        <Image
          src={showroom}
          alt="A gallery of handmade timber chairs, tables and cabinets on a polished wooden floor"
          className={styles.photo}
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
