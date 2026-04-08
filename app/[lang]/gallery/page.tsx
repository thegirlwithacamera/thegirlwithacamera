"use client";

import Image from "next/image";
import { use } from "react";

const categories = {
  fr: [
    { id: "all", label: "Tout" },
    { id: "portraits", label: "Portraits" },
    { id: "fashion", label: "Mode" },
    { id: "street", label: "Street" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "studio", label: "Studio" },
  ],
  en: [
    { id: "all", label: "All" },
    { id: "portraits", label: "Portraits" },
    { id: "fashion", label: "Fashion" },
    { id: "street", label: "Street" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "studio", label: "Studio" },
  ],
};

const photos = [
  { id: 1, title: "Portrait Editorial", category: "portraits", image: "/images/gallery/photo-1.jpg" },
  { id: 2, title: "Fashion Street", category: "fashion", image: "/images/gallery/photo-2.jpg" },
  { id: 3, title: "Urban Life", category: "street", image: "/images/gallery/photo-3.jpg" },
  { id: 4, title: "Golden Hour", category: "lifestyle", image: "/images/gallery/photo-4.jpg" },
  { id: 5, title: "Studio Noir", category: "studio", image: "/images/gallery/photo-5.jpg" },
  { id: 6, title: "Portrait Naturel", category: "portraits", image: "/images/gallery/photo-6.jpg" },
  { id: 7, title: "Haute Couture", category: "fashion", image: "/images/gallery/photo-7.jpg" },
  { id: 8, title: "City Lights", category: "street", image: "/images/gallery/photo-8.jpg" },
  { id: 9, title: "Morning Coffee", category: "lifestyle", image: "/images/gallery/photo-9.jpg" },
  { id: 10, title: "Studio Light", category: "studio", image: "/images/gallery/photo-10.jpg" },
  { id: 11, title: "Regard Intense", category: "portraits", image: "/images/gallery/photo-11.jpg" },
  { id: 12, title: "Editorial Fashion", category: "fashion", image: "/images/gallery/photo-12.jpg" },
];

export default function GalleryPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const isFrench = lang === "fr";

  const filteredPhotos = photos;

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {isFrench ? "Galerie" : "Gallery"}
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {isFrench
              ? "Une sélection de mes photographies"
              : "A selection of my photographs"}
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories[lang].map((cat) => (
            <button
              key={cat.id}
              className="text-sm font-medium tracking-wide transition-colors text-[#737373] hover:text-black"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] image-overlay cursor-pointer"
            >
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-xl font-bold">
                    {photo.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
