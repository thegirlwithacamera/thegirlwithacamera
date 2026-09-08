import Link from "next/link";
import type { ReactNode } from "react";
import Display from "./Display";
import Eyebrow from "./Eyebrow";
import Lede from "./Lede";
import s from "./PageHead.module.css";

// Ouverture d'une page, alignée à gauche : lien retour, eyebrow brique,
// titre, ligne de méta, introduction. `split` pose l'introduction dans une
// colonne de droite, face au titre.
export default function PageHead({
  title,
  size = "l",
  eyebrow,
  meta,
  lede,
  back,
  align = "left",
  split = false,
  children,
}: {
  title: ReactNode;
  size?: "xl" | "l" | "m";
  eyebrow?: ReactNode;
  meta?: (string | undefined | null | false)[];
  lede?: ReactNode;
  back?: { href: string; label: string };
  align?: "center" | "left";
  split?: boolean;
  children?: ReactNode;
}) {
  const metaItems = (meta ?? []).filter(Boolean) as string[];
  const cls = [s.head, align === "center" ? s.center : ""].join(" ").trim();
  const head = (
    <>
      {back && <Link href={back.href} className={s.back}>← {back.label}</Link>}
      {eyebrow && <Eyebrow className={s.eyebrow} tone="brick">{eyebrow}</Eyebrow>}
      <Display size={size}>{title}</Display>
      {metaItems.length > 0 && (
        <ul className={s.meta}>
          {metaItems.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}
    </>
  );
  if (split) {
    return (
      <header className={cls}>
        <div className={s.split}>
          <div>{head}</div>
          {lede && <Lede className={s.lede} align="left" tone="stone">{lede}</Lede>}
          {children && <div className={`${s.after} ${s.splitFull}`}>{children}</div>}
        </div>
      </header>
    );
  }
  return (
    <header className={cls}>
      {head}
      {lede && <Lede className={s.lede} align={align} tone="stone">{lede}</Lede>}
      {children && <div className={s.after}>{children}</div>}
    </header>
  );
}
