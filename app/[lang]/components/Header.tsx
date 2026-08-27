"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "fr" | "en";
type NavLink = { href: string; label: string; external?: boolean };

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");

  useEffect(() => { setMenuOpen(false); setMoreOpen(false); }, [pathname]);

  // Ordre : Photographer (accueil) > Filmmaker > Creator, puis un petit "+"
  // qui regroupe les pages secondaires (About, Presets, Shop/Diary...).
  // Labels adaptes par langue.
  const labels =
    currentLang === "fr"
      ? { home: "Photographe", filmmaker: "Vidéaste", creator: "Créatrice", about: "À propos" }
      : { home: "Photographer", filmmaker: "Filmmaker", creator: "Creator", about: "About" };

  const navLinks: NavLink[] = [
    { href: `/${currentLang}`,           label: labels.home },
    { href: `/${currentLang}/filmmaker`, label: labels.filmmaker },
    { href: `/${currentLang}/creator`,   label: labels.creator },
    // À propos remplace Journal dans la nav principale le 27/08 : c'est la page
    // qui porte les offres, donc le seul lien que doit trouver un client.
    { href: `/${currentLang}/about`,     label: labels.about },
  ];

  // Pages secondaires, rangees dans le "+".
  const moreLinks: NavLink[] = [
    // Journal replié ici le 27/08, il a laissé sa place à À propos.
    { href: "https://thegirlwithacamera.substack.com/", label: "Journal", external: true },
    // Shop/Presets : page retiree du site (la boutique Gumroad reste en ligne).
    // Pour la remettre : decommente la ligne ci-dessous et passe
    // PRESETS_LIVE a true dans app/[lang]/presets/page.tsx.
    // { href: `/${currentLang}/presets`,  label: "Shop" },
    // Prints : boutique hors ligne le temps de revoir la selection d'images.
    // Pour la remettre, decommente la ligne ci-dessous et retire le
    // notFound() dans app/[lang]/shop/page.tsx et shop/[productId]/page.tsx.
    // { href: `/${currentLang}/shop`,     label: "Prints" },
    // Diary : pret mais masque pour l'instant. Pour le remettre,
    // decommente la ligne ci-dessous.
    // { href: `/${currentLang}/diary`,    label: "Diary" },
  ];

  return (
    <header style={{ background: "#ffffff", textAlign: "center", position: "relative" }}>
      <style>{`
        .header-inner {
          padding: 48px 40px 0;
        }
        .header-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 30px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0a0a0a;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
        }
        .header-nav { display: flex; }
        .header-burger { display: none; }
        /* Switch de langue : coin haut droite (desktop). */
        .header-lang { position: absolute; top: 52px; right: 40px; }

        @media (max-width: 767px) {
          .header-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 22px 20px 0;
          }
          .header-title {
            font-size: 16px;
            letter-spacing: 0.16em;
            margin-bottom: 0;
            order: 2;
          }
          .header-nav { display: none; }
          .header-lang { display: none; }
          .header-burger {
            display: flex !important;
            order: 1;
            padding-bottom: 0 !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>

      <div className="header-inner">
        {/* Title */}
        <Link href={`/${currentLang}`} className="header-title">
          The Girl With A Camera
        </Link>

        {/* Desktop nav */}
        <nav className="header-nav" style={{
          justifyContent: "center",
          alignItems: "center",
          gap: "28px",
          paddingBottom: "14px",
        }}>
          {navLinks.map((l) => {
            const isActive = l.external
              ? false
              : l.href === `/${currentLang}`
              ? pathname === `/${currentLang}` || pathname === `/${currentLang}/`
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  textDecoration: isActive ? "underline" : "none",
                  textUnderlineOffset: "3px",
                  fontWeight: 400,
                }}
              >
                {l.label}
              </Link>
            );
          })}

          {/* "+" : pages secondaires en petit menu deroulant */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-label={currentLang === "fr" ? "Plus de pages" : "More pages"}
              aria-expanded={moreOpen}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 2px",
                fontSize: "14px",
                lineHeight: 1,
                color: "#0a0a0a",
                transform: moreOpen ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              +
            </button>
            {moreOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#ffffff",
                border: "1px solid #ebebeb",
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                padding: "6px 22px",
                whiteSpace: "nowrap",
                zIndex: 50,
              }}>
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{
                      display: "block",
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#0a0a0a",
                      textDecoration: pathname.startsWith(l.href) ? "underline" : "none",
                      textUnderlineOffset: "3px",
                      padding: "8px 0",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Switch de langue : coin haut droite */}
        <div className="header-lang">
          <Link
            href={`/${otherLang}${pathWithoutLang || ""}`}
            style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#0a0a0a", textDecoration: "none" }}
          >
            {otherLang.toUpperCase()}
          </Link>
        </div>

        {/* Burger */}
        <div className="header-burger" style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "12px",
        }}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  display: "block", width: "20px", height: "1px", background: "#0a0a0a",
                  transition: "all 0.25s",
                  transform: menuOpen && i === 0 ? "rotate(45deg) translate(4px,4px)"
                             : menuOpen && i === 2 ? "rotate(-45deg) translate(4px,-4px)"
                             : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: "#ffffff",
          borderTop: "1px solid #ebebeb",
          padding: "20px 40px 24px",
          textAlign: "center",
        }}>
          {[...navLinks, ...moreLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              style={{
                display: "block",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`/${otherLang}${pathWithoutLang || ""}`}
            style={{
              display: "block",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#999999",
              textDecoration: "none",
              padding: "12px 0",
              marginTop: "8px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {otherLang.toUpperCase()}
          </Link>
        </div>
      )}
    </header>
  );
}
