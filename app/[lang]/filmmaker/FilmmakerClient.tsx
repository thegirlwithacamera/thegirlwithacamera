"use client";

import Link from "next/link";
import { PUBLISHED_DIARY_CATS, type Diary, type DiaryCat } from "./constants";
import { findCaseByFilm } from "../photographer/constants";
import type { Clip } from "../creator/constants";
import {
  FocusOverlay,
  SHOWCASE_CSS,
  useVideoSound,
} from "../components/VideoShowcase";

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
  desc: string;
  offer: string;
  photos: string;
  heads: Record<DiaryCat, Head>;
};

const content: Record<"fr" | "en", Content> = {
  fr: {
    title: "VIDÉASTE",
    desc: "Films de marque et verticales pour les maisons, les tables et les marques. Lumière naturelle, montage narratif, sound design.",
    offer: "Voir les formules",
    photos: "Voir les photos",
    heads: {
      places: { title: "Maisons & tables", sub: "" },
      cities: {
        title: "Voyage",
        sub: "Mon œil sur la ville",
        lede: "Un film de ville pour un office du tourisme, une compagnie de train, une région ou une maison qui veut montrer où elle se trouve autant que ce qu'elle est.",
      },
      lifestyle: { title: "Quotidien", sub: "" },
      fashion: { title: "Mode", sub: "" },
      bts: { title: "Coulisses", sub: "" },
    },
  },
  en: {
    title: "FILMMAKER",
    desc: "Brand films and verticals for hotels, tables and brands. Natural light, narrative editing, sound design.",
    offer: "See the packages",
    photos: "See the photographs",
    heads: {
      places: { title: "Hotels & venues", sub: "" },
      cities: {
        title: "Travel",
        sub: "The city, the way I see it",
        lede: "A city film for a tourism board, a rail company, a region, or a house that wants to show where it stands as much as what it is.",
      },
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
  activeCat?: DiaryCat; // categorie active sur /filmmaker/[categorie]
  // Cas dont la page existe vraiment, sous la forme "categorie/cas".
  // Fourni par la page serveur, qui seule peut lire les dossiers d'images.
  live?: string[];
}) {
  const t = content[lang];
  const { sound, focused, closeFocus } = useVideoSound();

  // Une catégorie s'affiche à partir de 2 films. En dessous, le bloc promet
  // une série et ouvre sur une vidéo seule.
  const cats = PUBLISHED_DIARY_CATS.filter((c) => diary[c].length >= 2);
  const shown = activeCat && cats.includes(activeCat) ? [activeCat] : cats;

  const tile = (clip: Clip, key: string) => {
    const found = findCaseByFilm(clip.src);
    // La page du lieu n'existe que si son dossier d'images n'est pas vide.
    // Le nom et le libelle du film s'affichent quand meme : ils viennent de
    // constants.ts et valent mieux qu'un titre deduit d'un nom de fichier.
    const hasPage = !!found && live.includes(`${found.cat.slug}/${found.item.slug}`);
    return (
      <div key={key} className="film-item">
        <button
          type="button"
          className="film-thumb"
          onClick={() => sound.openFocus(clip, "tablet")}
          aria-label={clip.label || "Film"}
        >
          {clip.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={clip.poster} alt={clip.label || ""} loading="lazy" />
          ) : (
            <video src={clip.src} preload="metadata" muted playsInline />
          )}
          <span className="film-play" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
        <p className="film-title">
          {found ? found.item.label[lang] : clip.label}
          {/* Le libellé du film passe avant la ville : deux films d'un même
              cas (Tokyo le jour, Tokyo la nuit) affichaient sinon la même
              vignette deux fois. */}
          {found?.film.label ? (
            <span className="film-place">{found.film.label[lang]}</span>
          ) : found?.item.place ? (
            <span className="film-place">{found.item.place[lang]}</span>
          ) : null}
        </p>
        {hasPage && found && (
          <Link
            href={`/${lang}/photographer/${found.cat.slug}/${found.item.slug}`}
            className="film-link"
          >
            {t.photos} →
          </Link>
        )}
      </div>
    );
  };

  return (
    <main style={{ paddingTop: "20px", paddingBottom: "72px", background: "#ffffff" }}>
      <style>{`
        .tier { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
        .tier-head { text-align: center; margin-bottom: 10px; }
        .tier-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 14px;
        }
        .tier-desc {
          font-size: 14px;
          line-height: 1.65;
          color: #525252;
          max-width: 560px;
          margin: 0 auto;
        }

        /* Lien vers les formules : le film est vendu dans les packs hôteliers,
           la page doit donc mener quelque part. */
        .film-offer {
          display: block;
          width: fit-content;
          margin: 18px auto 0;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          border-bottom: 1px solid #d8d2c8;
          padding-bottom: 4px;
          transition: border-color 0.25s ease;
        }
        .film-offer:hover { border-color: #0a0a0a; }

        /* En-tête de bloc, même traitement que la page Photographe. */
        .film-section { text-align: center; margin: 76px 0 28px; }
        .film-section h2 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 22px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
          margin: 0 0 6px;
        }
        .film-section p {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
        }
        /* Le bloc Voyage dit a qui il s'adresse : sans ca, il se lit comme
           un carnet de voyage et pas comme une prestation. */
        .film-section .film-lede {
          max-width: 560px;
          margin: 16px auto 0;
          font-size: 14px;
          line-height: 1.65;
          letter-spacing: 0;
          text-transform: none;
          color: #525252;
        }

        /* La grille. 16:9 parce qu'un film n'est pas une photo de portfolio,
           et trois colonnes comme partout ailleurs sur le site. */
        .film-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 26px 22px;
          max-width: 1260px;
          margin: 0 auto;
        }
        .film-item { display: block; }
        .film-thumb {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0a0a0a;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .film-thumb img,
        .film-thumb video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        .film-thumb:hover img,
        .film-thumb:hover video { transform: scale(1.04); }
        .film-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(4px);
          padding-left: 2px;
          transition: background 0.25s ease;
        }
        .film-thumb:hover .film-play { background: rgba(10, 10, 10, 0.65); }
        .film-title {
          margin: 10px 0 0;
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
        }
        .film-place { color: #b3aca2; margin-left: 6px; }
        .film-link {
          display: block;
          margin-top: 4px;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c4bdb3;
          text-decoration: none;
        }
        .film-link:hover { color: #0a0a0a; }

        ${SHOWCASE_CSS}

        @media (max-width: 767px) {
          .tier { padding: 0 12px; }
          .tier-title { font-size: 18px; }
          .tier-desc { font-size: 13px; }
          .film-grid { grid-template-columns: 1fr; gap: 20px; }
          .film-section { margin: 54px 0 22px; }
          .film-section h2 { font-size: 17px; }
          .film-title { font-size: 9px; letter-spacing: 0.14em; }
        }
      `}</style>

      <section className="tier">
        <div className="tier-head">
          <h1 className="tier-title">{t.title}</h1>
          <p className="tier-desc">{t.desc}</p>
          {/* Pointait vers une ancre d'À propos qui ne porte plus les offres :
              elles ont leur page depuis le 01/09. */}
          <Link href={`/${lang}/services`} className="film-offer">
            {t.offer} →
          </Link>
        </div>

        {shown.map((cat) => (
          <div key={cat}>
            <div className="film-section">
              <h2>{t.heads[cat].title}</h2>
              {t.heads[cat].sub && <p>{t.heads[cat].sub}</p>}
              {t.heads[cat].lede && <p className="film-lede">{t.heads[cat].lede}</p>}
            </div>
            <div className="film-grid">
              {diary[cat].map((clip, i) => tile(clip, `${cat}-${i}`))}
            </div>
          </div>
        ))}
      </section>

      {/* Mise en avant au clic */}
      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
