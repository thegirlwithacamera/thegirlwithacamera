"use client";

import Link from "next/link";
import { PUBLISHED_DIARY_CATS, type Diary, type DiaryCat } from "./constants";
import { findCaseByFilm } from "../photographer/constants";
import type { Clip } from "../creator/constants";
import { FocusOverlay, useVideoSound } from "../components/VideoShowcase";
import { Caption, Cta, PageHead, Section } from "../components/editorial";
import s from "./FilmmakerClient.module.css";

// ─────────────────────────────────────────────────────────────
// Page Vidéaste.
//
// Refaite le 01/09. C'était un carrousel avec des onglets : la seule page du
// site à cacher son contenu. Il fallait faire défiler pour découvrir, donc un
// hôtelier voyait un film et devinait les autres, et les vignettes n'avaient
// pour titre qu'un nom de fichier.
//
// C'est maintenant la même grille que la page Photographe, deux blocs, les
// maisons puis les villes, tout visible d'un coup. Une vignette porte le nom
// du lieu et sa ville quand le film est rattaché à un cas, avec un lien vers
// ses photos. Le clic ouvre le film en grand dans l'overlay, qui n'a pas
// bougé.
//
// Les URLs /filmmaker/places et /filmmaker/cities restent valables : avec une
// catégorie active, la page n'affiche que ce bloc.
// ─────────────────────────────────────────────────────────────

// Vocabulaire aligné sur la grille photo : un hôtelier retrouve les mêmes
// mots d'une page à l'autre. La description dit la prestation, pas seulement
// l'esthétique : le film fait partie des formules, il doit se commander.
type Head = { title: string; sub?: string; lede?: string };
type Content = {
  title: string;
  eyebrow: string;
  desc: string;
  offer: string;
  photos: string;
  heads: Record<DiaryCat, Head>;
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    title: "Des films qui montrent *où\u00a0l'on\u00a0est*, et comment on y vit.",
    eyebrow: "Vidéaste",
    desc: "Films et verticales pour les maisons, les tables et les marques. Lumière naturelle, montage narratif, sound design.",
    offer: "Voir les formules",
    photos: "Voir les photos",
    heads: {
      hotels: {
        title: "Hôtels & maisons",
        sub: "",
        lede: "Un film de maison, tourné pendant qu'elle vit : les chambres, les couloirs, les gestes du personnel.",
      },
      tables: {
        title: "Restaurants & bars",
        sub: "",
        lede: "Un film de table, pendant le service et en lumière existante : la salle, le bar, les mains qui travaillent.",
      },
      spa: {
        title: "Spa & bien-être",
        sub: "",
        lede: "Un film de spa, là où l'on ne photographie pas les gens : la vapeur, l'eau, le silence.",
      },
      cities: {
        title: "Villes",
        sub: "Mon œil sur la ville",
        lede: "Un film de ville pour un office du tourisme, une région ou une maison qui veut montrer où elle se trouve autant que ce qu'elle est.",
      },
      trains: {
        title: "Trains",
        sub: "Ce qui se passe entre deux villes",
        lede: "Un film de trajet pour une compagnie ferroviaire ou un opérateur de voyage : le quai, la fenêtre, les heures qui passent, et la ville qui arrive.",
      },
      places: { title: "Maisons & tables", sub: "" },
      lifestyle: { title: "Quotidien", sub: "" },
      fashion: { title: "Mode", sub: "" },
      bts: { title: "Coulisses", sub: "" },
    },
  },
  en: {
    title: "Films that show *where\u00a0you\u00a0are*, and how it feels to be there.",
    eyebrow: "Filmmaker",
    desc: "Films and verticals for houses, tables and brands. Natural light, narrative editing, sound design.",
    offer: "See the packages",
    photos: "See the photographs",
    heads: {
      hotels: {
        title: "Hotels & houses",
        sub: "",
        lede: "A film of a house while it is alive: the rooms, the corridors, the gestures of the people who work there.",
      },
      tables: {
        title: "Restaurants & bars",
        sub: "",
        lede: "A film of a table during service, in the light that is there: the room, the bar, the hands at work.",
      },
      spa: {
        title: "Spa & wellness",
        sub: "",
        lede: "A film of a spa, where people are not photographed: the steam, the water, the quiet.",
      },
      cities: {
        title: "Cities",
        sub: "The city, the way I see it",
        lede: "A city film for a tourism board, a region, or a house that wants to show where it stands as much as what it is.",
      },
      trains: {
        title: "Trains",
        sub: "What happens between two cities",
        lede: "A journey film for a rail company or a travel operator: the platform, the window, the hours going by, and the city arriving.",
      },
      places: { title: "Houses & tables", sub: "" },
      lifestyle: { title: "Lifestyle", sub: "" },
      fashion: { title: "Fashion", sub: "" },
      bts: { title: "Behind the scenes", sub: "" },
    },
  },
};

