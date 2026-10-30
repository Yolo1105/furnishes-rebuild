/**
 * The design packages, after the everyday cases: what each covers, row by
 * row. Stand-in copy till the studio's own terms are set. `rows`: each
 * row's label, then its cell for each package, in PACKAGES' order.
 */
export const PACKAGES: readonly { name: string; line: string }[] = [
  { name: "Consult", line: "A single room or a second opinion" },
  { name: "Room", line: "One room start to finish on paper" },
  { name: "Home", line: "Whole homes planned as one project" },
];

export const PACKAGE_ROWS: readonly { label: string; cells: readonly [string, string, string] }[] = [
  {
    label: "Includes",
    cells: [
      "90-minute visit plus a written summary in 3 days",
      "Floor plan, two layouts, finish and furniture list with links",
      "All rooms, trade drawings, sourcing, delivery tracking, site visits",
    ],
  },
  { label: "Turnaround", cells: ["3 days", "3 to 5 weeks", "4 to 7 months"] },
  { label: "Revisions", cells: ["None", "One round", "Two rounds per room"] },
  { label: "Not included", cells: ["Drawings, sourcing", "Ordering, install", "Construction work"] },
];
