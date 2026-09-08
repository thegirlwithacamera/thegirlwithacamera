import Link from "next/link";
import s from "./SectionBar.module.css";

// Barre de section façon magazine : étiquette brique à gauche, lien "Tout
// voir" à droite. Précède une grille.
export default function SectionBar({
  label,
  sub,
  href,
  linkLabel,
  id,
}: {
  label: string;
  sub?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className={s.bar} id={id}>
      <h2 className={s.label}>
        {label}
        {sub && <span className={s.sub}>{sub}</span>}
      </h2>
      {href && linkLabel && <Link href={href} className={s.link}>{linkLabel} →</Link>}
    </div>
  );
}