export default function FilmmakerClient({
  lang,
  diary,
  activeCat,
  live = [],
}: {
  lang: "fr" | "en";
  diary: Diary;
  activeCat?: DiaryCat;
  live?: string[];
}) {
  const t = content[lang];
  const { sound, focused, closeFocus } = useVideoSound();
  // Une categorie publiee s'affiche des son premier film. Le seuil etait a
  // deux : il cachait Trains, ouvert avec le seul film Interrail.
  const cats = PUBLISHED_DIARY_CATS.filter((c) => diary[c].length >= 1);
  const shown = activeCat && cats.includes(activeCat) ? [activeCat] : cats;
  const isAll = !activeCat || !cats.includes(activeCat);

  const tile = (clip: Clip, key: string) => {
    const found = findCaseByFilm(clip.src);
    const hasPage = !!found && live.includes(`${found.cat.slug}/${found.item.slug}`);
    const title = found ? found.item.label[lang] : clip.label;
    // Le libelle du film ET le lieu. Avant, un film libelle ("Le restaurant",
    // "La nuit") remplacait le lieu : la vignette Van der Valk Selys disait
    // "Le restaurant" sans jamais dire Liege, et Tokyo ne disait pas le Japon.
    const filmLabel = found?.film.label?.[lang];
    const place = found?.item.place?.[lang];
    const sub = [filmLabel, place].filter(Boolean).join(" · ") || undefined;
    return (
      <div key={key} className={s.item}>
        <button
          type="button"
          className={s.thumb}
          onClick={() => sound.openFocus(clip, "tablet")}
          aria-label={clip.label || "Film"}
        >
          {clip.poster ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={clip.poster} alt={clip.label || ""} loading="lazy" />
          ) : (
            <video src={clip.src} preload="metadata" muted playsInline />
          )}
          <span className={s.play} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
        <Caption className={s.cap} title={title} sub={sub} align="left" inline />
        {hasPage && found && (
          <Link href={`/${lang}/photographer/${found.cat.slug}/${found.item.slug}`} className={s.link}>
            {t.photos} →
          </Link>
        )}
      </div>
    );
  };

  return (
    <main className={s.main}>
      <PageHead eyebrow={t.eyebrow} title={t.title} lede={t.desc} split>
        <Cta href={`/${lang}/services`}>{t.offer} →</Cta>
        {/* Cinq rubriques empilees, dont trois d'un ou deux films, donnaient
            cinq rangees trouees. La page d'ensemble montre donc tous les
            films dans une grille pleine, et les pastilles menent a la
            rubrique. Meme dispositif que les pieces d'un cas photo. */}
        <nav className={s.chips} aria-label={lang === "fr" ? "Rubriques" : "Sections"}>
          <Link
            href={`/${lang}/filmmaker`}
            className={`${s.chip}${isAll ? ` ${s.chipOn}` : ""}`}
            aria-current={isAll ? "page" : undefined}
          >
            {lang === "fr" ? "Tout" : "All"}
          </Link>
          {cats.map((c) => (
            <Link
              key={c}
              href={`/${lang}/filmmaker/${c}`}
              className={`${s.chip}${activeCat === c ? ` ${s.chipOn}` : ""}`}
              aria-current={activeCat === c ? "page" : undefined}
            >
              {t.heads[c].title}
            </Link>
          ))}
        </nav>
      </PageHead>

      {isAll ? (
        <Section className={s.first}>
          <div className={s.tier}>
            <div className={s.grid}>
              {cats.flatMap((cat) => diary[cat].map((clip, j) => tile(clip, `${cat}-${j}`)))}
            </div>
          </div>
        </Section>
      ) : (
        shown.map((cat) => (
          <Section
            key={cat}
            title={t.heads[cat].title}
            sub={t.heads[cat].sub || undefined}
            lede={t.heads[cat].lede}
            className={s.first}
          >
            <div className={s.tier}>
              <div className={s.grid}>
                {diary[cat].map((clip, j) => tile(clip, `${cat}-${j}`))}
              </div>
            </div>
          </Section>
        ))
      )}

      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
