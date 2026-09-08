import type { ReactNode } from "react";
import s from "./Display.module.css";

// Grand titre serif. Les passages entre *astérisques* passent en italique
// brique : c'est la seule place de l'accent dans un titre.
export function em(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((p, i) => (i % 2 === 1 ? <em key={i}>{p}</em> : p));
}

export default function Display({
  children,
  size = "l",
  as: Tag = "h1",
  italic = false,
  className,
  id,
}: {
  children: ReactNode;
  size?: "xl" | "l" | "m";
  as?: "h1" | "h2" | "h3" | "p" | "span";
  italic?: boolean;
  className?: string;
  id?: string;
}) {
  const cls = [s.display, s[size], italic ? s.italic : "", className ?? ""].join(" ").trim();
  return <Tag className={cls} id={id}>{typeof children === "string" ? em(children) : children}</Tag>;
}
