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
  {
    slug: "shy",
    image: "/store/shy.jpg",
    name: "Shy With A Camera",
    meta: { fr: "Le guide street pour les timides · 19 €", en: "The shy street guide · 19 €" },
    alt: "Shy With A Camera, the street photography guide for shy people",
  },
] as const;

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  fr: {
    title: "Mes presets et la suite. *Faits avec le même soin que mes photos.*",
  },
  en: {
    title: "My presets and whatever comes next. *Made with the same care as my photos.*",
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
      <section className={s.banner}>
        <img
          src="/store/banner.jpg"
          alt="Street, Travel, Market and Neon, the four presets side by side"
        />
        <span className={s.bannerVeil} aria-hidden="true" />
        <p className={s.bannerWord}>The Store</p>
      </section>
      <div className={s.container}>
        <PageHead title={t.title} />
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
