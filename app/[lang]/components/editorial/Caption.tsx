import Link from "next/link";
import s from "./Caption.module.css";

// Légende à deux ou trois lignes : titre en serif, précision en italique,
// note en petites capitales (catégorie, type de contenu).
export default function Caption({
  title,
  sub,
  note,
  noteHref,
  align = "center",
  inline = false,
  className,
}: {
  title: string;
  sub?: string;
  note?: string;
  noteHref?: string;
  align?: "center" | "left";
  // Lieu sur la même ligne que le nom, en petites capitales.
  inline?: boolean;
  className?: string;
}) {
  const cls = [s.cap, align === "left" ? s.left : "", inline ? s.inline : "", className ?? ""].join(" ").trim();
  return (
    <p className={cls}>
      {title && <span className={s.title}>{title}</span>}
      {sub && <span className={s.sub}>{sub}</span>}
      {note && noteHref ? (
        <Link href={noteHref} className={`${s.note} ${s.noteLink}`}>{note}</Link>
      ) : note ? (
        <span className={s.note}>{note}</span>
      ) : null}
    </p>
  );
}
