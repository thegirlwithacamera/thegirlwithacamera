import type { Metadata } from "next";
import { allCases, HOME_TILES } from "./photographer/constants";
import { readCaseCover, readCaseChapters } from "@/lib/portfolio";
import { pageMeta } from "@/lib/seo";
import { Cta, Display, Eyebrow, Lede, ProjectCard, ProjectGrid } from "./components/editorial";
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
      ? "Photographe et vidéaste pour les hôtels, les maisons d'hôtes, les restaurants et les bars. Sandrine Ceuppens, basée à Bruxelles, en déplacement en Europe."
      : "Photographer and filmmaker for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, travelling across Europe.",
  });
}

const COPY = {
  fr: {
    eyebrow: "Sandrine Ceuppens, photographe et vidéaste, Bruxelles",
    title: "Hôtels, tables et villes, photographiés *dans la lumière qui était là*.",
    lede: "Des maisons, des tables et des rues, en lumière naturelle, sans mise en scène ajoutée. Chaque tuile ouvre un lieu.",
    journalEyebrow: "Le journal",
    journalTitle: "Ce qui se passe *entre les images*",
    journalLede: "La rue, le voyage et les coulisses des tournages, dans une lettre presque chaque semaine.",
    journalCta: "Lire sur Substack →",
  },
  en: {
    eyebrow: "Sandrine Ceuppens, photographer and filmmaker, Brussels",
    title: "Hotels, tables and cities photographed *in the light that was there*.",
    lede: "Houses, tables and streets, in natural light, with nothing staged on top. Every tile opens a place.",
    journalEyebrow: "The journal",
    journalTitle: "What happens *between the pictures*",
    journalLede: "Street, travel and what goes on behind the shoots, in a letter most weeks.",
    journalCta: "Read on Substack →",
  },
} as const;

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

  return (
    <>
      <main className={s.main}>
        <div className={s.intro}>
          <Eyebrow className={s.eyebrow}>{t.eyebrow}</Eyebrow>
          <Display size="xl" as="h1">{t.title}</Display>
          <Lede className={s.lede} tone="stone">{t.lede}</Lede>
        </div>

        <ProjectGrid>
          {homeCases.map((c, i) => (
            <ProjectCard
              key={c.key}
              href={`/${lang}${c.href}`}
              cover={c.cover}
              alt={c.item.intro ? c.item.intro.en : `${c.item.label.en} — ${c.cat.label.en} photographed by Sandrine Ceuppens`}
              title={c.name}
              sub={c.sub}
              priority={i < 3}
              coverPosition={c.item.coverPosition}
            />
          ))}
          {HOME_TILES.map((tile) => (
            <ProjectCard
              key={tile.key}
              href={`/${lang}${tile.href}`}
              cover={tile.cover}
              alt=""
              title={tile.label[lang]}
              coverPosition={tile.coverPosition}
              quality={72}
              door
            />
          ))}
        </ProjectGrid>

        <div className={s.journal}>
          <Eyebrow className={s.eyebrow}>{t.journalEyebrow}</Eyebrow>
          <Display size="m" as="h2">{t.journalTitle}</Display>
          <Lede className={s.lede} tone="stone">{t.journalLede}</Lede>
          <Cta href="https://thegirlwithacamera.substack.com/" external>{t.journalCta}</Cta>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "Portfolio by Sandrine Ceuppens",
        description: "Hotels, guesthouses, restaurants and bars photographed by Sandrine Ceuppens across Europe",
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
