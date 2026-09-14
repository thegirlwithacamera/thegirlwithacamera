import type { Testimonial } from "../photographer/constants";

// Le mot du client, en bas de la page du travail dont il parle, juste avant
// son logo. Un avis isole sur une page "temoignages" ne prouve rien : pose
// sous les photos qu'il commente, il est verifiable a l'oeil.
//
// Les liens vers le client sont dans la citation parce que le client l'a
// demande en echange de l'autorisation de publier. rel="noopener" seulement :
// ce sont deux liens choisis, pas des liens subis.
export default function CaseTestimonial({
  lang,
  t,
  work,
  flush,
}: {
  lang: "fr" | "en";
  t: Testimonial;
  // Lien vers le travail dont parle le client. Inutile sur la page du cas,
  // ou l'on vient de le voir ; indispensable sur About, ou le mot arrive
  // sans les images.
  work?: { href: string; label: string };
  // Pose dans un bloc qui porte deja la largeur et les marges laterales
  // (la bande clients d'About) : le cadre ne doit pas etre applique deux fois.
  flush?: boolean;
}) {
  return (
    <>
      <style>{`
        .case-quote {
          max-width: var(--page-max);
          margin: clamp(56px, 7vw, 88px) auto 0;
          padding: 0 var(--pad);
        }
        .case-quote--flush { max-width: none; padding: 0; margin: clamp(32px, 4vw, 48px) 0 0; }
        .case-quote-inner {
          max-width: 46em;
          border-top: 1px solid var(--line);
          padding-top: clamp(20px, 2.4vw, 30px);
        }
        .case-quote blockquote {
          margin: 0;
          font-family: var(--font-serif);
          font-size: clamp(17px, 1.5vw, 22px);
          line-height: 1.55;
          color: var(--ink);
        }
        .case-quote figcaption {
          margin-top: clamp(14px, 1.6vw, 20px);
          font-family: var(--font-sans);
          font-size: var(--text-label);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--stone);
          line-height: 1.9;
        }
        .case-quote figcaption span { display: block; }
        .case-quote figcaption a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .case-quote figcaption a + a { margin-left: 18px; }
        @media (max-width: 767px) {
          .case-quote { padding: 0 12px; }
          .case-quote--flush { padding: 0; }
        }
      `}</style>
      <figure className={`case-quote${flush ? " case-quote--flush" : ""}`}>
        <div className="case-quote-inner">
          <blockquote>{`“${t.quote[lang]}”`}</blockquote>
          <figcaption>
            <span>{t.author}, {t.role[lang]}</span>
            <span>{t.company}</span>
            {work && (
              <span><a href={work.href}>{work.label}</a></span>
            )}
            {t.links && t.links.length > 0 && (
              <span>
                {t.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>
                ))}
              </span>
            )}
          </figcaption>
        </div>
      </figure>
    </>
  );
}
