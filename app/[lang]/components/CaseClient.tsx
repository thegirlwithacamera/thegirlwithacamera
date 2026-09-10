import { brandsForCase, COMMISSION_LABEL } from "@/lib/brands";

// Le client d'un cas, en bas de sa page, apres les photos et le film et juste
// avant l'appel a discuter. Le visiteur qui a fait defiler toutes les images
// arrive dessus au moment ou il se demande si c'est du travail commande, et
// enchaine sur le bouton.
//
// Les logos ne sont pas cliquables : ils menent au cas ou l'on se trouve deja.
export default function CaseClient({
  lang,
  category,
  caseSlug,
}: {
  lang: "fr" | "en";
  category: string;
  caseSlug: string;
}) {
  const brands = brandsForCase(category, caseSlug);
  if (brands.length === 0) return null;

  return (
    <>
      <style>{`
        .case-client {
          max-width: var(--page-max);
          margin: clamp(48px, 6vw, 72px) auto 0;
          padding: 0 var(--pad);
          display: flex;
          align-items: center;
          gap: 26px;
          flex-wrap: wrap;
        }
        .case-client-label {
          font-family: var(--font-sans);
          font-size: var(--text-label);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--stone);
          margin: 0;
        }
        .case-client-logos { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }
        .case-client-logo {
          height: 40px;
          width: auto;
          max-width: 170px;
          object-fit: contain;
          opacity: 0.85;
          display: block;
          mix-blend-mode: multiply;
        }
        .case-client-logo--tall { height: 52px; }
        @media (max-width: 767px) {
          .case-client { padding: 0 12px; gap: 16px; }
          .case-client-logo { height: 32px; max-width: 130px; }
          .case-client-logo--tall { height: 42px; }
        }
      `}</style>
      <div className="case-client">
        <p className="case-client-label">{COMMISSION_LABEL[lang]}</p>
        <div className="case-client-logos">
          {brands.map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={b.name}
              src={b.logo}
              alt={b.name}
              className={`case-client-logo${b.tall ? " case-client-logo--tall" : ""}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
