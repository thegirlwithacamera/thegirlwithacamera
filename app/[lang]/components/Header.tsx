"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import s from "./Header.module.css";

type Lang = "fr" | "en";
type NavLink = { href: string; label: string; external?: boolean };

// Navigation : quatre entrées au premier niveau, ce sont les quatre choses
// qu'on achète (décision du 01/09). Journal et About dans le "+". Les
// libellés restent en anglais dans les deux langues : ce sont des enseignes.
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");

  // Les menus se referment au clic sur un lien, pas dans un effet.
  const close = () => { setMenuOpen(false); setMoreOpen(false); };

  const navLinks: NavLink[] = [
    { href: `/${currentLang}/photographer`, label: "Photographer" },
    { href: `/${currentLang}/filmmaker`,    label: "Filmmaker" },
    { href: `/${currentLang}/creator`,      label: "Creator" },
    { href: `/${currentLang}/services`,     label: "Services" },
  ];
  const moreLinks: NavLink[] = [
    { href: "https://thegirlwithacamera.substack.com/", label: "Journal", external: true },
    { href: `/${currentLang}/about`, label: "About" },
  ];

  const isActive = (l: NavLink) => !l.external && pathname.startsWith(l.href);
  const linkProps = (l: NavLink) => ({
    href: l.href,
    onClick: close,
    target: l.external ? "_blank" : undefined,
    rel: l.external ? "noopener noreferrer" : undefined,
  });

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href={`/${currentLang}`} className={s.title}>The Girl With A Camera</Link>

        <nav className={s.nav} aria-label="Main">
          {navLinks.map((l) => (
            <Link key={l.href} {...linkProps(l)} className={`${s.link} ${isActive(l) ? s.active : ""}`}>
              {l.label}
            </Link>
          ))}
          {moreLinks.length > 0 && (
            <div className={s.more}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-label={currentLang === "fr" ? "Plus de pages" : "More pages"}
                aria-expanded={moreOpen}
                className={`${s.moreBtn} ${moreOpen ? s.moreOpen : ""}`}
              >
                +
              </button>
              {moreOpen && (
                <div className={s.menu}>
                  {moreLinks.map((l) => (
                    <Link key={l.href} {...linkProps(l)} className={`${s.link} ${isActive(l) ? s.active : ""}`}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        <Link href={`/${otherLang}${pathWithoutLang || ""}`} className={s.lang}>
          {otherLang.toUpperCase()}
        </Link>

        <div className={`${s.burger} ${menuOpen ? s.open : ""}`}>
          <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen} className={s.burgerBtn}>
            <span className={s.burgerLines}>
              <span className={s.burgerLine} />
              <span className={s.burgerLine} />
              <span className={s.burgerLine} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={s.mobileMenu}>
          {[...navLinks, ...moreLinks].map((l) => (
            <Link key={l.href} {...linkProps(l)} className={s.link}>{l.label}</Link>
          ))}
          <Link href={`/${otherLang}${pathWithoutLang || ""}`} className={s.lang}>
            {otherLang.toUpperCase()}
          </Link>
        </div>
      )}
    </header>
  );
}
