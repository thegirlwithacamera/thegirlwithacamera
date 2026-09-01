import type { Metadata } from "next";
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
    title:
      lang === "fr"
        ? "Prestations photo et vidéo pour hôtels et restaurants · The Girl With A Camera"
        : "Photo and film services for hotels and restaurants · The Girl With A Camera",
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
// Le bloc droits reprend les décisions des 27 et 28 août : usage organique
// sans limite de durée pour l'adresse photographiée, le payant chiffré à
// part, licence non transférable, fichiers bruts jamais cédés. Ne jamais
// écrire « illimité » sans « organique ».
// ─────────────────────────────────────────────────────────────

type Block = { title: string; body: string[] };

const COPY = {
  fr: {
    h1: "Services",
    lede: "Je photographie et je filme des lieux qui reçoivent. Hôtels, maisons, tables, bars. Lumière naturelle, et les gestes qui vont avec.",
    blocks: [
      {
        title: "Photographe",
        body: [
          "Un reportage sur place, d'une demi-journée à deux jours selon la taille de la maison. Chambres, espaces communs, détails, extérieurs, et la table s'il y en a une.",
          "Vous recevez une sélection retouchée, en horizontal et en vertical, prête pour votre site, la presse et les plateformes de réservation.",
        ],
      },
      {
        title: "Vidéaste",
        body: [
          "Un film court ou une série de verticaux, tournés pendant le reportage photo ou sur une production dédiée. Concept, tournage, montage, son.",
          "Vous recevez le film en 16:9, les verticaux en 9:16, et les sous-titres.",
        ],
      },
      {
        title: "Créatrice",
        body: [
          "Du contenu pensé pour vos canaux, pour les miens, ou pour les deux. Vidéos produit, tutoriels, unboxing, formats parlés.",
          "La publication sur mes canaux dépend de la formule, toujours avec la mention de partenariat.",
        ],
      },
    ] as Block[],
    rightsTitle: "Les droits",
    rights: [
      "Chaque formule inclut l'usage organique, sans limite de durée, pour l'adresse photographiée.",
      "Ce qui est payant, publicité, boost, whitelisting, se chiffre à part selon le territoire, la durée et les médias.",
      "La licence appartient à l'établissement photographié. Elle ne s'étend pas aux autres adresses du groupe et s'éteint en cas de changement d'enseigne ou de propriétaire.",
      "Les fichiers bruts ne sont pas cédés.",
    ],
    howTitle: "Comment ça se passe",
    how: [
      "Vous m'écrivez la ville, les dates et ce que vous voulez montrer.",
      "Je reviens avec une proposition, un nombre d'images et un devis.",
      "Je viens tourner.",
      "Vous recevez la sélection.",
    ],
    formTitle: "Un projet en tête ?",
  },
  en: {
    h1: "Services",
    lede: "I photograph and film places that welcome people. Hotels, houses, tables, bars. Natural light, and the gestures that come with it.",
    blocks: [
      {
        title: "Photographer",
        body: [
          "A shoot on location, from half a day to two days depending on the size of the house. Rooms, common spaces, details, exteriors, and the table if there is one.",
          "You receive an edited selection, horizontal and vertical, ready for your website, the press and booking platforms.",
        ],
      },
      {
        title: "Filmmaker",
        body: [
          "A short film or a set of verticals, shot alongside the photographs or as a dedicated production. Concept, filming, editing, sound.",
          "You receive the film in 16:9, the verticals in 9:16, and the subtitles.",
        ],
      },
      {
        title: "Creator",
        body: [
          "Content made for your channels, for mine, or for both. Product videos, tutorials, unboxing, talking formats.",
          "Posting on my own channels depends on the package, always with the partnership disclosure.",
        ],
      },
    ] as Block[],
    rightsTitle: "Rights",
    rights: [
      "Every package includes organic use, with no time limit, for the address photographed.",
      "Anything paid, advertising, boosting, whitelisting, is scoped and quoted separately based on duration, territory and media.",
      "The licence belongs to the establishment photographed. It does not extend to the other addresses of the group and it ends if the name or the ownership changes.",
      "Raw files are not transferred.",
    ],
    howTitle: "How it works",
    how: [
      "You tell me the city, the dates and what you want to show.",
      "I come back with a proposal, a number of images and a quote.",
      "I come and shoot.",
      "You receive the selection.",
    ],
    formTitle: "Have a project in mind?",
  },
} as const;

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const c = COPY[lang];

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
        .svc-wrap { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        .svc-blocks {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 64px;
        }
        .svc-block h2 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          font-weight: 400;
          margin: 0 0 14px;
        }
        .svc-block p { margin: 0 0 12px; font-size: 14px; line-height: 1.65; color: #525252; }
        .svc-block p:last-child { margin-bottom: 0; }
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
          .svc-blocks { grid-template-columns: 1fr; gap: 34px; margin-top: 46px; }
          .svc-section { margin-top: 52px; }
          .services-form { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "84px", background: "#ffffff" }}>
        <div className="svc-head">
          <h1>{c.h1}</h1>
        </div>
        <p className="svc-lede">{c.lede}</p>

        <div className="svc-wrap">
          <div className="svc-blocks">
            {c.blocks.map((b) => (
              <div key={b.title} className="svc-block">
                <h2>{b.title}</h2>
                {b.body.map((p) => <p key={p}>{p}</p>)}
              </div>
            ))}
          </div>

          <section className="svc-section">
            <h2>{c.rightsTitle}</h2>
            {c.rights.map((p) => <p key={p}>{p}</p>)}
          </section>

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
