import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Cover from "../components/Cover";
import ChapterIndex from "../components/ChapterIndex";
import TrustLogos from "../components/TrustLogos";
import LazyFilm from "./LazyFilm";
import s from "./index.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/destinations",
    title: "Destinations · Travel photographer and filmmaker",
    description:
      "Cities and journeys photographed and filmed by Sandrine Ceuppens: Graz, Villach, Tokyo, Kyoto, Naples, Venice, Palermo, and Interrail.",
    image: "/images/portfolio/travel/tokyo/1.jpg",
  });
}

// ─────────────────────────────────────────────────────────────
// Destinations (28/10) : les villes et les voyages, deuxième rubrique du
// menu (Hotels & Houses, Destinations, Brands). Remplace la vitrine du 16/09
// et le sommaire /destinations/all (qui renvoie ici) : Sandrine trouvait que
// tout se mélangeait. Les hôtels sont sur /hotels.
//
// Couverture : le film de Graz (le plan drone du lac de Côme est passé sur
// l'accueil le 28/10, pour ne pas montrer deux fois le même). Puis la grille des villes, et
// les films d'Interrail, qui n'ont pas d'autre page (ancre #interrail,
// utilisée par le logo, le sitemap vidéo et le Journal).
// ─────────────────────────────────────────────────────────────

const J = "/videos/creator/CINEMATIC/JOURNEYS";

export default async function DestinationsPage({ params }: Props) {
  await params;
  return (
    <main className={s.main}>
      <Cover
        film={{ src: "/videos/creator/CINEMATIC/CITIES/Graz.mp4", poster: "/videos/creator/CINEMATIC/CITIES/Graz.jpg" }}
        label="Graz, filmed by Sandrine Ceuppens for Graz Tourismus"
        title="Destinations"
      />
      <ChapterIndex
        cats={["travel"]}
        lede="Cities and journeys, told the way they felt: first light, markets before the crowds, the moments in between."
      />
      <section id="interrail" className={s.road}>
        <h2 className={s.roadTitle}>On the road · Interrail</h2>
        <div className={s.films}>
          <LazyFilm src={`${J}/Interrail.mp4`} poster={`${J}/Interrail.jpg`} label="Interrail film" />
          <LazyFilm src={`${J}/Interrail 2.mp4`} poster={`${J}/Interrail 2.jpg`} label="Interrail second film" />
        </div>
      </section>
      <section className={s.logos}>
        <TrustLogos lang="en" cats={["travel"]} hideLabel />
      </section>
    </main>
  );
}
