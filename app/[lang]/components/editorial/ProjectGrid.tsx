import type { CSSProperties, ReactNode } from "react";
import s from "./ProjectGrid.module.css";

// Grille 3 colonnes. `cols` force 1 ou 2 colonnes quand il y a peu d'items.
// `tight` pour une grille de photos sans légende, `keep3` pour garder trois
// colonnes sur mobile (pages de cas).
export default function ProjectGrid({
  children,
  cols = 3,
  tight = false,
  keep3 = false,
  className,
  style,
  id,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3;
  tight?: boolean;
  keep3?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const cls = [
    s.grid,
    cols === 2 ? s.cols2 : cols === 1 ? s.cols1 : "",
    tight ? s.tight : "",
    keep3 ? s.keep3 : "",
    className ?? "",
  ].join(" ").trim();
  return <div className={cls} style={style} id={id}>{children}</div>;
}

// Nombre de colonnes selon le nombre d'items : trois dès qu'il y en a trois.
export function colsFor(n: number): 1 | 2 | 3 {
  return n <= 1 ? 1 : n === 2 ? 2 : 3;
}
