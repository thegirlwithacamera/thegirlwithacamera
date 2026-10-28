import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Cover from "../components/Cover";
import ChapterIndex from "../components/ChapterIndex";
import TrustLogos from "../components/TrustLogos";
import s from "../destinations/index.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/hotels",
    title: "Hotels & Houses · Hotel photographer and filmmaker",
    description:
      "Hotels, ryokans, guesthouses and tables photographed and filmed by Sandrine Ceuppens, from Vienna to Japan.",
    image: "/images/portfolio/hospitality/mizuya/2.jpg",
  });
}

// ─────────────────────────────────────────────────────────────
// Hotels & Houses (28/10) : la première rubrique du menu choisi par Sandrine
// (Hotels & Houses, Destinations, Brands). Les maisons et les tables, c'est
// à dire les catégories hospitality et restaurants. Les villes sont sur
// Destinations. Couverture en double page, puis la grille des chapitres.
// ─────────────────────────────────────────────────────────────

export default async function HotelsPage({ params }: Props) {
  await params;
  return (
    <main className={s.main}>
      <Cover
        images={["/images/portfolio/hospitality/mizuya/2.jpg", "/images/portfolio/hospitality/nishimuraya/6.jpg"]}
        label="Hotels & Houses"
        title="Hotels & Houses"
      />
      <ChapterIndex
        cats={["hospitality", "restaurants"]}
        lede="Hotels, ryokans and tables, photographed and filmed on the same visit, in natural light, while the house is alive."
      />
      <section className={s.logos}>
        <TrustLogos lang="en" cats={["stays"]} hideLabel />
      </section>
    </main>
  );
}
