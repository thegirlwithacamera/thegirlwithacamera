import type { ReactNode } from "react";
import s from "./Eyebrow.module.css";

// Petite ligne en capitales espacées, au-dessus d'un titre ou d'un bloc.
export default function Eyebrow({
  children,
  tone = "stone",
  as: Tag = "p",
  className,
  id,
}: {
  children: ReactNode;
  tone?: "stone" | "ink" | "brick";
  as?: "p" | "span" | "div";
  className?: string;
  id?: string;
}) {
  const cls = [s.eyebrow, tone !== "stone" ? s[tone] : "", className ?? ""].join(" ").trim();
  return <Tag className={cls} id={id}>{children}</Tag>;
}
