"use client";

import Link from "next/link";
import { DIARY_CATS, type Diary, type DiaryCat } from "./constants";
import {
  Carousel,
  FocusOverlay,
  SHOWCASE_CSS,
  useVideoSound,
} from "../components/VideoShowcase";

// Vocabulaire aligné sur la grille photo : un hôtelier retrouve les mêmes
// mots d'une page à l'autre. La description dit la prestation, pas seulement
// l'esthétique : le film fait partie des formules, il doit se commander.
const content = {
  fr: {
    title: "VIDÉASTE",
    desc: "Films de marque et verticales pour les maisons, les tables et les marques. Lumière naturelle, montage narratif, sound design.",
    offer: "Voir les formules",
    cat: { places: "MAISONS & TABLES", cities: "VOYAGE", lifestyle: "QUOTIDIEN", fashion: "MODE", bts: "COULISSES" },
  },
  en: {
    title: "FILMMAKER",
    desc: "Brand films and verticals for hotels, tables and brands. Natural light, narrative editing, sound design.",
    offer: "See the packages",
    cat: { places: "HOTELS & VENUES", cities: "TRAVEL", lifestyle: "LIFESTYLE", fashion: "FASHION", bts: "BTS" },
  },
};

export default function FilmmakerClient({
  lang,
  diary,
  activeCat,
}: {
  lang: "fr" | "en";
  diary: Diary;
  activeCat?: DiaryCat; // categorie active sur /filmmaker/[categorie]
}) {
  const t = content[lang];
  const { sound, focused, closeFocus } = useVideoSound();

  // Une catégorie s'affiche à partir de 2 films. En dessous, l'onglet promet
  // une série et ouvre sur une vidéo seule. Mode est dans ce cas aujourd'hui,
  // avec un seul clip sans titre.
  const cats = DIARY_CATS.filter((c) => diary[c].length >= 2);
  const current = activeCat && cats.includes(activeCat) ? activeCat : cats[0];

  return (
    <main style={{ paddingTop: "20px", paddingBottom: "24px", background: "#ffffff" }}>
      <style>{`

        /* Tiers */
        .tier { max-width: 1260px; margin: 0 auto; padding: 0 40px; }
        .tier-head { text-align: center; margin-bottom: 24px; }
        .tier-title { font-size: 13px; font-weight: 700; letter-spacing: 0.22em; color: #0a0a0a; margin: 0 0 12px; }
        .tier-desc {
          font-size: 11px;
          line-height: 1.9;
          letter-spacing: 0.05em;
          color: #999999;
          max-width: 560px;
          margin: 0 auto;
          font-style: italic;
        }

        /* Onglets categories (liens : chaque categorie a son URL) */
        .diary-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
          margin: 0 auto 24px;
          border-bottom: 1px solid #ebebeb;
          max-width: 560px;
        }
        .diary-tab {
          display: inline-block;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 8px 16px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          margin-bottom: -1px;
        }
        .diary-tab:hover { color: #555; }
        .diary-tab--active { color: #0a0a0a; border-bottom-color: #0a0a0a; }

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

        ${SHOWCASE_CSS}

        @media (max-width: 767px) {
          .tier { padding: 0 12px; }
          .diary-tab { padding: 8px 11px; font-size: 9px; letter-spacing: 0.16em; }
        }
      `}</style>

      <section className="tier">
        <div className="tier-head">
          <h1 className="tier-title">{t.title}</h1>
          <p className="tier-desc">{t.desc}</p>
          <Link href={`/${lang}/about#travailler-avec-moi`} className="film-offer">
            {t.offer} →
          </Link>
        </div>
        {cats.length > 1 && (
          <div className="diary-tabs">
            {cats.map((c) => (
              <Link
                key={c}
                href={`/${lang}/filmmaker/${c}`}
                className={`diary-tab${c === current ? " diary-tab--active" : ""}`}
              >
                {t.cat[c]}
              </Link>
            ))}
          </div>
        )}
        {current && (
          <Carousel clips={diary[current]} kind="tablet" prefix={`diary-${current}`} sound={sound} />
        )}
      </section>


      {/* Mise en avant au clic */}
      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
