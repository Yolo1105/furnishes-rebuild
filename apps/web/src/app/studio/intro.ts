import { routes } from "@/lib/routes";

/**
 * The studio's arrival: the header, the photo and the heading come in, and
 * the plan draws itself (FloorPlan's DRAW), over INTRO_MS. It plays while
 * the root has `data-intro="play"`, which INTRO_SCRIPT sets before the page
 * is first painted (the root layout runs it in the head, on the studio's
 * address only): once a visit (the tab's session), and only when the page
 * opens at its top, for anyone who has not asked for less motion. StudioView
 * marks it "done" when it has played, or as soon as the page is scrolled,
 * and everything is then at once as it ends.
 */
export const INTRO_MS = 4300;

export const INTRO_SCRIPT = `try{if(location.pathname===${JSON.stringify(routes.studio)}){var s=sessionStorage;if(!s.getItem("studio-intro")&&!location.hash&&scrollY<1&&matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.dataset.intro="play";s.setItem("studio-intro","1")}}catch(e){}`;
