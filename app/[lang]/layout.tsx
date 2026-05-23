import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
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

  const title = `${site.tagline} · Photographe et créatrice de contenu, Bruxelles`;
  const titleEn = `${site.tagline} · Photographer and content creator, Brussels`;
  const description = isFr
    ? "The Girl With A Camera - Sandrine Ceuppens, créatrice de contenu basée à Bruxelles. Photography, vidéo, création de contenu pour marques. Street, documentaire, mode. Collaborations Ricoh, Pentax."
    : "The Girl With A Camera - Sandrine Ceuppens, content creator based in Brussels. Photography, video, brand content creation. Street, documentary, fashion. Collaborations with Ricoh, Pentax.";

  return {
    metadataBase: new URL(site.url),
    title: { default: "The Girl With A Camera", template: `%s · The Girl With A Camera` },
    description,
    keywords: [
      "The Girl With A Camera",
      "Sandrine Ceuppens",
      "créatrice de contenu",
      "content creator",
      "créatrice de contenu Bruxelles",
      "content creator Brussels",
      "content creator Belgium",
      "créatrice vidéo Bruxelles",
      "video content creator",
      "création de contenu pour marques",
      "brand content creation",
      "photographe Bruxelles",
      "Brussels photographer",
      "street photography",
      "documentary photography",
      "fashion photography",
      "editorial photography",
      "Instagram creator",
      "social media creator",
      "TikTok creator",
      "créateur TikTok",
      "video production",
      "production vidéo",
      "girl with camera",
      "Ricoh GR",
      "Pentax",
      "creator economy",
      "économie créative",
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
    jobTitle: lang === "fr" ? "Photographe & Créatrice de contenu" : "Photographer & Content Creator",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    image: `${site.url}/og-image.jpg`,
    sameAs: [site.social.instagram, site.social.threads, site.social.tiktok],
    knowsAbout: [
      "Content creation",
      "Street photography",
      "Documentary photography",
      "Brand content creation",
      "Video production",
      "Editorial photography",
      "Social media content",
      "Fashion photography",
      "Video editing"
    ],
    workLocation: { "@type": "City", name: site.city },
    hasOccupation: [
      { "@type": "Occupation", name: lang === "fr" ? "Créatrice de contenu" : "Content Creator" },
      { "@type": "Occupation", name: lang === "fr" ? "Photographe" : "Photographer" },
      { "@type": "Occupation", name: lang === "fr" ? "Vidéographe" : "Videographer" }
    ]
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.tagline,
    alternateName: site.name,
    image: `${site.url}/og-image.jpg`,
    description: lang === "fr"
      ? "Photographe et créatrice de contenu documentaire, mode et marque basée à Bruxelles. Création de contenu vidéo et photo pour les marques."
      : "Documentary, fashion and brand photographer and content creator based in Brussels. Video and photography content creation for brands.",
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: "+32",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    sameAs: [site.social.instagram, site.social.threads, site.social.tiktok],
    serviceArea: { "@type": "Country", name: "European Union" },
    knowsAbout: [
      "Content Creation",
      "Brand Photography",
      "Video Production",
      "Social Media Content",
      "Editorial Photography",
      "Documentary Photography"
    ],
    offers: [
      {
        "@type": "Service",
        name: lang === "fr" ? "Création de contenu de marque" : "Brand content creation",
        description: lang === "fr"
          ? "Création de contenu photo et vidéo pour les marques"
          : "Photography and video content creation for brands"
      },
      {
        "@type": "Service",
        name: lang === "fr" ? "Production vidéo" : "Video production",
        description: lang === "fr"
          ? "Production et montage vidéo documentaire et de mode"
          : "Documentary and fashion video production and editing"
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: site.tagline,
        item: `${site.url}/${lang}`,
      },
    ],
  };

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
