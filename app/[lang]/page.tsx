import Image from "next/image";
import Link from "next/link";

// Gallery images - replace with your actual photos
const galleryImages = [
  { id: 1, src: "/images/gallery/photo-1.jpg", alt: "Portrait editorial" },
  { id: 2, src: "/images/gallery/photo-2.jpg", alt: "Fashion shoot" },
  { id: 3, src: "/images/gallery/photo-3.jpg", alt: "Street photography" },
  { id: 4, src: "/images/gallery/photo-4.jpg", alt: "Lifestyle moment" },
  { id: 5, src: "/images/gallery/photo-5.jpg", alt: "Studio portrait" },
  { id: 6, src: "/images/gallery/photo-6.jpg", alt: "Fashion editorial" },
  { id: 7, src: "/images/gallery/photo-7.jpg", alt: "Urban scene" },
  { id: 8, src: "/images/gallery/photo-8.jpg", alt: "Natural light portrait" },
  { id: 9, src: "/images/gallery/photo-9.jpg", alt: "Creative direction" },
  { id: 10, src: "/images/gallery/photo-10.jpg", alt: "Black and white portrait" },
  { id: 11, src: "/images/gallery/photo-11.jpg", alt: "Fashion story" },
  { id: 12, src: "/images/gallery/photo-12.jpg", alt: "Lifestyle editorial" },
];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Pure image grid - no text, just photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e5e5e5]">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden bg-[#f5f5f5] image-overlay"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Minimal CTA */}
      <div className="py-24 px-6 text-center">
        <Link
          href="/gallery"
          className="inline-block text-sm font-medium tracking-widest uppercase border-b-2 border-black pb-1 hover:opacity-70 transition-opacity"
        >
          View Full Gallery
        </Link>
      </div>
    </div>
  );
}
