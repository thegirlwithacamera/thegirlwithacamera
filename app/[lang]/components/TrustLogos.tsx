import { BRAND_CATS, CAT_LABEL, TRUST_LABEL, brandsIn, type BrandCat } from "@/lib/brands";

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
// 3. Deux tailles de logo, pas une. Les marques ont des wordmarks larges qui
//    remplissent toute leur hauteur ; les adresses ont des marques compactes,
//    souvent carrees, avec de la marge interne. A hauteur egale les marques
//    ecrasaient les adresses, exactement l'inverse du message.
export default function TrustLogos({
  lang,
  cats = BRAND_CATS,
}: {
  lang: "fr" | "en";
  cats?: readonly BrandCat[];
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
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 0 0 22px; }
        .trust-group { margin: 0 auto 30px; }
        .trust-group:last-child { margin-bottom: 0; }
        .trust-cat { font-size: 8px; font-weight: 400; letter-spacing: 0.2em; color: #b3aca2; text-align: center; margin: 0 0 16px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 22px 34px; max-width: 920px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }
        .brand-logo { width: auto; object-fit: contain; opacity: 0.9; transition: opacity 0.2s; }
        .brand-logo:hover { opacity: 1; }

        .trust-group--stays .brand-logo,
        .trust-group--travel .brand-logo { height: 48px; max-width: 200px; }
        .trust-group--stays .brand-logo--tall,
        .trust-group--travel .brand-logo--tall { height: 64px; }

        /* Largeur bridee pour que les sept marques cassent en 4 puis 3 plutot
           qu'en 5 et un orphelin. */
        .trust-group--brand .brands-strip { max-width: 720px; }
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
          .brand-chip { font-size: 11px; letter-spacing: 0.1em; }
          .trust-group--stays .brand-logo,
          .trust-group--travel .brand-logo { height: 38px; max-width: 150px; }
          .trust-group--stays .brand-logo--tall,
          .trust-group--travel .brand-logo--tall { height: 50px; }
          .trust-group--brand .brand-logo { height: 24px; max-width: 120px; }
          .trust-group--brand .brand-logo--tall { height: 34px; }
        }
      `}</style>
      <p className="trust-label">{TRUST_LABEL[lang]}</p>
      {groups.map((g) => (
        <div className={`trust-group trust-group--${g.cat}`} key={g.cat}>
          {showCatLabels && <p className="trust-cat">{CAT_LABEL[g.cat][lang]}</p>}
          <div className="brands-strip">
            {g.brands.map((b) =>
              b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.name}
                  src={b.logo}
                  alt={b.name}
                  className={`brand-logo${b.tall ? " brand-logo--tall" : ""}`}
                />
              ) : (
                <span key={b.name} className="brand-chip">{b.name}</span>
              ),
            )}
          </div>
        </div>
      ))}
    </>
  );
}
