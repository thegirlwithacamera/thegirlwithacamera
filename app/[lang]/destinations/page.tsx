import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import TrustLogos from "../components/TrustLogos";
import LazyFilm from "./LazyFilm";
import s from "./page.module.css";

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
    title: "Destinations",
    description:
      "Hotels, cities and journeys photographed and filmed by Sandrine Ceuppens: Altstadt Vienna, Hotel Rathaus, Naturel Hoteldorf Schönleitn, Graz, Villach and Interrail.",
    image: "/images/portfolio/hospitality/naturel-dorf-schonleitn/1.jpg",
  });
}

// ─────────────────────────────────────────────────────────────
// Destinations, refaite le 16/09 sur le modèle de la page Portfolio
// d'adriana-maria.com : une grande image, une phrase, puis chaque projet en
// composition libre, un film horizontal et deux photos verticales qui se
// chevauchent, au lieu d'une grille de vignettes identiques.
//
// Seulement l'Autriche et Interrail : ce qui a été commandé. Italie, Japon et
// Belgique sont sortis (voir HIDDEN_CASES dans photographer/constants.ts).
// Le lac de Côme arrive la semaine du 21/09, puis le Japon.
//
// Les photos sont choisies à la main, une par une. Pour changer une image,
// changer le chemin ci-dessous. Pour ajouter un projet, ajouter un bloc :
// la mise en page alterne d'elle-même.
// ─────────────────────────────────────────────────────────────

type Project = {
  id: string;
  name: string;
  place: string;
  note?: string;
  href?: string;
  film: { src: string; poster: string };
  // Deuxième film du même projet (19/09) : affiché à côté du premier.
  film2?: { src: string; poster: string };
  photos: string[];
};

const P = "/images/portfolio";
const F = "/videos/creator/CINEMATIC";

const PROJECTS: Project[] = [
  {
    id: "altstadt-vienna",
    name: "Altstadt Vienna",
    place: "Vienna, Austria",
    href: "/en/photographer/hospitality/altstadt-vienna",
    film: { src: `${F}/HOTELS/Altstadt Vienna.mp4`, poster: `${F}/HOTELS/Altstadt Vienna.jpg` },
    photos: [`${P}/hospitality/altstadt-vienna/03-saris-home/1.jpg`, `${P}/hospitality/altstadt-vienna/01-la-maison/1.jpg`],
  },
  {
    id: "hotel-rathaus-wien",
    name: "Hotel Rathaus Wein & Design",
    place: "Vienna, Austria",
    href: "/en/photographer/hospitality/hotel-rathaus-wien",
    film: { src: `${F}/HOTELS/Hotel Rathaus.mp4`, poster: `${F}/HOTELS/Hotel Rathaus.jpg` },
    photos: [`${P}/hospitality/hotel-rathaus-wien/1.jpg`, `${P}/hospitality/hotel-rathaus-wien/12.jpg`],
  },
  {
    id: "interrail",
    name: "Interrail",
    place: "One pass, twelve stops, one summer",
    film: { src: `${F}/JOURNEYS/Interrail.mp4`, poster: `${F}/JOURNEYS/Interrail.jpg` },
    film2: { src: `${F}/JOURNEYS/Interrail 2.mp4`, poster: `${F}/JOURNEYS/Interrail 2.jpg` },
    photos: [],
  },
  {
    id: "naturel-dorf-schonleitn",
    name: "Naturel Hoteldorf Schönleitn",
    place: "Carinthia, Austria",
    href: "/en/photographer/hospitality/naturel-dorf-schonleitn",
    film: { src: `${F}/HOTELS/Naturel Dorf Schönleitn.mp4`, poster: `${F}/HOTELS/Naturel Dorf Schönleitn.jpg` },
    photos: [`${P}/hospitality/naturel-dorf-schonleitn/1.jpg`, `${P}/hospitality/naturel-dorf-schonleitn/7.jpg`],
  },
  {
    id: "graz",
    name: "Graz",
    place: "Styria, Austria",
    href: "/en/photographer/travel/graz",
    film: { src: `${F}/CITIES/Graz.mp4`, poster: `${F}/CITIES/Graz.jpg` },
    photos: [`${P}/travel/graz/4.jpg`, `${P}/travel/graz/1.jpg`],
  },
  {
    id: "villach",
    name: "Villach",
    place: "Carinthia, Austria",
    href: "/en/photographer/travel/villach",
    film: { src: `${F}/CITIES/Villach.mp4`, poster: `${F}/CITIES/Villach.jpg` },
    photos: [`${P}/travel/villach/1.jpg`, `${P}/travel/villach/5.jpg`],
  },
];

