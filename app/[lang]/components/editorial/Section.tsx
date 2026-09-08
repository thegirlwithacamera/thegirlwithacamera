import type { ReactNode } from "react";
import Display from "./Display";
import Eyebrow from "./Eyebrow";
import Lede from "./Lede";
import s from "./Section.module.css";

// Bloc de page avec son en-tête : eyebrow, titre, sous-titre italique, intro.
export default function Section({
  title,
  eyebrow,
  sub,
  lede,
  size = "m",
  as = "h2",
  children,
  id,
  className,
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  sub?: ReactNode;
  lede?: ReactNode;
  size?: "xl" | "l" | "m";
  as?: "h1" | "h2" | "h3";
  children?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section className={[s.section, className ?? ""].join(" ").trim()} id={id}>
      {(title || eyebrow || lede) && (
        <div className={s.head}>
          {eyebrow && <Eyebrow className={s.eyebrow}>{eyebrow}</Eyebrow>}
          {title && <Display size={size} as={as}>{title}</Display>}
          {sub && <p className={s.sub}>{sub}</p>}
          {lede && <Lede className={s.lede}>{lede}</Lede>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Rule() {
  return <hr className={s.rule} />;
}

// Fin de page : une question et un lien en grand italique.
export function Closing({ children }: { children: ReactNode }) {
  return <div className={s.center}>{children}</div>;
}
