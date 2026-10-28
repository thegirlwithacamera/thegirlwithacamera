import Link from "next/link";
import { Fragment } from "react";
import type React from "react";
import { BRAND_CATS, CAT_LABEL, CAT_NOTE, TRUST_LABEL, brandsIn, type BrandCat } from "@/lib/brands";

// Bande "Ils me font confiance" partagee entre About et Creator.
// Source unique des donnees : lib/brands.ts. Composant presentationnel sans
// hook, utilisable aussi bien dans un composant serveur (About) que client
// (CreatorClient). CSS auto-contenu pour ne dependre d'aucune page.
//
// Trois partis pris, poses le 31/08 :
//
// 1. Groupee par categorie, les adresses d'abord. En vrac, la liste faisait
//    lire cinq marques de materiel avant la premiere maison, et racontait donc
//    un metier de test de materiel.
//
// 2. Statique en desktop, pas de carrousel. A quatorze logos une grille montre
//    tout d'un coup et le visiteur trouve son cas en une seconde ; un slider en
//    cacherait dix et le ferait attendre pour savoir si son type
//    d'etablissement y figure. En mobile la ligne devient un defilement
//    horizontal, au doigt et jamais automatique : c'est le seul endroit ou
//    l'empilement est trop long.
//
//    28/10 : sur la page About, Sandrine préfère une ligne qui défile par
//    catégorie plutôt que plusieurs rangées (prop marquee). Les autres pages
//    gardent la grille statique.
//
// 4. Un logo qui mene au travail fait pour ce client devient un lien. Pas tous :
//    seulement ceux dont le contenu est en ligne, un logo cliquable qui ouvre
//    une page vide coutant plus cher que pas de lien.
//
//    Premiere version : rien ne les distinguait au repos, pour ne degrader
//    aucun client, le survol revelait. Resultat le 31/08 : "rien n'est
//    cliquable". Une petite legende sous le logo disait alors ce qu'on y
//    trouve (Photos & film, Film). Retiree le 28/10 a la demande de
//    Sandrine : le logo seul est cliquable, et pour les marques il n'y a plus
//    de lien par logo, c'est l'intertitre Brands qui mene a la page.
//
// 3. Deux tailles de logo, pas une. Les marques ont des wordmarks larges qui
//    remplissent toute leur hauteur ; les adresses ont des marques compactes,
//    souvent carrees, avec de la marge interne. A hauteur egale les marques
//    ecrasaient les adresses, exactement l'inverse du message.
export default function TrustLogos({
  lang,
  cats = BRAND_CATS,
  hideLabel = false,
  align = "center",
  noLinks = false,
  marquee = false,
}: {
  lang: "fr" | "en";
  cats?: readonly BrandCat[];
  // Quand la page pose déjà son propre titre au dessus de la bande.
  hideLabel?: boolean;
  align?: "center" | "left";
  // Logos sans lien (page Content creator, où les vidéos sont juste au dessus).
  noLinks?: boolean;
  // Une ligne qui défile par catégorie au lieu de plusieurs rangées (28/10,
  // demande de Sandrine pour la page About). Les logos sont répétés deux fois
  // pour boucler sans à-coup ; la copie est cachée aux lecteurs d'écran et au
  // clavier. Le défilement s'arrête au survol, et ne démarre pas si le
  // visiteur a demandé moins d'animations (la ligne se fait alors glisser).
  marquee?: boolean;
}) {
  const groups = cats
    .map((c) => ({ cat: c, brands: brandsIn(c) }))
    .filter((g) => g.brands.length > 0);
  if (groups.length === 0) return null;

  // Un seul groupe affiche : son intertitre ferait doublon avec le titre de la
  // bande, on ne le montre pas.
  const showCatLabels = groups.length > 1;

  return (
    <>
      <style>{`
        .trust-label { font-family: var(--font-sans); font-size: var(--text-label); font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; color: var(--stone); text-align: center; margin: 0 0 28px; }
        .trust-group { margin: 0 auto 40px; }
        .trust-group:last-child { margin-bottom: 0; }
        .trust-cat { font-family: var(--font-serif); font-style: italic; font-size: var(--text-body); color: var(--stone); text-align: center; margin: 0 0 20px; }
        .trust-cat a { color: inherit; text-decoration: none; border-bottom: 1px solid transparent; transition: color 0.2s, border-color 0.2s; }
        .trust-cat a:hover, .trust-cat a:focus-visible { color: var(--brick); border-bottom-color: currentColor; }
        .trust-note { font-family: var(--font-serif); font-size: var(--text-caption); line-height: 1.6; font-style: italic; color: var(--stone); text-align: center; max-width: 520px; margin: 18px auto 0; padding: 0 24px; }
        /* align-items: flex-start et une boite de hauteur fixe : les logos
           restent alignes entre eux, les legendes pendent en dessous sans
           decaler la rangee. */
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 22px 34px; max-width: 920px; margin: 0 auto; padding: 0 24px; }
        .brand-item { display: flex; flex-direction: column; align-items: center; gap: 9px; text-decoration: none; }
        .brand-box { display: flex; align-items: center; justify-content: center; }
        .brand-chip { font-family: var(--font-serif); font-size: var(--text-body); letter-spacing: 0.02em; color: var(--ink); }
        .brand-logo { width: auto; max-height: 100%; object-fit: contain; opacity: 0.85; transition: opacity 0.2s; display: block; mix-blend-mode: multiply; }
        .brand-link { transition: transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1); }
        .brand-link:hover { transform: translateY(-3px); }
        .brand-link:hover .brand-logo { opacity: 1; }

        /* Les adresses cassent en 4 puis 3 plutot qu'en 6 et un orphelin.
           A pleine largeur, Ce Pages se retrouvait seul sur sa ligne. */
        .trust-group--stays .brands-strip { max-width: 740px; }
        .trust-group--stays .brand-box,
        .trust-group--travel .brand-box { height: 64px; }
        .trust-group--stays .brand-logo,
        .trust-group--travel .brand-logo { height: 48px; max-width: 200px; }
        .trust-group--stays .brand-logo--tall,
        .trust-group--travel .brand-logo--tall { height: 64px; }

        /* Largeur bridee pour que les sept marques cassent en 4 puis 3 plutot
           qu'en 5 et un orphelin. */
        .trust-group--brand .brands-strip { max-width: 720px; }
        .trust-group--brand .brand-box { height: 44px; }
        .trust-group--brand .brand-logo { height: 30px; max-width: 150px; }
        .trust-group--brand .brand-logo--tall { height: 44px; }

        @media (max-width: 767px) {
          .trust-group { margin-bottom: 24px; }
          /* Une ligne qui se fait glisser au doigt. Pas d'autoplay : personne
             n'attend qu'un logo revienne pour savoir s'il est dans la liste. */
          .brands-strip {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            scroll-snap-type: x proximity;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 26px;
            padding: 0 20px 4px;
            max-width: none;
          }
          .brands-strip::-webkit-scrollbar { display: none; }
          .brands-strip > * { flex: 0 0 auto; scroll-snap-align: center; }
          .brand-chip { font-size: var(--text-caption); }
          .trust-group--stays .brand-box,
          .trust-group--travel .brand-box { height: 50px; }
          .trust-group--stays .brand-logo,
          .trust-group--travel .brand-logo { height: 38px; max-width: 150px; }
          .trust-group--stays .brand-logo--tall,
          .trust-group--travel .brand-logo--tall { height: 50px; }
          .trust-group--brand .brand-box { height: 34px; }
          .trust-group--brand .brand-logo { height: 24px; max-width: 120px; }
          .trust-group--brand .brand-logo--tall { height: 34px; }
        }
        .trust-left .brands-strip { justify-content: flex-start; padding: 0; margin: 0; max-width: none; }

        .brands-marquee {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
        .brands-track { display: flex; align-items: flex-start; width: max-content; animation: trust-scroll var(--trust-speed, 40s) linear infinite; }
        .trust-group:nth-of-type(even) .brands-track { animation-direction: reverse; }
        .brands-marquee:hover .brands-track, .brands-marquee:focus-within .brands-track { animation-play-state: paused; }
        .brands-track > * { flex: 0 0 auto; margin-right: clamp(32px, 4vw, 56px); }
        @keyframes trust-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .brands-marquee { overflow-x: auto; scrollbar-width: none; }
          .brands-track { animation: none; }
        }
        .trust-left .trust-note { text-align: left; padding: 0; margin-left: 0; }
      `}</style>
      {!hideLabel && <p className="trust-label">{TRUST_LABEL[lang]}</p>}
      {groups.map((g) => {
        const item = (b: (typeof g.brands)[number], copy = false) => {
          if (!b.logo) return <span key={b.name} className="brand-chip" aria-hidden={copy || undefined}>{b.name}</span>;
          const box = (
            <span className="brand-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.logo}
                alt={b.name}
                className={`brand-logo${b.tall ? " brand-logo--tall" : ""}`}
              />
            </span>
          );
          // Marques : pas de lien par logo, c'est l'intertitre Brands qui mène
          // à la page (28/10, Sandrine).
          if (!b.href || noLinks || g.cat === "brand") return <span key={b.name} className="brand-item" aria-hidden={copy || undefined}>{box}</span>;
          return (
            <Link
              key={b.name}
              href={`/${lang}${b.href}`}
              className="brand-item brand-link"
              aria-hidden={copy || undefined}
              tabIndex={copy ? -1 : undefined}
              title={b.hrefLabel ? `${b.name} — ${b.hrefLabel[lang]}` : b.name}
            >
              {box}
            </Link>
          );
        };
        // La boucle : assez de logos pour dépasser la largeur d'un grand écran
        // (au moins huit), puis la même suite une seconde fois. Le défilement
        // va jusqu'à la moitié et repart, sans à-coup.
        const half = Array.from({ length: Math.ceil(8 / g.brands.length) }, () => g.brands).flat();
        const loop = [...half, ...half];
        return (
          <div className={`trust-group trust-group--${g.cat}${align === "left" ? " trust-left" : ""}`} key={g.cat}>
            {showCatLabels && (
              <p className="trust-cat">
                {g.cat === "brand" ? <Link href={`/${lang}/creator`}>{CAT_LABEL[g.cat][lang]} →</Link> : CAT_LABEL[g.cat][lang]}
              </p>
            )}
            {marquee ? (
              <div className="brands-marquee">
                <div className="brands-track" style={{ "--trust-speed": `${half.length * 4}s` } as React.CSSProperties}>
                  {loop.map((b, i) => <Fragment key={`${b.name}-${i}`}>{item(b, i >= g.brands.length)}</Fragment>)}
                </div>
              </div>
            ) : (
              <div className="brands-strip">{g.brands.map((b) => item(b))}</div>
            )}
            {CAT_NOTE[g.cat] && <p className="trust-note">{CAT_NOTE[g.cat]![lang]}</p>}
          </div>
        );
      })}
    </>
  );
}
