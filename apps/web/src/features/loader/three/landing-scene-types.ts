export type LandingLoaderPhase = "run" | "breath" | "exit" | "hold" | "wipe" | "gone";

export type LandingLoaderSceneHandle = {
  releaseRenderer: () => void;
  dispose: () => void;
};
