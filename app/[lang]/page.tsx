import type { Metadata } from "next";
import { allPosts, formatDate } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Cta, Display, em, Eyebrow, ProjectCard, ProjectGrid, SectionBar } from "./components/editorial";
import Band from "./components/Band";
import TrustLogos from "./components/TrustLogos";
import TestimonialCarousel from "./components/TestimonialCarousel";
import LazyFilm from "./destinations/LazyFilm";
import { allTestimonials } from "./photographer/constants";
import InstagramRow from "./components/InstagramRow";
import { INSTAGRAM_FALLBACK } from "@/lib/instagram";
import s from "./page.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

// Génération statique des deux langues au build. Indispensable depuis que
// l'accueil lit public/images avec fs pour trouver les couvertures : sur
// Vercel, next.config.ts exclut public/ des fonctions serveur, donc une page
// rendue à la demande ne voit aucun fichier et la grille sort vide.
export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "",
    title: "The Girl With A Camera · Sandrine Ceuppens, travel photographer, filmmaker & content creator",
    description:
      "Sandrine Ceuppens, travel photographer and content creator based in Brussels. Hotels and destinations, photographed and filmed the way they feel. Travelling worldwide.",
  });
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL, refait le 16/09 sur la structure d'adriana-maria.com, puis
// réordonné le 28/10 pour vendre la photo ET le film aux clients.
//
// Ouverture : un seul film en boucle, muet, en fond, celui de Nishimuraya
// (Japon). Un projet entier plutôt qu'un montage de plusieurs (choix de
// Sandrine le 28/10). Version horizontale sur ordinateur, verticale sur
// téléphone, coupées après le carton "Welcome to Nishimuraya" pour ne pas
// doubler le titre. Le portrait de Sandrine devant le Fuji est posé à
// droite par dessus.
// Le titre dit "photograph and film" : le film ne se voyait nulle part dans
// le premier écran.
//
// Ensuite, dans l'ordre où un client se pose les questions : qui t'a fait
// confiance (logos), qu'as-tu fait (trois projets, tous photo + film),
// comment ça s'est passé (témoignages), et pour les marques la porte
// Content creator. Puis l'appel à écrire, le Journal et Instagram.
// ─────────────────────────────────────────────────────────────

const HERO = {
  film: { src: "/videos/banners/home-nishimuraya.mp4", poster: "/videos/banners/home-nishimuraya.jpg" },
  filmVertical: { src: "/videos/banners/home-nishimuraya-vertical.mp4", poster: "/videos/banners/home-nishimuraya-vertical.jpg" },
  portrait: "/images/about/hero.jpg",
};

// Trois projets commandés, chacun avec photos et film. Pour changer la
// sélection, changer les lignes ci-dessous (couverture verticale 2:3).
const P = "/images/portfolio";
const SELECTED = [
  { href: "/en/photographer/hospitality/altstadt-vienna", title: "Altstadt Vienna", place: "Vienna", cover: `${P}/hospitality/altstadt-vienna/03-saris-home/1.jpg` },
  { href: "/en/photographer/hospitality/naturel-dorf-schonleitn", title: "Naturel Hoteldorf Schönleitn", place: "Carinthia", cover: `${P}/hospitality/naturel-dorf-schonleitn/1.jpg` },
  { href: "/en/photographer/travel/graz", title: "Graz Tourismus", place: "Styria", cover: `${P}/travel/graz/4.jpg` },
];

// Une seule bande pleine largeur, pour les marques. Destinations a sa
// sélection juste au dessus, le Journal sa grille plus bas.
const BANDS = [
  { href: "/en/creator", word: "Content creator", button: "See the videos", image: "/videos/creator/CINEMATIC/HOTELS/Hotel Rathaus.jpg", position: "50% 50%" },
];

// Bande Instagram en bas de page : les cinq derniers posts du compte, lus par
// l'API Instagram (voir lib/instagram.ts). Les vignettes livrées avec la page
// sont le filet de secours, elles restent affichées si l'API ne répond pas.

