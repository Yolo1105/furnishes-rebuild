import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "link";

/** One of the site's three buttons: a link when it has an `href`, otherwise a button. */
export function Button({
  variant = "secondary",
  href,
  className = "",
  children,
  ...rest
}: { variant?: Variant; href?: string; className?: string; children: ReactNode } & Omit<ComponentProps<"button">, "className">) {
  const cls = `btn-${variant} ${className}`.trim();
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
