import type { Metadata } from "next";
import { allCases, HOME_TILES } from "./photographer/constants";
import { readCaseCover, readCaseChapters } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PHOTO_CATEGORIES } from "./photographer/constants";
import { Caption, Display, DoorTile, Eyebrow, Lede, ProjectCard, ProjectGrid, SectionBar } from "./components/editorial";
import s from "./page.module.css";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// Génération statique des deux langues au build. Indispensable depuis que
// l'accueil lit public/images avec fs pour trouver les couvertures : sur
// Vercel, next.config.ts exclut public/ des fonctions serveur, donc une page
// rendue à la demande ne voit aucun fichier et la grille sort vide.
export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "",
    title: lang === "fr"
      ? "The Girl With A Camera · Sandrine Ceuppens, photographe et vidéaste à Bruxelles"
      : "The Girl With A Camera · Sandrine Ceuppens, photographer and filmmaker in Brussels",
    description: lang === "fr"
      ? "Photographe et vidéaste pour les hôtels, les maisons d'hôtes, les restaurants et les bars. Sandrine Ceuppens, basée à Bruxelles, en déplacement partout dans le monde."
      : "Photographer and filmmaker for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, travelling worldwide.",
  });
}

const COPY = {
  fr: {
    eyebrow: "Sandrine Ceuppens · Bruxelles · en déplacement dans le monde entier",
    title: "Hôtels, tables et villes, photographiés *dans la lumière qui était là*.",
    lede: "Des maisons, des tables et des rues, en lumière naturelle, sans mise en scène ajoutée.",
    all: "Tout voir",
    film: "Film",
    about: "À propos",
  },
  en: {
    eyebrow: "Sandrine Ceuppens · Brussels · travelling worldwide",
    title: "Hotels, tables and cities photographed *in the light that was there*.",
    lede: "Houses, tables and streets, in natural light, with nothing staged on top.",
    all: "See all",
    film: "Film",
    about: "About",
  },
} as const;

// La photo de l'ouverture, à droite de l'accroche. Une verticale, jamais
// recadrée. Chemin absolu dans public. Changer ici suffit.
const FEATURE = {
  cover: "/images/portfolio/hospitality/altstadt-vienna/03-saris-home/1.jpg",
  href: "/photographer/hospitality/altstadt-vienna#03-saris-home",
  name: { fr: "Sari's Home", en: "Sari's Home" },
  sub: { fr: "Altstadt Vienna · Vienne", en: "Altstadt Vienna · Vienna" },
};

