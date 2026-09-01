import type { Metadata } from "next";
import Link from "next/link";
import { WORK } from "@/lib/offers";
import ServicesForm from "./ServicesForm";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    // Pas de suffixe ici : app/[lang]/layout.tsx applique le gabarit
    // "%s · The Girl With A Camera". L'ecrire deux fois le sortait deux fois.
    title:
      lang === "fr"
        ? "Prestations photo et vidéo pour hôtels et restaurants"
        : "Photo and film services for hotels and restaurants",
    description:
      lang === "fr"
        ? "Reportage photo et vidéo pour hôtels, maisons d'hôtes, restaurants et bars. Sandrine Ceuppens, basée à Bruxelles, disponible en déplacement en Europe."
        : "Photography and film for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, available for travel across Europe.",
    alternates: {
      canonical: `/${lang}/services`,
      languages: { fr: "/fr/services", en: "/en/services" },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Page Services, créée le 01/09.
//
// Elle porte l'offre, qui vivait jusque là dans une ancre au milieu de la
// page À propos. La page Vidéaste promettait « les formules » sans qu'aucune
// page de formules existe : c'est celle-ci.
//
// AUCUN MONTANT sur cette page. Règle déjà tranchée : le rate card est prêt,
// le prix se discute après réponse, et un tarif publié devient le plafond des
// suivants. Une page d'offre sans prix ne tient que si elle est très concrète
// sur les livrables, d'où le détail de ce qui est reçu dans chaque formule.
//
// AUCUN DÉLAI DE LIVRAISON annoncé non plus : écrit sur une page publique il
// devient un engagement. Il va dans le devis, au cas par cas.
//
// Les trois cartes d'offre viennent de lib/offers.ts. Elles vivaient sur la
// page À propos et se sont retrouvées en double ici le 01/09, avec deux
// textes différents pour la même prestation. Celles d'À propos étaient les
// bonnes : elles viennent de la grille hôtels, avec les livrables et les
// droits formule par formule.
//
// C'est pour ça que le bloc « Les droits » générique a disparu : il disait
// « usage organique sans limite de durée » pour tout, ce qui est vrai des
// hôtels et faux du film de marque et du contenu récurrent, tous deux à
// douze mois. Chaque carte porte ses propres droits.
// ─────────────────────────────────────────────────────────────

const COPY = {
  fr: {
    h1: "Services",
    howTitle: "Comment ça se passe",
    how: [
      "Vous m'écrivez la ville, les dates et ce que vous voulez montrer.",
      "Je reviens avec une proposition, un nombre d'images et un devis.",
      "Je viens tourner.",
      "Vous recevez la sélection.",
    ],
    formTitle: "Un projet en tête ?",
    talk: "Parlons-en",
  },
  en: {
    h1: "Services",
    howTitle: "How it works",
    how: [
      "You tell me the city, the dates and what you want to show.",
      "I come back with a proposal, a number of images and a quote.",
      "I come and shoot.",
      "You receive the selection.",
    ],
    formTitle: "Have a project in mind?",
    talk: "Let's talk",
  },
} as const;

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const c = COPY[lang];
  const work = WORK[lang];

  return (
    <>
      <style>{`
        .svc-head { text-align: center; padding: 8px 20px 0; }
        .svc-head h1 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0;
          font-weight: 400;
        }
        .svc-lede {
          max-width: 560px;
          margin: 18px auto 0;
          padding: 0 20px;
          font-size: 15px;
          line-height: 1.7;
          color: #525252;
          text-align: center;
        }
        .svc-wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        /* Trois cartes, meme gabarit, alignees en bas grace au flex :
           sans ca, les CTA se retrouvent a trois hauteurs differentes. */
        .svc-offers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 64px;
        }
        .svc-offer {
          display: flex;
          flex-direction: column;
          border: 1px solid #ebebeb;
          padding: 30px 26px;
        }
        .svc-offer .o-emoji { font-size: 22px; line-height: 1; margin-bottom: 14px; }
        .svc-offer h2 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 16px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
          margin: 0 0 8px;
        }
        .svc-offer .o-sub { margin: 0 0 20px; font-size: 13px; line-height: 1.6; color: #525252; }
        .svc-offer .o-pkg {
          margin: 0 0 10px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a0a;
        }
        .svc-offer .o-pkg.is-addons { margin-top: 20px; color: #999; }
        .svc-offer ul { list-style: none; padding: 0; margin: 0; }
        .svc-offer li {
          position: relative;
          padding-left: 14px;
          margin-bottom: 8px;
          font-size: 12.5px;
          line-height: 1.55;
          color: #525252;
        }
        .svc-offer li::before { content: "·"; position: absolute; left: 2px; color: #b3aca2; }
        .svc-offer .o-addons li { color: #777; font-size: 11.5px; }
        .svc-offer .o-proof {
          display: inline-block;
          margin-top: 18px;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #999;
          text-decoration: none;
          border-bottom: 1px solid #e5e5e5;
          padding-bottom: 2px;
        }
        .svc-offer .o-proof:hover { color: #0a0a0a; border-color: #0a0a0a; }
        .svc-offer .o-cta-wrap { margin-top: auto; padding-top: 26px; }
        .svc-offer .o-cta {
          display: inline-block;
          border: 1px solid #0a0a0a;
          padding: 11px 22px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
        }
        .svc-offer .o-cta:hover { background: #0a0a0a; color: #fff; }
        .svc-section { margin-top: 72px; }
        .svc-section h2 {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #999;
          font-weight: 400;
          margin: 0 0 18px;
        }
        .svc-section p, .svc-section li { font-size: 14px; line-height: 1.7; color: #525252; }
        .svc-section p { margin: 0 0 10px; }
        .svc-steps { margin: 0; padding-left: 20px; }
        .svc-steps li { margin-bottom: 8px; }
        .services-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 22px;
          margin-top: 18px;
        }
        .services-form .is-full { grid-column: 1 / -1; }
        .services-form label { display: block; }
        .services-form label > span {
          display: block;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 6px;
        }
        .services-form input,
        .services-form select,
        .services-form textarea {
          width: 100%;
          border: none;
          border-bottom: 1px solid #e5e5e5;
          background: transparent;
          padding: 6px 0;
          font: inherit;
          font-size: 14px;
          color: #0a0a0a;
          border-radius: 0;
        }
        .services-form textarea { resize: vertical; border: 1px solid #e5e5e5; padding: 10px; }
        .services-form input:focus,
        .services-form select:focus,
        .services-form textarea:focus { outline: none; border-color: #0a0a0a; }
        .form-actions { display: flex; align-items: center; gap: 16px; }
        .services-form button {
          border: 1px solid #0a0a0a;
          background: #0a0a0a;
          color: #fff;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 12px 28px;
          cursor: pointer;
        }
        .services-form button:disabled { opacity: 0.5; cursor: default; }
        .form-note { font-size: 13px; color: #525252; margin: 18px 0 0; }
        .form-note.is-error { color: #a33; margin: 0; }
        @media (max-width: 767px) {
          .svc-head h1 { font-size: 18px; }
          .svc-lede { font-size: 14px; }
          .svc-offers { grid-template-columns: 1fr; gap: 14px; margin-top: 46px; }
          .svc-offer { padding: 24px 20px; }
          .svc-section { margin-top: 52px; }
          .services-form { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "84px", background: "#ffffff" }}>
        <div className="svc-head">
          <h1>{c.h1}</h1>
        </div>
        <p className="svc-lede">{work.intro}</p>

        <div className="svc-wrap">
          <div className="svc-offers">
            {work.offers.map((o) => (
              <div key={o.title} className="svc-offer">
                <div className="o-emoji">{o.emoji}</div>
                <h2>{o.title}</h2>
                <p className="o-sub">{o.subtitle}</p>
                {o.packageName && <p className="o-pkg">{o.packageName}</p>}
                <ul>
                  {o.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                {o.addons && o.addons.length > 0 && (
                  <>
                    {o.addonsLabel && <p className="o-pkg is-addons">{o.addonsLabel}</p>}
                    <ul className="o-addons">
                      {o.addons.map((ad) => <li key={ad}>{ad}</li>)}
                    </ul>
                  </>
                )}
                {o.proof && (
                  <Link href={`/${lang}${o.proof.href}`} className="o-proof">
                    {o.proof.label} →
                  </Link>
                )}
                <div className="o-cta-wrap">
                  {/* Vers le formulaire de la meme page, pas un mailto : un
                      lien mailto donne un mail vide, le formulaire un brief. */}
                  <a className="o-cta" href="#contact">{c.talk}</a>
                </div>
              </div>
            ))}
          </div>

          <section className="svc-section">
            <h2>{c.howTitle}</h2>
            <ol className="svc-steps">
              {c.how.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>

          <section className="svc-section" id="contact">
            <h2>{c.formTitle}</h2>
            <ServicesForm lang={lang} />
          </section>
        </div>
      </main>

    </>
  );
}
