import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./components/showcase.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { site } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";

  const title = `${site.tagline} · Photographe, vidéaste et créatrice de contenu, Bruxelles`;
  const titleEn = `${site.tagline} · Photographer, videographer and content creator, Brussels`;
  // Description de repli du site. Chaque page ecrit la sienne : celle-ci ne
  // sort que si une page oublie de le faire. Elle faisait 400 caracteres et
  // enumerait vingt synonymes ; Google en coupe 155 et le reste servait de
  // texte de partage sur toutes les pages.
  const description = isFr
    ? "Sandrine Ceuppens photographie et filme les hôtels, les maisons d'hôtes, les restaurants et les bars. Basée à Bruxelles, en déplacement partout dans le monde."
    : "Sandrine Ceuppens photographs and films hotels, guesthouses, restaurants and bars. Based in Brussels, travelling worldwide.";

  return {
    metadataBase: new URL(site.url),
    title: { default: "The Girl With A Camera", template: `%s · The Girl With A Camera` },
    description,
    // Le bloc keywords a saute le 01/09 : soixante-dix mots cles, ignores
    // par Google depuis 2009, et le seul effet visible etait de faire croire
    // que le site etait optimise.
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "Photography",
    classification: "Photography & Content Creation",
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/en" },
    },
    // Repli seulement. pageMeta (lib/seo.ts) redefinit ce bloc page par
    // page : Next ne fusionne pas openGraph entre un layout et une page, donc
    // une url ecrite ici serait celle de l'accueil sur tout le site.
    openGraph: {
      type: "website",
      siteName: "The Girl With A Camera",
      title: isFr ? title : titleEn,
      description,
      locale: isFr ? "fr_BE" : "en_GB",
      alternateLocale: isFr ? ["en_GB"] : ["fr_BE"],
      images: [
        {
          url: `${site.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "The Girl With A Camera",
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@sandrinecppns",
      creator: "@sandrinecppns",
      title: isFr ? title : titleEn,
      description,
      images: [`${site.url}/twitter-image.jpg`],
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
    manifest: "/manifest.json",
    formatDetection: { email: false, telephone: false, address: false },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "The Girl With A Camera" },
    other: { "p:domain_verify": "fb7bde9a9a231fda174f9d3b3a13f9fa" },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.tagline,
    alternateName: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: lang === "fr" ? "Photographe, vidéaste et créatrice de contenu" : "Photographer, videographer and content creator",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    image: `${site.url}/og-image.jpg`,
    sameAs: [site.social.instagram, site.social.threads, site.social.tiktok],
    // Recentré le 08/09 : la liste disait encore rue, mode et séances photo.
    knowsAbout: [
      "Hotel photography",
      "Hospitality photography",
      "Restaurant photography",
      "Interior photography",
      "Travel photography",
      "Documentary photography",
      "Brand film",
      "Vertical video",
      "Video editing",
      "Creative direction"
    ],
    workLocation: { "@type": "City", name: site.city },
    hasOccupation: [
      { "@type": "Occupation", name: lang === "fr" ? "Créatrice de contenu" : "Content Creator" },
      { "@type": "Occupation", name: lang === "fr" ? "Photographe" : "Photographer" },
      { "@type": "Occupation", name: lang === "fr" ? "Vidéaste" : "Videographer" },
      { "@type": "Occupation", name: lang === "fr" ? "Productrice vidéo" : "Video Producer" },
      { "@type": "Occupation", name: lang === "fr" ? "Créatrice indépendante" : "Freelance Creator" }
    ],
    skills: [
      "Photography",
      "Videography",
      "Video editing",
      "Creative direction",
      "Content creation",
      "Social media management"
    ]
  };

  // Fiche d'établissement, présente sur toutes les pages. Refaite le 08/09 :
  // elle décrivait encore de la photo de rue et de mode, et limitait la zone
  // desservie à l'Union européenne alors que le site dit "partout dans le
  // monde". Le téléphone valait "+32", un indicatif sans numéro : Google
  // rejette une fiche qui porte un numéro invalide, mieux vaut pas de numéro.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: site.tagline,
    alternateName: site.name,
    image: `${site.url}/og-image.jpg`,
    description: lang === "fr"
      ? "Photographe et vidéaste indépendante basée à Bruxelles. Hôtels, maisons d'hôtes, restaurants et bars, photographiés en lumière naturelle. Films de marque et vidéo verticale. En déplacement partout dans le monde."
      : "Independent photographer and filmmaker based in Brussels. Hotels, guesthouses, restaurants and bars, photographed in natural light. Brand films and vertical video. Travelling worldwide.",
    url: site.url,
    email: `mailto:${site.email}`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    founder: { "@type": "Person", name: site.name },
    sameAs: [site.social.instagram, site.social.threads, site.social.tiktok],
    areaServed: { "@type": "Place", name: "Worldwide" },
    knowsLanguage: ["fr", "en", "nl"],
    knowsAbout: [
      "Hotel photography",
      "Hospitality photography",
      "Restaurant photography",
      "Interior photography",
      "Travel photography",
      "Documentary photography",
      "Brand film",
      "Vertical video",
      "Video editing",
      "Creative direction",
    ],
    offers: [
      {
        "@type": "Service",
        name: lang === "fr" ? "Photographie d'hôtel et de maison d'hôtes" : "Hotel and guesthouse photography",
        description: lang === "fr"
          ? "Reportage photo du lieu entier, chambres, espaces communs et équipe, en lumière naturelle."
          : "Full coverage of the place, rooms, common spaces and team, in natural light.",
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Photographie de restaurant et de bar" : "Restaurant and bar photography",
        description: lang === "fr"
          ? "La salle, la carte et le service photographiés pendant que la table vit."
          : "The room, the menu and the service photographed while the table is alive.",
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Film de marque" : "Brand film",
        description: lang === "fr"
          ? "Film court pour une campagne, montage narratif et sound design, déclinaisons verticales."
          : "Short film for a campaign, narrative editing and sound design, vertical cutdowns.",
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Photographie de voyage et de destination" : "Travel and destination photography",
        description: lang === "fr"
          ? "Séries de ville pour les offices du tourisme, les régions et les compagnies de train."
          : "City series for tourism boards, regions and rail companies.",
      },
    ],
  };

  // Retires le 01/09 :
  //
  // faqJsonLd : quatre questions balisees sur TOUTES les pages alors
  // qu'aucune page ne les affiche. Google demande que le balisage FAQ
  // corresponde a un contenu visible, sinon c'est un motif de sanction. Les
  // reponses decrivaient en plus l'ancien positionnement, rue et mode, pas
  // l'hotellerie. Une vraie FAQ visible sur /services serait le bon geste.
  //
  // breadcrumbJsonLd : un fil d'Ariane a une seule entree, le nom du site,
  // sur chaque page. Il n'apprenait rien et entrait en conflit avec le vrai
  // fil d'Ariane des pages de cas.

  return (
    <html lang={lang} className={`${garamond.variable} ${inter.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:text-sm"
        >
          {lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
