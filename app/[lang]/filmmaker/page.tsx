import FilmmakerClient from "./FilmmakerClient";
import { readDiary } from "@/lib/creator-videos";

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
  return <FilmmakerClient lang={lang} diary={readDiary()} />;
}
