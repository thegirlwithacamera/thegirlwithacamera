import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Cover from "./components/Cover";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "",
    title: "The Girl With A Camera · Sandrine Ceuppens, travel photographer, filmmaker & content creator",
    description:
      "Sandrine Ceuppens, travel photographer and content creator based in Brussels. Hotels and destinations, photographed and filmed the way they feel. Travelling worldwide.",
  });
}

// ─────────────────────────────────────────────────────────────
// ACCUEIL (28/10, décisions de Sandrine) : la couverture seule, et rien en
// dessous, ni texte ni pied de page. Le plan drone du lac de Côme plein
// cadre (version verticale recadrée au centre sur téléphone), son nom au
// centre avec son métier dessous, et une mention dans chaque coin : c'est là
// que vivent les rubriques (composant Cover). Altstadt et le titre "The Girl
// With A Camera" au centre ont été essayés et refusés le même jour.
// ─────────────────────────────────────────────────────────────

const FILM = { src: "/videos/banners/destinations-como-vivid.mp4", poster: "/videos/banners/destinations-como-vivid.jpg" };
const FILM_VERTICAL = { src: "/videos/banners/home-como-vertical.mp4", poster: "/videos/banners/home-como-vertical.jpg" };

export default async function HomePage({ params }: Props) {
  await params;
  return (
    <Cover
      film={FILM}
      filmVertical={FILM_VERTICAL}
      label="Aerial view of a village above a waterfall, Lake Como, filmed by Sandrine Ceuppens"
      tl={<p>Brussels<br />Belgium</p>}
      tr={<Link href="/en/about">The Girl With A Camera</Link>}
      center={
        <>
          <h1>Sandrine Ceuppens</h1>
          <p>Photographer &amp; filmmaker</p>
        </>
      }
    />
  );
}