// ─────────────────────────────────────────────────────────────
// ACCUEIL : grande introduction éditoriale, puis la grille de tous les
// projets, un par tuile, puis les portes. L'ordre vient de constants.ts.
// La logique des chapitres (Altstadt, chaptersAfter, chapterTileOrder) est
// inchangée depuis le 02/09 : seule la présentation change.
// ─────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const t = COPY[lang];

  const built = allCases().flatMap((c) => {
    if (c.item.chapterTiles) {
      const chapters = readCaseChapters(c.cat.slug, c.item.slug);
      const want = c.item.chapterTileOrder;
      if (want) {
        chapters.sort((a, b) => {
          const ia = want.indexOf(a.slug), ib = want.indexOf(b.slug);
          return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        });
      }
      if (chapters.length > 0) {
        return chapters.map((ch) => {
          const name = c.item.chapters?.[ch.slug]?.[lang] ?? ch.slug;
          const house = c.item.short?.[lang] ?? c.item.label[lang];
          const place = c.item.place?.[lang];
          const sub = name === house ? place : place ? `${house} · ${place}` : house;
          return {
            ...c,
            key: `${c.cat.slug}/${c.item.slug}/${ch.slug}`,
            cover: ch.photos[0].src,
            name,
            sub,
            href: `${c.href}#${ch.slug}`,
          };
        });
      }
    }
    const cover = readCaseCover(c.cat.slug, c.item.slug);
    return cover
      ? [{
          ...c,
          key: `${c.cat.slug}/${c.item.slug}`,
          cover,
          name: c.item.short?.[lang] ?? c.item.label[lang],
          sub: c.item.place ? c.item.place[lang] : undefined,
          href: c.href,
        }]
      : [];
  });

  // Un cas à chapitres portant chaptersAfter ne garde que son premier
  // chapitre à sa place : les autres se rangent après la tuile du cas nommé.
  const homeCases = (() => {
    const out = [...built];
    for (const c of allCases()) {
      const after = c.item.chaptersAfter;
      if (!c.item.chapterTiles || !after) continue;
      const isMine = (t: (typeof out)[number]) =>
        t.key.startsWith(`${c.cat.slug}/${c.item.slug}/`);
      const mine = out.filter(isMine);
      if (mine.length < 2) continue;
      const rest = mine.slice(1);
      const kept = out.filter((t) => !rest.includes(t));
      const at = kept.findIndex((t) => t.key.endsWith(`/${after}`));
      if (at < 0) continue;
      out.length = 0;
      out.push(...kept.slice(0, at + 1), ...rest, ...kept.slice(at + 1));
    }
    return out;
  })();

  // Une section par catégorie, dans l'ordre de constants.ts, avec la barre
  // "Tout voir" vers la page de catégorie. L'ordre des tuiles reste celui
  // de homeCases.
  // Six tuiles par catégorie au maximum, deux rangées pleines. Le reste se
  // voit sur la page de la catégorie, d'où le lien "Tout voir". Sur téléphone
  // la grille n'en garde que deux, en CSS : douze tuiles à faire défiler avant
  // d'arriver à la deuxième catégorie, personne ne va au bout.
  const PER_CATEGORY = 6;
  const sections = PHOTO_CATEGORIES.map((cat) => {
    const all = homeCases.filter((c) => c.cat.slug === cat.slug);
    return { cat, tiles: all.slice(0, PER_CATEGORY), total: all.length };
  }).filter((sec) => sec.tiles.length > 0);

  const filmTile = HOME_TILES.find((tile) => tile.key === "film");
  const aboutTile = HOME_TILES.find((tile) => tile.key === "about");

  return (
    <>
      <main className={s.main}>
        <div className={s.opening}>
          <div className={s.openingText}>
            <Display size="l" as="h1">{t.title}</Display>
            <Eyebrow className={s.eyebrow}>{t.eyebrow}</Eyebrow>
            <Lede className={s.lede} tone="stone" align="left">{t.lede}</Lede>
          </div>
          <Link href={`/${lang}${FEATURE.href}`} className={s.feature}>
            <span className={s.featureThumb}>
              <Image
                src={FEATURE.cover}
                alt={`${FEATURE.name.en}, ${FEATURE.sub.en}, photographed by Sandrine Ceuppens`}
                width={1066}
                height={1600}
                sizes="(max-width: 900px) 420px, 520px"
                priority
                quality={80}
              />
            </span>
            <Caption className={s.featureCap} title={FEATURE.name[lang]} sub={FEATURE.sub[lang]} align="left" inline />
          </Link>
        </div>

        {sections.map((sec) => (
          <section key={sec.cat.slug} className={s.section}>
            <SectionBar
              label={sec.cat.label[lang]}
              href={`/${lang}/photographer/${sec.cat.slug}`}
              linkLabel={t.all}
            />
            <ProjectGrid className={s.grid}>
              {sec.tiles.map((c, i) => (
                <ProjectCard
                  key={c.key}
                  href={`/${lang}${c.href}`}
                  cover={c.cover}
                  alt={`${c.name}${c.sub ? `, ${c.sub}` : ""}, ${c.cat.label.en.toLowerCase()} photographed by Sandrine Ceuppens`}
                  title={c.name}
                  sub={c.sub}
                  priority={sec.cat.slug === sections[0].cat.slug && i < 3}
                  coverPosition={c.item.coverPosition}
                />
              ))}
            </ProjectGrid>
          </section>
        ))}

        <div className={s.doors}>
          {filmTile && <DoorTile href={`/${lang}${filmTile.href}`} cover={filmTile.cover} word={t.film} coverPosition={filmTile.coverPosition} />}
          {aboutTile && <DoorTile href={`/${lang}${aboutTile.href}`} cover={aboutTile.cover} word={t.about} coverPosition={aboutTile.coverPosition ?? "50% 30%"} />}
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `https://thegirlwithacamera.com/#business`,
        name: "The Girl With A Camera",
        alternateName: "Sandrine Ceuppens",
        url: `https://thegirlwithacamera.com/${lang}`,
        image: `https://thegirlwithacamera.com${FEATURE.cover}`,
        email: "mailto:hello@thegirlwithacamera.com",
        description: lang === "fr"
          ? "Photographe et vidéaste pour les hôtels, les maisons d'hôtes, les restaurants et les bars. Basée à Bruxelles, en déplacement partout dans le monde."
          : "Photographer and filmmaker for hotels, guesthouses, restaurants and bars. Based in Brussels, travelling worldwide.",
        address: { "@type": "PostalAddress", addressLocality: "Brussels", addressCountry: "BE" },
        areaServed: { "@type": "Place", name: "Worldwide" },
        founder: { "@type": "Person", name: "Sandrine Ceuppens" },
        knowsLanguage: ["fr", "en", "nl"],
        serviceType: lang === "fr"
          ? ["Photographie d'hôtel", "Photographie de restaurant", "Film de marque", "Photographie de voyage"]
          : ["Hotel photography", "Restaurant photography", "Brand film", "Travel photography"],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Portfolio by Sandrine Ceuppens",
        description: "Hotels, guesthouses, restaurants and bars photographed by Sandrine Ceuppens worldwide",
        numberOfItems: homeCases.length,
        associatedMedia: homeCases.map((c) => ({
          "@type": "ImageObject",
          url: `https://thegirlwithacamera.com${c.cover}`,
          name: `${c.item.label.en}${c.item.place ? `, ${c.item.place.en}` : ""}`,
          creator: { "@type": "Person", name: "Sandrine Ceuppens" }
        }))
      })}} />
    </>
  );
}
