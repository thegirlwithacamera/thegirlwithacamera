import CreatorClient from "./CreatorClient";
import Cover from "../components/Cover";
import { readCreatorData } from "@/lib/creator-videos";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Genere la page en statique au build pour les deux langues.
// Necessaire pour que la lecture des dossiers (fs) se fasse au build,
// pas a la requete (ou public/ n'est pas accessible sur Vercel).
export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export default async function CreatorPage({ params }: Props) {
  const { lang } = await params;
  // Couverture (28/10) comme les autres rubriques : Brands, troisième du
  // menu choisi par Sandrine. Le film "The Office" (bureau filmé d'en haut)
  // en boucle muette ; les captures des vidéos verticales, trop basses en
  // définition, ont été refusées.
  return (
    <>
      <Cover
        film={{ src: "/videos/banners/brands-office.mp4", poster: "/videos/banners/brands-office.jpg" }}
        label="Brands, a desk filmed from above by Sandrine Ceuppens"
        title="Brands"
      />
      <CreatorClient lang={lang} data={readCreatorData()} />
    </>
  );
}
