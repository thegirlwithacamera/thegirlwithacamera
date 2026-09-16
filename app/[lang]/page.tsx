import type { Metadata } from "next";
import { allPosts, formatDate } from "@/lib/journal";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard, ProjectGrid, SectionBar } from "./components/editorial";
import Band from "./components/Band";
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
    title: "The Girl With A Camera · Sandrine Ceuppens, travel photographer & content creator",
    description:
      "Sandrine Ceuppens, travel photographer and content creator based in Brussels. Hotels and destinations, photographed and filmed the way they feel. Travelling worldwide.",
  });
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL, refait le 16/09 sur la structure d'adriana-maria.com.
//
// Ouverture : une grande photo horizontale en fond (Tokyo la nuit, R0010544)
// et le portrait de Sandrine devant le Fuji, vertical, posé à droite par
// dessus. Le titre est sa bio Instagram. Portrait à droite plutôt qu'à
// gauche : à gauche il cachait la femme qui traverse, et le titre passait sur
// les enseignes.
//
// Ensuite quelques mots, puis trois portes : Destinations, Content creator,
// Journal. Plus de grille de tous les projets ici, elle vit sur
// Destinations.
// ─────────────────────────────────────────────────────────────

const HERO = {
  background: "/images/home/hero-tokyo.jpg",
  portrait: "/images/about/hero.jpg",
};

// Trois grandes bandes pleine largeur, comme chez Adriana. Les images sont
// des affiches de films (1920 px), les seules horizontales assez grandes.
const BANDS = [
  { href: "/en/destinations", word: "Destinations", button: "Discover the work", image: "/videos/creator/CINEMATIC/CITIES/Villach.jpg", position: "50% 40%" },
  { href: "/en/creator", word: "Content creator", button: "See the videos", image: "/videos/creator/CINEMATIC/HOTELS/Hotel Rathaus.jpg", position: "50% 50%" },
  { href: "/en/journal", word: "Journal", button: "Read the stories", image: "/images/home/journal-fuji-train.jpg", position: "50% 50%" },
];

// Bande Instagram en bas de page : des images du site, liées au compte.
// Pas de flux automatique (il faudrait un jeton Meta qui expire) : on
// change les chemins ici quand on veut.
const INSTAGRAM = [
  "/images/portfolio/hospitality/hotel-rathaus-wien/1.jpg",
  "/images/portfolio/travel/villach/5.jpg",
  "/images/portfolio/hospitality/altstadt-vienna/03-saris-home/1.jpg",
  "/images/portfolio/hospitality/naturel-dorf-schonleitn/7.jpg",
  "/images/portfolio/travel/graz/1.jpg",
];

export default async function HomePage({ params }: Props) {
  await params;
  const posts = allPosts().slice(0, 3);

  return (
    <main className={s.main}>
      <section className={s.hero}>
        <Image
          src={HERO.background}
          alt="A ramen restaurant on a street corner in Tokyo at night"
          fill
          priority
          sizes="100vw"
          quality={78}
          className={s.heroBg}
        />
        <span className={s.heroVeil} aria-hidden="true" />
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>I photograph <em>the way it feels.</em></h1>
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
          Travel photographer &amp; content creator. I work in natural light, with nothing staged. I arrive before everyone else, often at five in the morning, to catch the moment a room or a street feels like itself. Sometimes I step into the frame, to tell the stay from the inside.
        </p>
        <Link href="/en/about" className={s.introButton}>Read my story</Link>
      </section>

      {BANDS.map((b) => (
        <Band key={b.href} {...b} />
      ))}

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
        <div className={s.instaRow}>
          {INSTAGRAM.map((src) => (
            <a key={src} href="https://www.instagram.com/sandrinecppns/" target="_blank" rel="noopener noreferrer" className={s.instaTile} aria-label="Instagram @sandrinecppns">
              <Image src={src} alt="" fill sizes="(max-width: 767px) 50vw, 20vw" quality={70} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
