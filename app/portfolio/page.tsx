"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [
  { id: "all", label: "Tout" },
  { id: "portraits", label: "Portraits" },
  { id: "mode", label: "Mode" },
  { id: "street", label: "Street" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "studio", label: "Studio" },
];

const photos = [
  {
    id: 1,
    title: "Portrait Editorial",
    category: "portraits",
    image: "/images/portfolio/portrait-1.jpg",
  },
  {
    id: 2,
    title: "Fashion Street",
    category: "mode",
    image: "/images/portfolio/fashion-1.jpg",
  },
  {
    id: 3,
    title: "Urban Life",
    category: "street",
    image: "/images/portfolio/street-1.jpg",
  },
  {
    id: 4,
    title: "Golden Hour",
    category: "lifestyle",
    image: "/images/portfolio/lifestyle-1.jpg",
  },
  {
    id: 5,
    title: "Studio Noir",
    category: "studio",
    image: "/images/portfolio/studio-1.jpg",
  },
  {
    id: 6,
    title: "Portrait Naturel",
    category: "portraits",
    image: "/images/portfolio/portrait-2.jpg",
  },
  {
    id: 7,
    title: "Haute Couture",
    category: "mode",
    image: "/images/portfolio/fashion-2.jpg",
  },
  {
    id: 8,
    title: "City Lights",
    category: "street",
    image: "/images/portfolio/street-2.jpg",
  },
  {
    id: 9,
    title: "Morning Coffee",
    category: "lifestyle",
    image: "/images/portfolio/lifestyle-2.jpg",
  },
  {
    id: 10,
    title: "Studio Light",
    category: "studio",
    image: "/images/portfolio/studio-2.jpg",
  },
  {
    id: 11,
    title: "Regard Intense",
    category: "portraits",
    image: "/images/portfolio/portrait-3.jpg",
  },
  {
    id: 12,
    title: "Editorial Mode",
    category: "mode",
    image: "/images/portfolio/fashion-3.jpg",
  },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Portfolio Photos
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Une sélection de mes travaux en photographie
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-medium tracking-wide transition-colors ${
                activeCategory === cat.id
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-[#737373] hover:text-black"
              }`}
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
