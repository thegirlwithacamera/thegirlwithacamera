import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PHOTO_CATEGORIES, findCase } from "../../constants";
import { readCasePhotos, countCasePhotos, readCaseCover, readCaseChapters } from "@/lib/portfolio";
import { posterForPath } from "@/lib/creator-videos";
import PhotoPager from "../PhotoPager";
import CaseFilms from "./CaseFilms";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: "fr" | "en"; category: string; case: string }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).flatMap((lang) =>
    PHOTO_CATEGORIES.flatMap((cat) =>
      cat.cases
        .filter((c) => countCasePhotos(cat.slug, c.slug) > 0)
        .map((c) => ({ lang, category: cat.slug, case: c.slug })),
    ),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) return {};
  const { cat, item } = found;
  const place = item.place ? `, ${item.place[lang]}` : "";
  return pageMeta({
    lang,
    path: `/photographer/${cat.slug}/${item.slug}`,
    type: "article",
    title: `${item.label[lang]} · ${cat.label[lang]}`,
    // La phrase du cas fait une meilleure description que le gabarit : elle
    // décrit le lieu au lieu de répéter la catégorie.
    description: item.intro
      ? item.intro[lang]
      : lang === "fr"
        ? `${item.label.fr}${place}, ${cat.label.fr.toLowerCase()} photographiés par Sandrine Ceuppens, The Girl With A Camera.`
        : `${item.label.en}${place}, ${cat.label.en.toLowerCase()} photographed by Sandrine Ceuppens, The Girl With A Camera.`,
    // La carte de partage montre la maison, pas le logo du site : c'est ce
    // lien qu'on envoie à l'hôtel.
    image: readCaseCover(cat.slug, item.slug) ?? undefined,
    imageAlt: `${item.label[lang]}${place}`,
  });
}

