import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "../components/editorial";
import { pageMeta } from "@/lib/seo";
import s from "./store.module.css";

// Boutique : chaque produit s'affiche par son packshot, le detail (sliders,
// achat) vit sur sa propre page. Concue pour accueillir les prochains
// produits : ajouter une entree dans PRODUCTS suffit.

const PRODUCTS = [
  {
    slug: "street",
    image: "/store/street.jpg",
    name: "Street",
    meta: { fr: "Le preset signature · 15 €", en: "The signature preset · 15 €" },
    alt: "Street, the signature Lightroom preset",
  },
  {
    slug: "pack-101",
    image: "/store/pack-101.jpg",
    name: "Pack 101",
    meta: { fr: "4 presets Lightroom · 39 €", en: "4 Lightroom presets · 39 €" },
    alt: "Pack 101, 4 film presets for Lightroom",
  },
] as const;

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  fr: {
    eyebrow: "The Girl With A Camera",
    title: "Store",
    lede: "Mes presets et les prochains objets de la boutique, faits avec le même soin que mes photos.",
  },
  en: {
    eyebrow: "The Girl With A Camera",
    title: "Store",
    lede: "My presets and whatever comes next, made with the same care as my photos.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/store",
    title: "Store",
    description:
      lang === "fr"
        ? "La boutique de Sandrine Ceuppens : presets Lightroom et objets à venir."
        : "Sandrine Ceuppens' store: Lightroom presets and more to come.",
    image: "/store/pack-101.jpg",
  });
}

export default async function StorePage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main>
      <div className={s.container}>
        <PageHead eyebrow={t.eyebrow} title={t.title} lede={t.lede} />
        <div className={s.grid}>
          {PRODUCTS.map((p) => (
            <Link key={p.slug} href={`/${lang}/store/${p.slug}`} className={s.card}>
              <img src={p.image} alt={p.alt} loading="lazy" />
              <span className={s.cardName}>{p.name}</span>
              <span className={s.cardMeta}>{p.meta[lang]}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
