import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WORK } from "@/lib/offers";
import { site } from "@/lib/site";
import ServicesForm from "./ServicesForm";
import { pageMeta } from "@/lib/seo";
import { PHOTO_CATEGORIES } from "../photographer/constants";
import { Cta, Display, PageHead } from "../components/editorial";
import s from "./page.module.css";
import "./form.css";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/services",
    // Pas de suffixe ici : app/[lang]/layout.tsx applique le gabarit
    // "%s · The Girl With A Camera". L'ecrire deux fois le sortait deux fois.
    title:
      lang === "fr"
        ? "Prestations photo et vidéo pour hôtels et restaurants"
        : "Photo and film services for hotels and restaurants",
    description:
      lang === "fr"
        ? "Reportage photo et vidéo pour hôtels, maisons d'hôtes, restaurants et bars. Sandrine Ceuppens, basée à Bruxelles, disponible partout dans le monde."
        : "Photography and film for hotels, guesthouses, restaurants and bars. Sandrine Ceuppens, based in Brussels, available for travel worldwide.",
  });
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
    title: "Photos et films pour *les lieux qui reçoivent*.",
    detail: "Voir le détail",
    examplesTitle: "Ce que ça donne",
    examples: [
      { href: "/photographer/hospitality", title: "Hôtels & maisons", sub: "Photo et film, le lieu entier" },
      { href: "/filmmaker", title: "Film de marque", sub: "Un film court pour une campagne" },
      { href: "/creator", title: "Contenu récurrent", sub: "Verticales pour vos canaux" },
    ],
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
        a: "Oui. Le transport est inclus dans un rayon de moins de deux heures de train depuis Bruxelles. Au-delà, il se chiffre à part, et je regroupe volontiers plusieurs adresses sur un même déplacement.",
      },
      {
        q: "Combien de temps sur place ?",
        a: "D'une demi-journée à deux jours selon la taille de la maison, et une nuit sur place dans toutes les formules hôtel. C'est cette nuit qui donne accès aux heures où le lieu est vide, entre six et neuf heures du matin.",
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
    title: "Photographs and films for *places that welcome*.",
    detail: "See the details",
    examplesTitle: "What it looks like",
    examples: [
      { href: "/photographer/hospitality", title: "Hotels & venues", sub: "Stills and film, the whole place" },
      { href: "/filmmaker", title: "Brand film", sub: "A short film for a campaign" },
      { href: "/creator", title: "Ongoing content", sub: "Verticals for your channels" },
    ],
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

// Images des trois exemples, une par offre. La première vient de la
// catégorie Hôtels, la deuxième est la tuile Film de l'accueil, la troisième
// le poster d'une vidéo Creator.
const EXAMPLE_IMAGES = [
  PHOTO_CATEGORIES.find((c) => c.slug === "hospitality")?.cover ?? "/images/tiles/film-schonleitn.jpg",
  "/images/tiles/film-schonleitn.jpg",
  "/videos/creator/GEAR/Ricoh GR III.jpg",
];

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  const c = COPY[lang];
  const work = WORK[lang];

  // "Essential: 1 day..." se coupe en deux colonnes sur le premier deux
  // points, quand il y en a un. Sinon la ligne reste entière.
  const splitItem = (it: string): [string | null, string] => {
    const m = it.match(/^([^:]{2,28}):\s+(.+)$/);
    return m ? [m[1], m[2]] : [null, it];
  };

  return (
    <>
      <main className={s.main}>
        <PageHead eyebrow={c.h1} title={c.title} lede={work.intro} split />

        <div className={s.wrap}>
          <div className={s.offers}>
            {work.offers.map((o, i) => (
              <article key={o.title} className={s.offer}>
                <div>
                  <p className={s.index}>{o.index}</p>
                  <h2 className={s.offerTitle}>{o.title}</h2>
                  <p className={s.offerSub}>{o.subtitle}</p>
                  <Cta href="#contact">{c.talk} →</Cta>
                </div>
                <div>
                  {o.packageName && <p className={s.pkg}>{o.packageName}</p>}
                  <ul className={s.list}>
                    {o.items.map((it) => {
                      const [k, v] = splitItem(it);
                      return <li key={it}>{k ? <><b>{k}</b><span>{v}</span></> : <span style={{ gridColumn: "1 / -1" }}>{v}</span>}</li>;
                    })}
                  </ul>
                  {o.addons && o.addons.length > 0 && (
                    <details className={s.details}>
                      <summary>{o.addonsLabel ?? c.detail}</summary>
                      <ul className={s.list}>
                        {o.addons.map((ad) => <li key={ad}><span style={{ gridColumn: "1 / -1" }}>{ad}</span></li>)}
                      </ul>
                      {o.proof && (
                        <p style={{ margin: "14px 0 0" }}><Cta href={`/${lang}${o.proof.href}`}>{o.proof.label} →</Cta></p>
                      )}
                    </details>
                  )}
                </div>
                <Link href={`/${lang}${c.examples[i].href}`} className={s.offerImg} aria-label={c.examples[i].title}>
                  <Image
                    src={EXAMPLE_IMAGES[i]}
                    alt={c.examples[i].title}
                    width={1066}
                    height={1600}
                    sizes="(max-width: 1023px) 360px, 320px"
                    quality={75}
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <section className={s.dark} id="contact">
          <div className={s.darkInner}>
            <div>
              <Display size="l" as="h2" className={s.darkTitle}>{c.formTitle}</Display>
              <ol className={s.steps}>
                {c.how.map((step, i) => (
                  <li key={step} className={s.step}>
                    <span className={s.stepNo}>{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <ServicesForm lang={lang} />
          </div>
        </section>

        <div className={s.wrap}>
          <section className={s.block} id="faq">
            <div className={s.blockHead}>
              <Display size="m" as="h2">{c.faqTitle}</Display>
            </div>
            <div className={s.faq}>
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
