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
// dessous, ni texte ni pied de page. Le film d'Altstadt Vienna plein cadre,
// recadré par le haut pour sortir ses sous-titres incrustés
// (public/videos/banners/home-altstadt*.mp4, encodé à la définition de la
// source, sans réduction), le nom du site au centre, et une mention dans
// chaque coin : c'est là que vivent les rubriques (composant Cover).
// ─────────────────────────────────────────────────────────────

const FILM = { src: "/videos/banners/home-altstadt-hd.mp4", poster: "/videos/banners/home-altstadt-hd.jpg" };
const FILM_VERTICAL = { src: "/videos/banners/home-altstadt-hd-vertical.mp4", poster: "/videos/banners/home-altstadt-hd-vertical.jpg" };

export default async function HomePage({ params }: Props) {
  await params;
  return (
    <Cover
      film={FILM}
      filmVertical={FILM_VERTICAL}
      label="Altstadt Vienna, filmed by Sandrine Ceuppens"
      tl={<p>Brussels<br />Belgium</p>}
      tr={<Link href="/en/about">Photographer &amp; filmmaker</Link>}
      center={<h1>The Girl With A Camera</h1>}
    />
  );
}
