"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const isFrench = currentLang === "fr";

  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">
              SANDRINE CEUPPENS
            </h3>
            <p className="text-[#a3a3a3] text-sm leading-relaxed">
              {isFrench ? (
                <>
                  Photographe & Créatrice de contenu<br />
                  Basée à Paris
                </>
              ) : (
                <>
                  Photographer & Content Creator<br />
                  Based in Paris
                </>
              )}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4">
              {isFrench ? "NAVIGATION" : "NAVIGATION"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${currentLang}/gallery`} className="text-[#a3a3a3] hover:text-white transition-colors">
                  {isFrench ? "Galerie" : "Gallery"}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/da`} className="text-[#a3a3a3] hover:text-white transition-colors">
                  {isFrench ? "D.A." : "Art Direction"}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/blog`} className="text-[#a3a3a3] hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/about`} className="text-[#a3a3a3] hover:text-white transition-colors">
                  {isFrench ? "À propos" : "About"}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLang}/contact`} className="text-[#a3a3a3] hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4">
              {isFrench ? "SUIVEZ-MOI" : "FOLLOW ME"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/sandrinecppns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a3a3a3] hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#262626] mt-8 pt-8 text-center text-[#a3a3a3] text-sm">
          <p>&copy; {new Date().getFullYear()} Sandrine Ceuppens. {isFrench ? "Tous droits réservés" : "All rights reserved"}.</p>
        </div>
      </div>
    </footer>
  );
}
