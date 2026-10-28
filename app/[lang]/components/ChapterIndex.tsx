import { readCaseCover } from "@/lib/portfolio";
import { liveProjects } from "../photographer/book";
import { ProjectCard, ProjectGrid } from "./editorial";
import s from "./ChapterIndex.module.css";

// Les projets d'une ou plusieurs catégories, du plus récent au plus ancien,
// en grille 3 colonnes (2 sur mobile), couverture du lieu, nom et lieu dessous. Sert aux
// pages Hotels & Houses et Destinations (28/10).
export default function ChapterIndex({ cats, lede }: { cats: string[]; lede: string }) {
  const chapters = liveProjects().filter((c) => cats.includes(c.cat.slug));
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
            title={c.item.short?.en ?? c.item.label.en}
            sub={c.item.place?.en}
            hasFilm={!!c.item.films?.length}
            priority={i < 3}
          />
        ))}
      </ProjectGrid>
    </>
  );
}
