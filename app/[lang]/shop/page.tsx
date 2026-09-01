import type { Metadata } from "next";
import { LIVE_PRODUCTS } from "@/lib/products";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export function generateStaticParams() {
  return (["fr", "en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Presets et guides" : "Presets and guides",
    description:
      lang === "fr"
        ? "Presets Lightroom et guides de photographie par Sandrine Ceuppens, The Girl With A Camera."
        : "Lightroom presets and photography guides by Sandrine Ceuppens, The Girl With A Camera.",
    alternates: {
      canonical: `/${lang}/shop`,
      languages: { fr: "/fr/shop", en: "/en/shop" },
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Page produits, hors navigation.
//
// Elle n'est dans aucun menu, décision du 01/09 : un hôtelier qui regarde le
// portfolio ne doit pas croiser un bouton d'achat. Elle reste indexable et
// dans le sitemap, parce que « presets Ricoh GR » est une requête que des
// gens tapent. C'est le lien à mettre en bio, dans le Substack et sur
// Pinterest, où onze épingles de presets attendaient une page de vente.
//
// Rien ne se paie ici : Gumroad porte la vente, la livraison et la TVA. Le
// site est la vitrine, et c'est tout ce qu'il doit être.
//
// Le contenu se règle dans lib/products.ts.
// ─────────────────────────────────────────────────────────────

const COPY = {
  fr: {
    h1: "Presets et guides",
    lede: "Ce que j'utilise, mis à disposition. Les fichiers sont livrés par Gumroad, paiement et TVA compris.",
    cta: "Voir sur Gumroad",
    empty: "Rien en vente pour le moment.",
    note: "Une question avant d'acheter ? hello@thegirlwithacamera.com",
  },
  en: {
    h1: "Presets and guides",
    lede: "What I use, made available. Files are delivered by Gumroad, payment and VAT included.",
    cta: "See on Gumroad",
    empty: "Nothing on sale right now.",
    note: "A question before buying? hello@thegirlwithacamera.com",
  },
} as const;

export default async function ShopPage({ params }: Props) {
  const { lang } = await params;
  const c = COPY[lang];

  return (
    <>
      <style>{`
        .shop-head { text-align: center; padding: 8px 20px 0; }
        .shop-head h1 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin: 0;
          font-weight: 400;
        }
        .shop-lede {
          max-width: 520px;
          margin: 18px auto 0;
          padding: 0 20px;
          font-size: 14px;
          line-height: 1.7;
          color: #525252;
          text-align: center;
        }
        .shop-list { max-width: 720px; margin: 56px auto 0; padding: 0 20px; }
        .shop-item { border-top: 1px solid #ebebeb; padding: 28px 0; }
        .shop-item:last-child { border-bottom: 1px solid #ebebeb; }
        .shop-kind {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b3aca2;
          margin: 0 0 8px;
        }
        .shop-item h2 {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 19px;
          font-weight: 400;
          color: #0a0a0a;
          margin: 0 0 10px;
        }
        .shop-item p.blurb { margin: 0 0 18px; font-size: 14px; line-height: 1.7; color: #525252; }
        .shop-item a {
          display: inline-block;
          border: 1px solid #0a0a0a;
          padding: 11px 22px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
        }
        .shop-item a:hover { background: #0a0a0a; color: #fff; }
        .shop-note {
          max-width: 720px;
          margin: 40px auto 0;
          padding: 0 20px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        @media (max-width: 767px) {
          .shop-head h1 { font-size: 18px; }
          .shop-list { margin-top: 38px; }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "84px", background: "#ffffff" }}>
        <div className="shop-head">
          <h1>{c.h1}</h1>
        </div>
        <p className="shop-lede">{c.lede}</p>

        <div className="shop-list">
          {LIVE_PRODUCTS.length === 0 && <p className="shop-lede">{c.empty}</p>}
          {LIVE_PRODUCTS.map((p) => (
            <div key={p.slug} className="shop-item">
              <p className="shop-kind">{p.kind[lang]}</p>
              <h2>{p.title[lang]}</h2>
              <p className="blurb">{p.blurb[lang]}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {c.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="shop-note">{c.note}</p>
      </main>
    </>
  );
}
