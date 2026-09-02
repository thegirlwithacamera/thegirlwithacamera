import FilmmakerClient from "./FilmmakerClient";
import { readDiary } from "@/lib/creator-videos";
import { casesWithPhotos } from "@/lib/portfolio";
import { allCases } from "../photographer/constants";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Genere la page en statique au build pour les deux langues.
// Necessaire pour que la lecture des dossiers (fs) se fasse au build,
// pas a la requete (ou public/ n'est pas accessible sur Vercel).
export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function FilmmakerPage({ params }: Props) {
  const { lang } = await params;
  // Les cas dont le dossier d'images n'est pas vide. Une vignette de film ne
  // propose "Photos" que pour ceux-la : un cas declare avant l'arrivee de ses
  // photos affiche son nom, sans lien vers une page qui n'existe pas encore.
  const live = casesWithPhotos(
    allCases().map((c) => ({ category: c.cat.slug, slug: c.item.slug })),
  );
  return <FilmmakerClient lang={lang} diary={readDiary()} live={live} />;
}
