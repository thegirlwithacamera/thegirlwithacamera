"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "fr" | "en";

const NAV = [
  { href: "/gallery", label: "Work" },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");

  // Détecte si on est sur la home (ex: /fr ou /en)
  const isHome = pathWithoutLang === "" || pathWithoutLang === "/";

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sur la home : transparent → blanc au scroll. Ailleurs : toujours blanc.
  const isTransparent = isHome && !scrolled && !menuOpen;
  const textColor = isTransparent ? "#ffffff" : "#0a0a0a";
  const mutedColor = isTransparent ? "rgba(255,255,255,0.6)" : "#9a9a9a";

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: isTransparent ? "transparent" : "#ffffff",
        borderBottom: isTransparent ? "1px solid transparent" : "1px solid #ebebeb",
        transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        boxShadow: scrolled && !isTransparent ? "0 2px 24px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 48px",
          height: "64px",
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* GAUCHE — Nom */}
        <Link
          href={`/${currentLang}`}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: textColor,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "color 0.4s ease",
          }}
        >
          Sandrine Ceuppens
        </Link>

        {/* CENTRE — Tagline éditoriale */}
        <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "11.5px",
              fontWeight: 400,
              fontStyle: "italic",
              color: isTransparent ? "rgba(255,255,255,0.9)" : "#3a3a3a",
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              margin: 0,
              transition: "color 0.4s ease",
            }}
          >
            Where photography and fashion meet.
          </p>
          <p
            style={{
              fontSize: "7.5px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: mutedColor,
              margin: "4px 0 0",
              fontWeight: 500,
              transition: "color 0.4s ease",
            }}
          >
            Photographer · Creative · Video
          </p>
        </div>

        {/* DROITE — Nav + Langue */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "36px",
          }}
        >
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: "28px" }}>
            {NAV.map((l) => {
              const href = `/${currentLang}${l.href}`;
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: active ? textColor : mutedColor,
                    textDecoration: "none",
                    borderBottom: active ? `1px solid ${textColor}` : "1px solid transparent",
                    paddingBottom: "2px",
                    transition: "color 0.25s, border-color 0.25s",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = textColor; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = mutedColor; }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Langue */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href={pathname}
              hrefLang={currentLang}
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                fontWeight: currentLang === "fr" ? 600 : 400,
                color: currentLang === "fr" ? textColor : mutedColor,
                textDecoration: "none",
                transition: "color 0.4s",
              }}
            >
              FR
            </Link>
            <span style={{ color: isTransparent ? "rgba(255,255,255,0.3)" : "#d8d8d8", fontSize: "8px", lineHeight: 1, transition: "color 0.4s" }}>|</span>
            <Link
              href={`/${otherLang}${pathWithoutLang || ""}`}
              hrefLang={otherLang}
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                fontWeight: currentLang === "en" ? 600 : 400,
                color: currentLang === "en" ? textColor : mutedColor,
                textDecoration: "none",
                transition: "color 0.4s",
              }}
            >
              EN
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", lineHeight: 0 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{
                display: "block", width: "20px", height: "1px", background: textColor,
                transition: "transform 0.25s, background 0.4s",
                transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none"
              }} />
              <span style={{
                display: "block", width: "20px", height: "1px", background: textColor,
                opacity: menuOpen ? 0 : 1, transition: "opacity 0.15s, background 0.4s"
              }} />
              <span style={{
                display: "block", width: "20px", height: "1px", background: textColor,
                transition: "transform 0.25s, background 0.4s",
                transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none"
              }} />
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid #ebebeb",
            padding: "32px 48px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {NAV.map((l, i) => (
            <Link
              key={l.href}
              href={`/${currentLang}${l.href}`}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#0a0a0a",
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: i < NAV.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "16px", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #ebebeb" }}>
            <Link href={pathname} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: currentLang === "fr" ? "#0a0a0a" : "#b0b0b0", fontWeight: currentLang === "fr" ? 600 : 400, textDecoration: "none" }}>FR</Link>
            <Link href={`/${otherLang}${pathWithoutLang || ""}`} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: currentLang === "en" ? "#0a0a0a" : "#b0b0b0", fontWeight: currentLang === "en" ? 600 : 400, textDecoration: "none" }}>EN</Link>
          </div>
        </div>
      )}
    </header>
  );
}
