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

  // Ordre : Photographer > Filmmaker > Creator > Services > Journal > About.
  //
  // Décision de Sandrine du 01/09. Elle revient aux trois portes du Brand
  // Core, plus l'offre et le journal. "Work" pointait vers l'accueil : une
  // entrée de menu qui ramène à la page d'accueil n'est pas une page, et la
  // grille d'accueil ne dit plus les catégories mais les maisons.
  //
  // Journal remonte du menu "+" (il y était depuis le 27/08) : un lien replié
  // n'est cliqué que par ceux qui le cherchaient déjà, et c'est le seul lien
  // du site qui mène à un revenu récurrent.
  //
  // Services est nouveau : la page Filmmaker promettait "les formules" sans
  // qu'aucune page de formules existe, et /about portait l'offre en plus du
  // reste. À propos redevient une page sur Sandrine.
  //
  // Les libellés sont en anglais dans les deux langues (28/08). Ce ne sont pas
  // des phrases mais des enseignes, et une nav moitié anglaise moitié
  // française se lisait comme un oubli. Le contenu des pages reste traduit.
  // Quatre entrees au premier niveau, decision du 01/09 : ce sont les quatre
  // choses qu'on achete. Journal et A propos passent dans le "+" : ils ne
  // vendent rien, et A propos garde sa tuile en page d'accueil, celle qui
  // porte la photo de Sandrine.
  const navLinks: NavLink[] = [
    { href: `/${currentLang}/photographer`, label: "Photographer" },
    { href: `/${currentLang}/filmmaker`,    label: "Filmmaker" },
    { href: `/${currentLang}/creator`,      label: "Creator" },
    { href: `/${currentLang}/services`,     label: "Services" },
  ];

  // Pages secondaires, rangees dans le "+".
  //
  // Shop, Prints et Diary y ont dormi jusqu'au 01/09, en commentaire, avec
  // la marche a suivre pour les rallumer. Les trois sont sorties du depot ce
  // jour la : la boutique de tirages en entier, la page presets (la boutique
  // Gumroad tourne toujours de son cote), et le Diary remplace par le
  // Substack. Il ne reste que ce qui est vivant.
  const moreLinks: NavLink[] = [
    { href: "https://thegirlwithacamera.substack.com/", label: "Journal", external: true },
    { href: `/${currentLang}/about`, label: "About" },
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

          {/* "+" : pages secondaires en petit menu deroulant. Masque quand la
              liste est vide, sinon le bouton ouvre un cadre blanc vide. */}
          {moreLinks.length > 0 && (
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
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
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
          )}

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