export default async function HomePage({ params }: Props) {
  await params;
  const posts = allPosts().slice(0, 3);

  return (
    <main className={s.main}>
      <section className={s.hero}>
        {/* Une seule des deux versions est affichée ; l'autre, masquée, n'entre
            jamais à l'écran et ne se charge donc pas. */}
        <div className={`${s.heroBg} ${s.heroWide}`}>
          <LazyFilm {...HERO.film} label="Nishimuraya, a ryokan in Japan, filmed by Sandrine Ceuppens" sound={false} />
        </div>
        <div className={`${s.heroBg} ${s.heroTall}`}>
          <LazyFilm {...HERO.filmVertical} label="Nishimuraya, a ryokan in Japan, filmed by Sandrine Ceuppens" sound={false} />
        </div>
        <span className={s.heroVeil} aria-hidden="true" />
        <div className={s.heroInner}>
          <div className={s.heroText}>
            <h1 className={s.heroTitle}>I photograph and film <em>the way it feels.</em></h1>
            <p className={s.heroSub}>Hotels, destinations &amp; brands · Photo &amp; film</p>
            <Link href="/en/contact" className={s.heroButton}>Work with me</Link>
          </div>
          <div className={s.heroPortrait}>
            <Image
              src={HERO.portrait}
              alt="Sandrine Ceuppens with her camera in front of Mount Fuji"
              width={1259}
              height={1800}
              priority
              sizes="(max-width: 767px) 70vw, 460px"
              quality={82}
            />
          </div>
        </div>
      </section>

      <section className={s.intro}>
        <p className={s.introText}>
          Travel photographer, filmmaker &amp; content creator. I work in natural light, with nothing staged. I arrive before everyone else, often at five in the morning, to catch the moment a room or a street feels like itself. Stills and film on the same visit, so the place reads as a whole.
        </p>
        <Link href="/en/about" className={s.introButton}>Read my story</Link>
      </section>

      <section className={s.trust}>
        <Eyebrow tone="brick" className={s.trustLabel}>They trusted me</Eyebrow>
        <TrustLogos lang="en" hideLabel />
      </section>

      <section className={s.selected}>
        <SectionBar label="Selected work" sub="Photographs & film" href="/en/destinations/all" linkLabel="Contents" />
        <ProjectGrid>
          {SELECTED.map((p) => (
            <ProjectCard
              key={p.href}
              href={p.href}
              cover={p.cover}
              alt={`${p.title}, photographed by Sandrine Ceuppens`}
              title={p.title}
              sub={p.place}
              hasFilm
            />
          ))}
        </ProjectGrid>
      </section>

      <section className={s.words}>
        <TestimonialCarousel
          lang="en"
          items={allTestimonials().map((x) => ({ t: x.t, href: x.href, label: x.label.en }))}
        />
      </section>

      <div className={s.bands}>
        {BANDS.map((b) => (
          <Band key={b.href} {...b} />
        ))}
      </div>

      <section className={s.closing}>
        <Display size="l" as="h2">{em("Your place, *told the way it feels.*")}</Display>
        <p className={s.closingText}>Hotels, tourism boards and brands: tell me about the place and the dates. I answer within a few days.</p>
        <Cta href="/en/contact" variant="button">Work with me</Cta>
      </section>

      {posts.length > 0 && (
        <section className={s.latest}>
          <SectionBar label="Latest on the journal" href="/en/journal" linkLabel="All stories" />
          <ProjectGrid>
            {posts.map((p) => (
              <ProjectCard
                key={p.slug}
                href={`/en/journal/${p.slug}`}
                cover={p.cover}
                alt={p.title}
                title={p.title}
                sub={[p.place, formatDate(p.date)].filter(Boolean).join(", ")}
                door={!p.cover}
              />
            ))}
          </ProjectGrid>
        </section>
      )}

      <section className={s.insta}>
        <a href="https://www.instagram.com/sandrinecppns/" target="_blank" rel="noopener noreferrer" className={s.instaHead}>
          Follow on Instagram
          <span>@sandrinecppns</span>
        </a>
        <InstagramRow initial={INSTAGRAM_FALLBACK} />
      </section>
    </main>
  );
}
