import Image from "next/image";
import { Backdrop } from "@/features/stage/Backdrop";
import showroom from "../../../../public/rooms/craft-showroom.jpg";
import styles from "./draft.module.css";

/** A page in the making: the bar, the site's background, and a photo filling the screen under the bar, a two-line headline over it. */
export default function DraftPage() {
  return (
    <div className={styles.page} data-bar-large>
      <Backdrop />
      {/* the white wall under the bar: the bar turns deep rust */}
      <section className={styles.hero} data-dark-under-bar data-bar="rust-deep">
        <Image
          src={showroom}
          alt="A gallery of handmade timber chairs, tables and cabinets on a polished wooden floor"
          className={styles.photo}
          fill
          sizes="100vw"
          priority
        />
        <h1 className={styles.headline}>
          Furniture made by hand,
          <br />
          for rooms that feel like home.
        </h1>
      </section>
    </div>
  );
}
