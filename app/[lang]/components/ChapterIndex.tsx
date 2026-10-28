import { readCaseCover } from "@/lib/portfolio";
import { bookChapters, no2 } from "../photographer/book";
import { ProjectCard, ProjectGrid } from "./editorial";
import s from "./ChapterIndex.module.css";

// Les chapitres d'une ou plusieurs catégories, en grille 3 colonnes (2 sur
// mobile), couverture du lieu, numéro de chapitre et lieu dessous. Sert aux
// pages Hotels & Houses et Destinations (28/10).
export default function ChapterIndex({ cats, lede }: { cats: string[]; lede: string }) {
  const chapters = bookChapters().filter((c) => cats.includes(c.cat.slug));
  return (
    <>
      <p className={s.lede}>{lede}</p>
      <ProjectGrid>
        {chapters.map((c, i) => (
          <ProjectCard
            key={c.href}
            href={`/en${c.href}`}
            cover={c.item.coverImage ?? readCaseCover(c.cat.slug, c.item.slug)}
            coverPosition={c.item.coverPosition}
            alt={`${c.item.label.en}, photographed by Sandrine Ceuppens`}
            title={`${no2(c.no)}  ${c.item.short?.en ?? c.item.label.en}`}
            sub={c.item.place?.en}
            hasFilm={!!c.item.films?.length}
            priority={i < 3}
          />
        ))}
      </ProjectGrid>
    </>
  );
}
