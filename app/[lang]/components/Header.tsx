"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

function useIsHomePage() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  return parts.length <= 1;
}

type Lang = "fr" | "en";

const NAV = [
  { href: "/gallery", label: { fr: "Work", en: "Work" } },
  { href: "/about",   label: { fr: "About", en: "About" } },
  { href: "/contact", label: { fr: "Contact", en: "Contact" } },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const isHome = useIsHomePage();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = NAV.map((l) => ({ href: `/${currentLang}${l.href}`, label: l.label[currentLang] }));

  const headerBg   = isHome ? "bg-transparent" : "bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]";
  const textColor  = isHome ? "text-white" : "text-black";
  const linkColor  = isHome ? "text-white/70 hover:text-white" : "text-[#525252] hover:text-black";
  const activeColor = isHome ? "text-white border-b border-white/60 pb-1" : "text-black border-b-2 border-black pb-1";
  const burgerColor = isHome ? "bg-white" : "bg-black";
  const mobileMenuBg = isHome ? "bg-black/90 backdrop-blur-md" : "bg-white border-b border-[#e5e5e5]";
  const mobileLinkColor = isHome ? "text-white/80" : "text-[#525252]";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${headerBg}`}>
      <nav className="px-8 py-5" aria-label={currentLang === "fr" ? "Navigation principale" : "Main navigation"}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href={`/${currentLang}`}
            className={`font-serif text-sm font-bold tracking-[0.14em] uppercase hover:opacity-70 transition-opacity ${textColor}`}
          >
            Sandrine Ceuppens
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== `/${currentLang}` && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-xs font-medium tracking-[0.12em] uppercase transition-colors ${active ? activeColor : linkColor}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <LanguageSwitcher currentLang={currentLang} />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher currentLang={currentLang} />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer" : "Menu"}
              className="p-2"
            >
              <div className="w-6 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 transition-transform ${burgerColor} ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`w-full h-0.5 transition-opacity ${burgerColor} ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-0.5 transition-transform ${burgerColor} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className={`md:hidden absolute top-full left-0 right-0 py-6 px-8 flex flex-col gap-5 ${mobileMenuBg}`}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`text-base font-medium ${mobileLinkColor}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