// "01-suite-du-toit" donne "Suite du toit". Le numéro sert à l'ordre des
// dossiers, il ne s'affiche pas. Une seule majuscule, en tête : ce sont des
// noms de pièces en français, pas des titres à l'anglaise.
function chapterTitle(slug: string): string {
  const t = slug.replace(/^\d+[\s._-]*/, "").replace(/[-_]+/g, " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : slug;
}

// ─────────────────────────────────────────────────────────────
// Page d'un cas : les images du dossier
// public/images/portfolio/<catégorie>/<cas>/, dans l'ordre des numéros.
// Au delà de 9 images, le pager reprend la main.
// ─────────────────────────────────────────────────────────────

export default async function PhotographerCasePage({ params }: Props) {
  const { lang, category, case: caseSlug } = await params;
  const found = findCase(category, caseSlug);
  if (!found) notFound();
  const { cat, item } = found;

  const photos = readCasePhotos(cat.slug, item.slug);
  if (photos.length === 0) notFound();

  // Chapitres : un sous-dossier par chambre, par salle, par moment. Vide pour
  // un cas classique, qui reste rendu exactement comme avant.
  const chapters = readCaseChapters(cat.slug, item.slug).map((ch) => ({
    ...ch,
    title: item.chapters?.[ch.slug]?.[lang] ?? chapterTitle(ch.slug),
  }));

  // Les films du lieu, sous les photos. Le label ne s'affiche que s'il y en a
  // plusieurs : avec un seul film, le titre de la page le nomme déjà.
  const films = (item.films ?? []).map((f) => ({
    src: f.src,
    poster: posterForPath(f.src),
    label: item.films!.length > 1 ? f.label?.[lang] : undefined,
  }));

  const backLabel =
    lang === "fr" ? `← ${cat.label.fr}` : `← ${cat.label.en}`;

  return (
    <>
      <style>{`
        .cat-head { text-align: center; padding: 8px 20px 28px; }
        .cat-head h1 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0 0 6px;
          font-weight: 400;
        }
        .cat-head .case-place { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #999; }
        /* Deux phrases sous le titre. Un hôtelier qui arrive ici doit lire ce
           que le lieu fait à l'image avant de faire défiler, et une page de
           douze photos sans un mot ne se positionne sur rien. */
        .case-intro {
          max-width: 560px;
          margin: 18px auto 0;
          font-size: 14px;
          line-height: 1.65;
          color: #525252;
          text-align: center;
        }
        .case-intro .case-shot { display: block; margin-top: 6px; color: #999; font-size: 13px; }
        .cat-back {
          display: inline-block;
          margin: 0 auto 4px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          text-decoration: none;
        }
        .cat-back:hover { color: #0a0a0a; }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .photo-cell { display: block; aspect-ratio: 1066 / 1600; overflow: hidden; position: relative; background: #f2f2f2; }
        .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pager-outer { max-width: 1260px; margin: 0 auto; padding: 0 20px; }
        .pager-viewport { overflow: hidden; outline: none; }
        .pager-track { display: flex; transition: transform 0.45s ease; }
        .pager-page {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .pager-dots { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 28px; }
        .pager-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d4d4d4;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .pager-dot:hover { background: #999; }
        .pager-dot.is-active { background: #0a0a0a; transform: scale(1.4); }
        /* Chapitres. Le titre est un intertitre discret, pas un second h1 :
           la page reste celle de la maison, la chambre est une étape. */
        .case-chapter { margin: 0 0 54px; }
        /* La grille d'un chapitre est en flex, pas en grid : une chambre fait
           rarement un multiple de trois photos, et une dernière rangée à une
           seule image collée à gauche avec deux trous à droite se lit comme un
           bug. En flex avec justify-content center, la rangée incomplète se
           centre et la page reste tenue. */
        .case-chapter .photo-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .case-chapter .photo-grid .photo-cell {
          flex: 0 0 calc((100% - 44px) / 3);
        }
        .case-chapter:last-of-type { margin-bottom: 0; }
        .case-chapter-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          text-align: center;
          margin: 0 0 20px;
        }
        @media (max-width: 767px) {
          .case-chapter { margin-bottom: 34px; }
          .case-chapter-title { font-size: 11px; letter-spacing: 0.16em; margin-bottom: 14px; }
          .case-chapter .photo-grid .photo-cell { flex-basis: calc((100% - 16px) / 3); }
        }
        .case-films { max-width: 1260px; margin: 0 auto; padding: 64px 20px 0; }
        .case-films-head {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          font-weight: 400;
          text-align: center;
          margin: 0 0 22px;
        }
        .case-film { margin: 0 0 40px; }
        .case-film:last-child { margin-bottom: 0; }
        .case-film-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #0a0a0a;
          overflow: hidden;
        }
        /* Un vertical ne s'étire pas sur 1260px : il garde sa colonne. */
        .case-film.is-vertical .case-film-frame { max-width: 420px; margin: 0 auto; }
        .case-film-frame video { width: 100%; height: 100%; display: block; object-fit: contain; }
        .case-film-play,
        .case-film-sound {
          position: absolute;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: rgba(10, 10, 10, 0.45);
          backdrop-filter: blur(4px);
          transition: background 0.2s ease;
        }
        .case-film-play {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 58px;
          height: 58px;
          border-radius: 50%;
          padding-left: 3px;
        }
        .case-film-play:hover { background: rgba(10, 10, 10, 0.7); }
        .case-film-sound {
          right: 12px;
          bottom: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        .case-film-sound:hover { background: rgba(10, 10, 10, 0.7); }
        .case-film-cap {
          margin-top: 10px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          text-align: center;
        }
        @media (max-width: 767px) {
          .photo-grid { gap: 8px; padding: 0 12px; }
          .pager-outer { padding: 0 12px; }
          .pager-page { gap: 8px; }
          .cat-head h1 { font-size: 18px; }
          .case-films { padding: 44px 12px 0; }
          .case-film { margin-bottom: 28px; }
          .case-film-play { width: 46px; height: 46px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "24px", background: "#ffffff" }}>
        <div className="cat-head">
          <div>
            <Link href={`/${lang}/photographer/${cat.slug}`} className="cat-back">{backLabel}</Link>
          </div>
          <h1>{item.label[lang]}</h1>
          {item.place && <span className="case-place">{item.place[lang]}</span>}
          {item.intro && (
            <p className="case-intro">
              {item.intro[lang]}
              {item.shotAt && <span className="case-shot">{item.shotAt[lang]}</span>}
            </p>
          )}
        </div>

        {chapters.length > 0 ? (
          /* Cas à chapitres : chaque sous-dossier devient une section titrée.
             Pas de pager ici, on fait défiler : le visiteur suit la visite
             pièce par pièce, et un carrousel par chambre rendrait la page
             illisible. Les images sont chargées paresseusement sauf les
             premières, donc soixante photos ne coûtent rien à l'ouverture. */
          chapters.map((ch, ci) => (
            <section key={ch.slug} className="case-chapter">
              <h2 className="case-chapter-title">{ch.title}</h2>
              <div className="photo-grid">
                {ch.photos.map((p, i) => (
                  <div key={p.src} className="photo-cell">
                    <Image
                      src={p.src}
                      alt={ci === 0 && i === 0 && item.intro
                        ? `${item.label.en}, ${item.intro.en}`
                        : `${item.label.en}, ${ch.title}, photograph ${i + 1} by Sandrine Ceuppens`}
                      width={1066}
                      height={1600}
                      sizes="(max-width: 767px) 33vw, 420px"
                      priority={ci === 0 && i < 3}
                      quality={75}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : photos.length > 12 ? (
          <PhotoPager photos={photos} catLabel={`${item.label.en} — ${cat.label.en}`} />
        ) : (
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div key={i} className="photo-cell">
                <Image
                  src={p.src}
                  // La première image porte la phrase du cas, les suivantes le
                  // gabarit. Douze alt identiques n'apportent rien ; une vraie
                  // phrase sur l'image d'ouverture, si.
                  alt={i === 0 && item.intro
                    ? `${item.label.en}, ${item.intro.en}`
                    : `${item.label.en} — ${cat.label.en} photograph ${i + 1} by Sandrine Ceuppens`}
                  width={1066}
                  height={1600}
                  sizes="(max-width: 767px) 33vw, 420px"
                  priority={i < 6}
                  quality={75}
                />
              </div>
            ))}
          </div>
        )}

        <CaseFilms films={films} lang={lang} />
      </main>

      {/* Fil d'Ariane : Google affiche le chemin sous le resultat plutot que
          l'URL brute, et comprend que la page appartient a une categorie. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: lang === "fr" ? "Photographe" : "Photographer", item: `https://thegirlwithacamera.com/${lang}/photographer` },
          { "@type": "ListItem", position: 2, name: cat.label[lang], item: `https://thegirlwithacamera.com/${lang}/photographer/${cat.slug}` },
          { "@type": "ListItem", position: 3, name: item.label[lang] },
        ],
      }) }} />
    </>
  );
}
