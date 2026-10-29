import { PhotoRotation } from "./PhotoRotation";
import { PHOTOS } from "./photos";

/** The landing: the room photos, one screen at a time, turning on their own. */
export default function Home() {
  return (
    <main>
      <h1 className="visually-hidden">Furnishes: Interior Revolution</h1>
      <PhotoRotation photos={PHOTOS} />
    </main>
  );
}
