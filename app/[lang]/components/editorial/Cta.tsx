import Link from "next/link";
import type { ReactNode } from "react";
import s from "./Cta.module.css";

// Appel à l'action. "link" souligné, "button" encadré, "serif" en grand
// italique pour les fins de page.
export default function Cta({
  href,
  children,
  variant = "link",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "link" | "button" | "serif";
  external?: boolean;
  className?: string;
}) {
  const cls = [s[variant], className ?? ""].join(" ").trim();
  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
