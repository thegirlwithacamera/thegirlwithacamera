import Link from "next/link";
import type { ReactNode } from "react";
import Display from "./Display";
import Eyebrow from "./Eyebrow";
import Lede from "./Lede";
import s from "./PageHead.module.css";

// Ouverture d'une page : lien retour, eyebrow, grand titre, ligne de méta,
// introduction. Toutes les pages du site s'ouvrent avec lui.
export default function PageHead({
  title,
  size = "l",
  eyebrow,
  meta,
  lede,
  back,
  align = "center",
  wide = false,
  children,
}: {
  title: ReactNode;
  size?: "xl" | "l" | "m";
  eyebrow?: ReactNode;
  meta?: (string | undefined | null | false)[];
  lede?: ReactNode;
  back?: { href: string; label: string };
  align?: "center" | "left";
  wide?: boolean;
  children?: ReactNode;
}) {
  const metaItems = (meta ?? []).filter(Boolean) as string[];
  const cls = [s.head, align === "left" ? s.left : "", wide ? s.wide : ""].join(" ").trim();
  return (
    <header className={cls}>
      {back && <Link href={back.href} className={s.back}>← {back.label}</Link>}
      {eyebrow && <Eyebrow className={s.eyebrow}>{eyebrow}</Eyebrow>}
      <Display size={size}>{title}</Display>
      {metaItems.length > 0 && (
        <ul className={s.meta}>
          {metaItems.map((m) => <li key={m}>{m}</li>)}
        </ul>
      )}
      {lede && <Lede className={s.lede} align={align}>{lede}</Lede>}
      {children && <div className={s.after}>{children}</div>}
    </header>
  );
}
