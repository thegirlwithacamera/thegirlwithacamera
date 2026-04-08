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

export const metadata: Metadata = {
  title: "The Girl With A Camera | Sandrine CPPNS",
  description: "Portfolio de photographe et créatrice de contenu. Découvrez mes séries photos, créations et articles.",
  keywords: ["photographie", "portfolio", "blog", "création de contenu", "paris"],
  authors: [{ name: "Sandrine CPPNS" }],
  openGraph: {
    title: "The Girl With A Camera | Sandrine CPPNS",
    description: "Portfolio de photographe et créatrice de contenu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
