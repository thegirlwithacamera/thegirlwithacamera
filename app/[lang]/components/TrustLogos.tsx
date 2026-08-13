import { BRANDS, TRUST_LABEL } from "@/lib/brands";

// Bande "Ils me font confiance" partagee entre About et Creator.
// Source unique des donnees : lib/brands.ts. Composant presentationnel sans
// hook, utilisable aussi bien dans un composant serveur (About) que client
// (CreatorClient). CSS auto-contenu pour ne dependre d'aucune page.
export default function TrustLogos({ lang }: { lang: "fr" | "en" }) {
  return (
    <>
      <style>{`
        .trust-label { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; color: #999999; text-align: center; margin: 0 0 20px; }
        .brands-strip { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 24px 36px; max-width: 920px; margin: 0 auto; padding: 0 24px; }
        .brand-chip { font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0a0a0a; }
        .brand-logo { height: 38px; width: auto; max-width: 170px; object-fit: contain; opacity: 0.88; transition: opacity 0.2s; }
        .brand-logo:hover { opacity: 1; }
        .brand-logo--tall { height: 58px; }
        @media (max-width: 767px) {
          .brand-chip { font-size: 11px; letter-spacing: 0.1em; }
          .brand-logo { height: 28px; max-width: 120px; }
          .brand-logo--tall { height: 42px; }
        }
      `}</style>
      <p className="trust-label">{TRUST_LABEL[lang]}</p>
      <div className="brands-strip">
        {BRANDS.map((b) =>
          b.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b.name} src={b.logo} alt={b.name} className={`brand-logo${b.tall ? " brand-logo--tall" : ""}`} />
          ) : (
            <span key={b.name} className="brand-chip">{b.name}</span>
          )
        )}
      </div>
    </>
  );
}
