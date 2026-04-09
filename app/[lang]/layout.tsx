import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;

  return {
    title: "SANDRINE CEUPPENS | The Girl With A Camera",
    description: lang === "fr"
      ? "Photographe et créatrice de contenu basée à Bruxelles. Street, documentaire, mode et vidéo."
      : "Photographer and content creator based in Brussels. Street, documentary, fashion and video.",
    keywords: ["photographie", "portfolio", "blog", "création de contenu", "paris"],
    authors: [{ name: "Sandrine Ceuppens" }],
    openGraph: {
      title: "SANDRINE CEUPPENS | The Girl With A Camera",
      description: lang === "fr"
        ? "Portfolio de photographe et créatrice de contenu"
        : "Photographer and content creator portfolio",
      type: "website",
    },
  };
}

export default function RootLayout({ children, params }: Props) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
