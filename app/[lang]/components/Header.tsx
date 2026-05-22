"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "fr" | "en";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");

  useEffect(() => setMenuOpen(false), [pathname]);

  const navLinks = currentLang === "fr"
    ? [
        { href: `/${currentLang}/gallery`,  label: "Portfolio" },
        { href: `/${currentLang}/about`,    label: "Info" },
        { href: `/${currentLang}/contact`,  label: "Contact" },
        { href: "https://www.instagram.com/sandrinecppns/", label: "Instagram", external: true },
      ]
    : [
        { href: `/${currentLang}/gallery`,  label: "Portfolio" },
        { href: `/${currentLang}/about`,    label: "Info" },
        { href: `/${currentLang}/contact`,  label: "Contact" },
        { href: "https://www.instagram.com/sandrinecppns/", label: "Instagram", external: true },
      ];

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 50,
      background: "#ffffff",
      textAlign: "center",
      padding: "20px 40px 0",
    }}>
      <style>{`
        .header-nav { display: flex; }
        .header-burger { display: none; }
        @media (max-width: 767px) {
          .header-nav { display: none; }
          .header-burger { display: flex; }
        }
      `}</style>
      {/* Titre centré */}
      <Link
        href={`/${currentLang}`}
        style={{
          display: "block",
          fontFamily: "'EB Garamond', serif",
          fontSize: "17px",
          fontWeight: 400,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#0a0a0a",
          textDecoration: "none",
          marginBottom: "8px",
        }}
      >
        The Girl With A Camera
      </Link>

      {/* Navigation centrée dessous */}
      <nav className="header-nav" style={{
        justifyContent: "center",
        alignItems: "center",
        gap: "28px",
        paddingBottom: "14px",
      }}>
        {navLinks.map((l) => {
          const isActive = !l.external && pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              style={{
                fontSize: "10px",
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

        {/* Séparateur + Langue */}
        <span style={{ color: "#d8d8d8", fontSize: "9px" }}>|</span>
        <Link
          href={`/${otherLang}${pathWithoutLang || ""}`}
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "#0a0a0a",
            textDecoration: "none",
          }}
        >
          {otherLang.toUpperCase()}
        </Link>
      </nav>

      {/* Burger mobile — caché en JS si viewport large */}
      <div className="header-burger" style={{
        display: "none",
        justifyContent: "flex-end",
        paddingBottom: "14px",
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

      {/* Menu mobile */}
      {menuOpen && (
        <div style={{
          background: "#ffffff",
          borderTop: "1px solid #ebebeb",
          padding: "28px 40px 32px",
          textAlign: "center",
        }}>
          {navLinks.map((l) => (
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
          <div style={{ marginTop: "20px" }}>
            <Link
              href={`/${otherLang}${pathWithoutLang || ""}`}
              style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#0a0a0a", textDecoration: "none" }}
            >
              {otherLang.toUpperCase()}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
