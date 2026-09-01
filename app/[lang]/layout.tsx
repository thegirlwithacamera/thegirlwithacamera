import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
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
  const description = isFr
    ? "The Girl With A Camera - Sandrine Ceuppens. Photographe, vidéaste et créatrice de contenu indépendante à Bruxelles. Photographie de rue, documentaire, mode, vidéo. Création de contenu pour les marques. Collaborations Ricoh Europe, Pentax Europe, Insta360. Services: shooting photo, production vidéo, montage, direction créative, création de contenu pour Instagram, TikTok, réseaux sociaux."
    : "The Girl With A Camera - Sandrine Ceuppens. Photographer, videographer and independent content creator in Brussels. Street photography, documentary, fashion, video production. Brand content creation. Collaborations with Ricoh Europe, Pentax Europe, Insta360. Services: photo shoots, video production, editing, creative direction, content creation for Instagram, TikTok, social media.";

  return {
    metadataBase: new URL(site.url),
    title: { default: "The Girl With A Camera", template: `%s · The Girl With A Camera` },
    description,
    keywords: [
      "The Girl With A Camera",
      "Sandrine Ceuppens",
      "photographe",
      "photographer",
      "vidéaste",
      "videographer",
      "créatrice de contenu",
      "content creator",
      "créatrice indépendante",
      "freelance photographer",
      "vidéographe",
      "productrice vidéo",
      "video producer",
      "Bruxelles",
      "Brussels",
      "Belgique",
      "Belgium",
      "photographe Bruxelles",
      "vidéaste Bruxelles",
      "vidéaste professionnel",
      "professional videographer",
      "photographe professionnel",
      "professional photographer",
      "création de contenu Bruxelles",
      "content creator Brussels",
      "créatrice de contenu indépendante",
      "independent content creator",
      "création de contenu pour marques",
      "brand content creation",
      "contenu de marque",
      "street photography",
      "photographie de rue",
      "documentary photography",
      "photographie documentaire",
      "fashion photography",
      "photographie de mode",
      "editorial photography",
      "photographie éditoriale",
      "video production",
      "production vidéo",
      "video editing",
      "montage vidéo",
      "video creation",
      "création vidéo",
      "Instagram content creator",
      "créatrice Instagram",
      "TikTok creator",
      "créatrice TikTok",
      "social media creator",
      "créatrice réseaux sociaux",
      "contenu pour réseaux sociaux",
      "social media content",
      "girl with camera",
      "fille avec caméra",
      "creative direction",
      "direction créative",
      "photoshoot",
      "séance photo",
      "video shooting",
      "tournage vidéo",
      "Ricoh GR",
      "Pentax",
      "Insta360",
      "creator economy",
      "économie créative",
      "freelance",
      "indépendant",
      "disponible pour projets",
      "available for projects",
      "collaboration",
      "partenariat",
    ],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "Photography",
    classification: "Photography & Content Creation",
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${lang}`,
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
    knowsAbout: [
      "Content creation",
      "Photography",
      "Videography",
      "Street photography",
      "Documentary photography",
      "Fashion photography",
      "Editorial photography",
      "Brand content creation",
      "Video production",
      "Video editing",
      "Social media content",
      "Creative direction",
      "Photo shoots",
      "Video shooting",
      "Instagram content",
      "TikTok content"
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.tagline,
    alternateName: site.name,
    image: `${site.url}/og-image.jpg`,
    description: lang === "fr"
      ? "Photographe, vidéaste et créatrice de contenu indépendante basée à Bruxelles. Services: photographie de rue, documentaire, mode, vidéo, création de contenu pour les marques, production vidéo, montage, direction créative, contenu pour réseaux sociaux."
      : "Independent photographer, videographer and content creator based in Brussels. Services: street photography, documentary, fashion, video, brand content creation, video production, editing, creative direction, social media content.",
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: "+32",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    sameAs: [site.social.instagram, site.social.threads, site.social.tiktok],
    serviceArea: { "@type": "Country", name: "European Union" },
    knowsAbout: [
      "Photography",
      "Videography",
      "Content Creation",
      "Brand Content",
      "Video Production",
      "Street Photography",
      "Documentary Photography",
      "Fashion Photography",
      "Editorial Photography",
      "Social Media Content",
      "Video Editing",
      "Creative Direction"
    ],
    offers: [
      {
        "@type": "Service",
        name: lang === "fr" ? "Photographie" : "Photography",
        description: lang === "fr"
          ? "Services de photographie: street, documentaire, mode, photographie éditoriale, séances photo"
          : "Photography services: street, documentary, fashion, editorial, photo shoots"
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Production vidéo" : "Video production",
        description: lang === "fr"
          ? "Production vidéo complète: tournage, montage, direction créative pour marques"
          : "Complete video production: shooting, editing, creative direction for brands"
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Création de contenu" : "Content creation",
        description: lang === "fr"
          ? "Création de contenu pour réseaux sociaux: Instagram, TikTok, contenus de marque"
          : "Content creation for social media: Instagram, TikTok, brand content"
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Direction créative" : "Creative direction",
        description: lang === "fr"
          ? "Direction créative et stratégie visuelle pour projets de contenu"
          : "Creative direction and visual strategy for content projects"
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Montage vidéo" : "Video editing",
        description: lang === "fr"
          ? "Montage vidéo professionnel pour documentaires, publicités, réseaux sociaux"
          : "Professional video editing for documentaries, advertisements, social media"
      }
    ]
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
