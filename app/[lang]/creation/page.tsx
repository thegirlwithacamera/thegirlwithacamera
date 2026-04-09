"use client";

import Script from "next/script";
import { use, useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

const cityDiary = [
  { id: "DWOJ3UHowD_" },
  { id: "DWgSNrkoCd5" },
  { id: "DWx4W3MoGDI" },
];

const shotOn = [
  { id: "DUn2--IjF3p" },
  { id: "DUp4zqDDFa_" },
  { id: "DUnhKNkDC4R" },
  { id: "DUvghGGjAXo" },
];

const comingSoon = [
  "City Diary #4",
  "City Diary #5",
  "City Diary #6",
  "City Diary #7",
];

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default function CreationPage({ params }: Props) {
  const { lang } = use(params);
  const isFrench = lang === "fr";

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="pt-24 pb-24 px-6 md:px-16">
      <Script
        src="//www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => window.instgrm?.Embeds.process()}
      />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-20">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            {isFrench ? "Création" : "Creation"}
          </h1>
          <p className="text-[#737373] max-w-xl leading-relaxed">
            {isFrench
              ? "Vidéo, scripting, montage. Des formats courts qui montrent le réel : produits, villes, instants."
              : "Video, scripting, editing. Short formats that show what's real: products, cities, moments."}
          </p>
        </div>

        {/* City Diary */}
        <section className="mb-24">
          <div className="flex items-baseline justify-between mb-10 border-b border-[#e5e5e5] pb-4">
            <h2 className="font-serif text-2xl font-bold">City Diary</h2>
            <p className="text-xs text-[#737373] tracking-widest uppercase">
              {isFrench ? "Série en cours" : "Ongoing series"}
            </p>
          </div>
          <p className="text-[#737373] text-sm mb-10 max-w-lg">
            {isFrench
              ? "Un regard sur les villes à travers une caméra. Bruxelles et au-delà."
              : "A look at cities through a camera. Brussels and beyond."}
          </p>

          {/* Published reels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {cityDiary.map((reel) => (
              <div key={reel.id} className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={`https://www.instagram.com/reel/${reel.id}/`}
                  data-instgrm-version="14"
                  style={{ maxWidth: "100%", width: "100%", minWidth: 0 }}
                />
              </div>
            ))}
          </div>

          {/* Coming soon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {comingSoon.map((title) => (
              <div
                key={title}
                className="aspect-[9/16] bg-[#f5f5f5] flex items-center justify-center border border-[#e5e5e5]"
              >
                <div className="text-center">
                  <p className="text-xs tracking-widest uppercase text-[#a3a3a3] mb-1">
                    {isFrench ? "À venir" : "Coming soon"}
                  </p>
                  <p className="text-xs text-[#c4c4c4]">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shot on */}
        <section>
          <div className="flex items-baseline justify-between mb-10 border-b border-[#e5e5e5] pb-4">
            <h2 className="font-serif text-2xl font-bold">Shot on ___</h2>
            <p className="text-xs text-[#737373] tracking-widest uppercase">
              {isFrench ? "Vidéo produit" : "Product video"}
            </p>
          </div>
          <p className="text-[#737373] text-sm mb-10 max-w-lg">
            {isFrench
              ? "Une vidéo d'utilisation, une photo résultat. Le produit vu de l'intérieur."
              : "One usage video, one photo result. The product seen from within."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shotOn.map((reel) => (
              <div key={reel.id} className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={`https://www.instagram.com/reel/${reel.id}/`}
                  data-instgrm-version="14"
                  style={{ maxWidth: "100%", width: "100%", minWidth: 0 }}
                />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
