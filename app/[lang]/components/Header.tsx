"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

type Lang = "fr" | "en";

const NAV = [
  { href: "", label: { fr: "Accueil", en: "Home" } },
  { href: "/gallery", label: { fr: "Séries", en: "Series" } },
  { href: "/creation", label: { fr: "Création", en: "Creation" } },
  { href: "/services", label: { fr: "Services", en: "Services" } },
  { href: "/blog", label: { fr: "Journal", en: "Journal" } },
  { href: "/about", label: { fr: "À propos", en: "About" } },
  { href: "/contact", label: { fr: "Contact", en: "Contact" } },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  // Close mobile menu on route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = NAV.map((l) => ({ href: `/${currentLang}${l.href}`, label: l.label[currentLang] }));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]">
      <nav className="max-w-7xl mx-auto px-6 py-4" aria-label={currentLang === "fr" ? "Navigation principale" : "Main navigation"}>
        <div className="flex items-center justify-between">
          <Link
            href={`/${currentLang}`}
            className="font-serif text-xl font-bold tracking-tight hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            SANDRINE CEUPPENS
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== `/${currentLang}` && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                    active ? "text-black border-b-2 border-black pb-1" : "text-[#525252] hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <LanguageSwitcher currentLang={currentLang} />
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher currentLang={currentLang} />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? (currentLang === "fr" ? "Fermer le menu" : "Close menu") : (currentLang === "fr" ? "Ouvrir le menu" : "Open menu")}
              className="p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-black transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`w-full h-0.5 bg-black transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`w-full h-0.5 bg-black transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#e5e5e5] py-6 px-6 flex flex-col gap-5 shadow-md"
          >
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-base font-medium ${active ? "text-black" : "text-[#525252]"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
