import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { site } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
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

  const title = `${site.name} · Photographe et créatrice de contenu, Bruxelles`;
  const titleEn = `${site.name} · Photographer and content creator, Brussels`;
  const description = isFr
    ? "Photographe et créatrice de contenu basée à Bruxelles. Street, documentaire, mode, vidéo. Collaborations avec Ricoh et Pentax Europe."
    : "Photographer and content creator based in Brussels. Street, documentary, fashion, video. Collaborations with Ricoh and Pentax Europe.";

  return {
    metadataBase: new URL(site.url),
    title: { default: isFr ? title : titleEn, template: `%s · ${site.name}` },
    description,
    keywords: [
      "Sandrine Ceuppens",
      "photographe Bruxelles",
      "Brussels photographer",
      "street photography",
      "documentary photography",
      "content creator Brussels",
      "créateur de contenu Bruxelles",
      "Ricoh GR",
      "Pentax",
      "brand content",
      "editorial photography",
    ],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en" },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${lang}`,
      siteName: site.tagline,
      title: isFr ? title : titleEn,
      description,
      locale: isFr ? "fr_BE" : "en_GB",
      alternateLocale: isFr ? ["en_GB"] : ["fr_BE"],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? title : titleEn,
      description,
    },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.tagline,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: lang === "fr" ? "Photographe & Créatrice de contenu" : "Photographer & Content Creator",
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    sameAs: [site.social.instagram, site.social.threads],
    knowsAbout: ["Street photography", "Documentary photography", "Brand content", "Video"],
  };

  return (
    <html lang={lang} className={`${playfair.variable} ${inter.variable}`}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
