import type { Metadata } from "next";
import { allPosts, formatDate } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Cta, Display, em, Eyebrow, ProjectCard, ProjectGrid, SectionBar } from "./components/editorial";
import Band from "./components/Band";
import TrustLogos from "./components/TrustLogos";
import TestimonialCarousel from "./components/TestimonialCarousel";
import Cover from "./components/Cover";
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
// Ouverture (28/10, d'après la couverture de Lola Fechino) : le film de
// mizuya plein cadre sur fond blanc, coupé après son carton "Welcome to", et
// une mention dans chaque coin. Plus de menu en haut : les rubriques sont
// dans les coins (composant Cover). Le titre passe sous la couverture.
//
// Ensuite, dans l'ordre où un client se pose les questions : qui t'a fait
// confiance (logos), qu'as-tu fait (trois projets, tous photo + film),
// comment ça s'est passé (témoignages), et pour les marques la porte
// Content creator. Puis l'appel à écrire, le Journal et Instagram.
// ─────────────────────────────────────────────────────────────

const HERO = {
  film: { src: "/videos/banners/home-mizuya.mp4", poster: "/videos/banners/home-mizuya.jpg" },
  filmVertical: { src: "/videos/banners/home-mizuya-vertical.mp4", poster: "/videos/banners/home-mizuya-vertical.jpg" },
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
      <Cover
        film={HERO.film}
        filmVertical={HERO.filmVertical}
        label="mizuya, Miyazu, filmed by Sandrine Ceuppens"
        tl={<p>Brussels<br />Belgium</p>}
        tr={<Link href="/en/about">Photographer &amp; filmmaker</Link>}
      />

      <section className={s.intro}>
        <h1 className={s.introTitle}>I photograph and film <em>the way it feels.</em></h1>
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
        <SectionBar label="Selected work" sub="Photographs & film" href="/en/hotels" linkLabel="Hotels & Houses" />
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
        <Cta href="/en/about#contact" variant="button">Work with me</Cta>
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
