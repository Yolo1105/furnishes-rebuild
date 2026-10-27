import { useSyncExternalStore } from "react";

/**
 * Whether the page's opening loader has finished: it marks <html> with
 * data-loading while it plays, and what waits for it (the walk's 3D, the
 * opening's photos turning) holds till the mark goes. Without that mark,
 * it is done straight away; on the server, not yet.
 */
export function useLoaderDone() {
  return useSyncExternalStore(
    (changed) => {
      const watch = new MutationObserver(changed);
      watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-loading"] });
      return () => watch.disconnect();
    },
    () => !document.documentElement.hasAttribute("data-loading"),
    () => false,
  );
}
