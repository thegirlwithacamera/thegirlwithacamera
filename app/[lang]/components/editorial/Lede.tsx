import type { ReactNode } from "react";
import s from "./Lede.module.css";

// Paragraphe d'introduction éditorial, en serif 18 px.
export default function Lede({
  children,
  tone = "ink",
  align = "center",
  className,
}: {
  children: ReactNode;
  tone?: "ink" | "stone";
  align?: "center" | "left";
  className?: string;
}) {
  const cls = [s.lede, tone === "stone" ? s.stone : "", align === "left" ? s.left : "", className ?? ""].join(" ").trim();
  return <p className={cls}>{children}</p>;
}
