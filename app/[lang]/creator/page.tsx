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
  // menu choisi par Sandrine. Deux images sans texte incrusté, elle avec le
  // Pentax 17 et l'appareil dans sa boîte.
  return (
    <>
      <Cover
        images={["/videos/creator/GEAR/Pentax 17.jpg", "/videos/creator/UNBOXING/Pentax 17.jpg"]}
        label="Brands"
        title="Brands"
      />
      <CreatorClient lang={lang} data={readCreatorData()} />
    </>
  );
}
