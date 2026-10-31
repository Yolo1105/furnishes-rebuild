/**
 * What the living room is made of once the materials sweep in, shared by
 * the scene (which paints it) and the walk's panel (which shows swatches).
 */
export const FINISH = {
  floor: "#d9bb92", // oak boards
  wall: "#f4ebe1", // plaster
  oak: "#c59a6a",
  walnut: "#6b4630",
  moss: "#6f7a5e", // sofa fabric
  mossLight: "#86906f", // its cushions
  wool: "#ebdfcb", // the rug
  rust: "#9a4017", // the armchair
  screen: "#2a2420",
  furnishes: "#e7551a", // the bookcase's boards
  white: "#f1eee6", // white matte faces
  birch: "#d8bd93", // birch edges
} as const;

/** The swatches the panel shows, in the order it shows them. */
export const SWATCHES = [
  { name: "Furnishes orange", color: FINISH.furnishes },
  { name: "Oak", color: FINISH.oak },
  { name: "Walnut", color: FINISH.walnut },
  { name: "Moss wool", color: FINISH.moss },
  { name: "Rust", color: FINISH.rust },
] as const;