function Photo({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <figure className={className}>
      <Image src={src} alt={alt} width={1066} height={1600} sizes="(max-width: 767px) 60vw, 360px" quality={78} />
    </figure>
  );
}

export default async function DestinationsPage({ params }: Props) {
  await params;
  // Alternance a/b comptée sur les seuls projets à photos : un projet film
  // seul (Interrail) ne casse pas le rythme.
  const variants = new Map<string, "a" | "b">();
  PROJECTS.filter((p) => p.photos.length > 0).forEach((p, i) => variants.set(p.id, i % 2 === 0 ? "a" : "b"));

  return (
    <main className={s.main}>
      <section className={s.banner}>
        {/* Plan drone en boucle, muet (16/09, choix de Sandrine). Même lecteur
            que les films : il ne joue qu'à l'écran, et reste sur l'affiche si
            le visiteur a demandé moins d'animations. */}
        <LazyFilm
          src="/videos/banners/destinations-drone.mp4"
          poster="/videos/banners/destinations-drone.jpg"
          label="Aerial view of a city at sunset"
          sound={false}
        />
        <span className={s.bannerVeil} aria-hidden="true" />
        <h1 className={s.bannerWord}>Destinations</h1>
      </section>

      <p className={s.statement}>
        Hotels, cities and journeys, told the way they felt: first light, quiet rooms, the moments in between.
      </p>

      {PROJECTS.map((p) => {
        const alt = `${p.name}, ${p.place}, photographed by Sandrine Ceuppens`;
        const label = (
          <div className={s.label}>
            <h2 className={s.name}>{p.name}</h2>
            <p className={s.place}>{p.place}</p>
            {p.href && <Link href={p.href} className={s.more}>See the project →</Link>}
          </div>
        );

        // Deux films du même projet : côte à côte mais décalés en hauteur,
        // avec le titre calé dans le vide sous le premier (19/09).
        if (p.film2) {
          return (
            <section key={p.id} id={p.id} className={`${s.project} ${s.duo}`}>
              <div className={s.filmA}>
                <LazyFilm src={p.film.src} poster={p.film.poster} label={`${p.name} film`} />
              </div>
              <div className={s.filmB}>
                <LazyFilm src={p.film2.src} poster={p.film2.poster} label={`${p.name} second film`} />
              </div>
              {label}
            </section>
          );
        }

        if (p.photos.length === 0) {
          return (
            <section key={p.id} id={p.id} className={`${s.project} ${s.solo}`}>
              <div className={s.soloFilm}>
                <LazyFilm src={p.film.src} poster={p.film.poster} label={`${p.name} film`} />
              </div>
              {label}
            </section>
          );
        }

        const variant = variants.get(p.id) === "b" ? s.b : s.a;
        return (
          <section key={p.id} id={p.id} className={`${s.project} ${variant}`}>
            <div className={s.film}>
              <LazyFilm src={p.film.src} poster={p.film.poster} label={`${p.name} film`} />
            </div>
            <Photo src={p.photos[0]} alt={alt} className={s.photo1} />
            <Photo src={p.photos[1]} alt={alt} className={s.photo2} />
            {label}
          </section>
        );
      })}

      <section className={s.logos}>
        <TrustLogos lang="en" cats={["stays", "travel"]} hideLabel />
      </section>
    </main>
  );
}
