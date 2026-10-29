import Image from "next/image";
import greenLivingRoom from "@/assets/green-living-room.jpg";
import styles from "./page.module.css";

/** The landing: one photo of a lived-in room, filling the screen. */
export default function Home() {
  return (
    <main className={styles.landing}>
      <h1 className="visually-hidden">Furnishes</h1>
      <Image
        src={greenLivingRoom}
        alt="A living room with a sage green wall of framed prints, an orange sectional sofa, a glass coffee table, a patterned armchair and a small desk"
        className={styles.photo}
        fill
        sizes="100vw"
        priority
        placeholder="blur"
      />
    </main>
  );
}
