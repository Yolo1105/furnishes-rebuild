import styles from "./HeroTitle.module.css";

/**
 * The landing's title, as on the live site: "Interior Revolution" in wide
 * hairline caps, its second word a shade fainter, each line rising in after
 * the one above. It sits at the top left of whatever stage it is on, lined
 * up with the bar's first link; a stage may fade it by setting --title.
 * It is rust over the orange wash, and cream (`tone="cream"`) over a dark
 * picture; `className` lets a page move it.
 */
export function HeroTitle({
  tone = "rust",
  className,
}: {
  tone?: "rust" | "cream";
  className?: string;
}) {
  return (
    <h1
      className={className ? `${styles.title} ${className}` : styles.title}
      data-tone={tone}
      aria-label="Interior Revolution"
    >
      <span className={styles.first} aria-hidden="true">
        Interior
      </span>
      <span className={styles.second} aria-hidden="true">
        Revolution
      </span>
    </h1>
  );
}
