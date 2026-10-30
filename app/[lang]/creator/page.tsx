import Image from "next/image";
import Link from "next/link";
import Cover from "../components/Cover";
import { Display, Eyebrow } from "../components/editorial";
import { BRAND_FILMS } from "./constants";
import { readSocial } from "./data";
import s from "./Brands.module.css";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Genere la page en statique au build pour les deux langues.
// Necessaire pour que la lecture des dossiers (fs) se fasse au build,
// pas a la requete (ou public/ n'est pas accessible sur Vercel).
export function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

const content = {
  fr: {
    eyebrow: "Deux façons de travailler ensemble",
    title: "Un film pour votre marque, ou des histoires pour *le feed*.",
    films: "Brand films",
    filmsText: "Horizontal, cinématique. Un film court écrit, tourné et étalonné pour votre site, un lancement, vos écrans.",
    filmsGo: "Voir les films",
    soon: "En production",
    social: "Social",
    socialText: "Vertical. Publié sur mes comptes, ou livré pour les vôtres.",
    socialGo: "Voir les vidéos",
  },
  en: {
    eyebrow: "Two ways to work together",
    title: "A film for your brand, or stories for *the feed*.",
    films: "Brand films",
    filmsText: "Horizontal, cinematic. A short film written, shot and graded for your site, a launch, your screens.",
    filmsGo: "Watch the films",
    soon: "In production",
    social: "Social",
    socialText: "Vertical. Posted on my channels, or delivered to run on yours.",
    socialGo: "See the reels",
  },
};

export default async function CreatorPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];
  const base = `/${lang}/creator`;
  // Couverture (28/10) comme les autres rubriques, en boucle muette. Depuis
  // le 30/10, le film mode (Sandrine en look adidas, dans un escalier) à la
  // place du bureau filmé d'en haut. Dessous, deux portes : les films de
  // marque et les verticales.
  const filmPoster = BRAND_FILMS.find((f) => f.poster)?.poster;
  const nextFilm = BRAND_FILMS.find((f) => !f.src);
  const phones = readSocial(lang).filter((c) => c.poster).slice(0, 3);

  return (
    <>
      <Cover
        film={{ src: "/videos/banners/brands-fashion.mp4", poster: "/videos/banners/brands-fashion.jpg" }}
        label="Brands, Sandrine Ceuppens on a stone staircase in an adidas look"
        title="Brands"
      />
      <main className={s.hub}>
        <header className={s.hubHead}>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <Display as="h2" size="l">{t.title}</Display>
        </header>

        <div className={s.doors}>
          <Link href={`${base}/films`} className={`${s.door} ${s.doorFilms}`}>
            <span className={s.frame}>
              {filmPoster ? (
                <Image src={filmPoster} alt="" fill sizes="(max-width: 767px) 100vw, 700px" quality={75} />
              ) : nextFilm && (
                <span className={s.soon}>
                  <strong>{nextFilm.client}</strong>
                  <em>{t.soon}</em>
                </span>
              )}
              <span className={s.bars} aria-hidden="true" />
            </span>
            <span className={s.doorTitle}>{t.films}</span>
            <span className={s.doorText}>{t.filmsText}</span>
            <span className={s.doorGo}>{t.filmsGo}</span>
          </Link>

          <Link href={`${base}/social`} className={`${s.door} ${s.doorSocial}`}>
            <span className={s.frame}>
              {phones.map((c) => (
                <span key={c.src} className={s.mini}>
                  <Image src={c.poster!} alt="" fill sizes="120px" quality={70} />
                </span>
              ))}
            </span>
            <span className={s.doorTitle}>{t.social}</span>
            <span className={s.doorText}>{t.socialText}</span>
            <span className={s.doorGo}>{t.socialGo}</span>
          </Link>
        </div>
      </main>
    </>
  );
}
