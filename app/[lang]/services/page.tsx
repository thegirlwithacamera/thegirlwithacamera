import type { Metadata } from "next";
import Link from "next/link";
import { WORK } from "@/lib/offers";
import { site } from "@/lib/site";
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
    faqTitle: "Les questions qu'on me pose",
    faq: [
      {
        q: "Vous vous déplacez ?",
        a: "Oui. Le transport est inclus dans un rayon de moins de deux heures de train depuis Bruxelles. Au delà, il se chiffre à part, et je regroupe volontiers plusieurs adresses sur un même déplacement.",
      },
      {
        q: "Combien de temps sur place ?",
        a: "D'une demi-journée à deux jours selon la taille de la maison, et une nuit sur place dans toutes les formules hôtel. C'est elle qui donne accès aux heures où le lieu est vide, entre six et neuf heures du matin.",
      },
      {
        q: "Faut-il fermer, ou vider les chambres ?",
        a: "Non. Je travaille pendant que la maison vit, en lumière naturelle. Une chambre libre le matin suffit, et le personnel peut rester dans le cadre, c'est souvent ce qui fait l'image.",
      },
      {
        q: "À qui appartiennent les images ?",
        a: "Je garde le droit d'auteur, vous recevez une licence. Elle couvre l'usage organique sans limite de durée pour l'adresse photographiée. Elle ne s'étend pas aux autres adresses du groupe et s'éteint en cas de changement d'enseigne ou de propriétaire.",
      },
      {
        q: "Et si on veut faire de la publicité avec ?",
        a: "C'est possible et ça se chiffre à part, selon le territoire, la durée et les médias. Même chose pour le print, les campagnes, l'exclusivité et le whitelisting. Les fichiers bruts, eux, ne se cèdent pas.",
      },
      {
        q: "Vous publiez sur vos propres canaux ?",
        a: "Cela dépend de la formule. Quand c'est prévu, la mention de partenariat est systématique.",
      },
    ],
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
    faqTitle: "Questions I get asked",
    faq: [
      {
        q: "Do you travel?",
        a: "Yes. Travel is included within two hours by train from Brussels. Beyond that it is quoted separately, and I am happy to group several addresses into one trip.",
      },
      {
        q: "How long on location?",
        a: "From half a day to two days depending on the size of the house, and a night on site in every hotel package. That night is what gives access to the hours when the place is empty, between six and nine in the morning.",
      },
      {
        q: "Do we need to close, or empty the rooms?",
        a: "No. I work while the house is alive, in natural light. One room free in the morning is enough, and your team can stay in the frame, that is often what makes the picture.",
      },
      {
        q: "Who owns the images?",
        a: "I keep the copyright, you receive a licence. It covers organic use with no time limit for the address photographed. It does not extend to the other addresses of the group and it ends if the name or the ownership changes.",
      },
      {
        q: "What if we want to advertise with them?",
        a: "That is possible and quoted separately, based on territory, duration and media. Same for print, campaigns, exclusivity and whitelisting. Raw files are not transferred.",
      },
      {
        q: "Do you post on your own channels?",
        a: "It depends on the package. When it is part of it, the partnership disclosure is always there.",
      },
    ],
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
        /* La FAQ est visible, et c'est le point : un balisage FAQ sans
           contenu affiche est un motif de sanction chez Google. Elle repond
           surtout aux questions qui bloquent une reservation. */
        .svc-faq { margin: 0; }
        .svc-faq details { border-bottom: 1px solid #ebebeb; }
        .svc-faq details:first-child { border-top: 1px solid #ebebeb; }
        .svc-faq summary {
          list-style: none;
          cursor: pointer;
          padding: 16px 24px 16px 0;
          position: relative;
          font-size: 14px;
          color: #0a0a0a;
        }
        .svc-faq summary::-webkit-details-marker { display: none; }
        /* La fleche : un chevron en CSS, qui pivote a l'ouverture. */
        .svc-faq summary::after {
          content: "";
          position: absolute;
          right: 4px;
          top: 21px;
          width: 7px;
          height: 7px;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          transform: rotate(45deg);
          transition: transform 0.25s ease;
        }
        .svc-faq details[open] summary::after { transform: rotate(-135deg); top: 24px; }
        .svc-faq summary:hover { color: #0a0a0a; }
        .svc-faq details p {
          margin: 0;
          padding: 0 24px 18px 0;
          font-size: 14px;
          line-height: 1.7;
          color: #525252;
        }
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

          {/* La FAQ passe sous le formulaire le 01/09 : elle repond aux
              objections de celui qui hesite encore, elle ne doit pas
              s'interposer devant celui qui a deja decide d'ecrire.
              Repliee par defaut, une question par ligne : six reponses
              deroulees, c'est un mur de texte au bas d'une page d'offre. */}
          <section className="svc-section" id="faq">
            <h2>{c.faqTitle}</h2>
            <div className="svc-faq">
              {c.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Balisage FAQ. Il correspond mot pour mot aux questions affichées au
          dessus : c'est la condition posée par Google, et c'est pour ça que
          l'ancien FAQPage du layout, présent sur toutes les pages sans jamais
          être affiché, a été retiré. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${site.url}/${lang}/services#faq`,
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }) }} />
    </>
  );
}
