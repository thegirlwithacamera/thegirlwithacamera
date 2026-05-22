"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "fr" | "en";

const NAV_FR = [
  { href: "/gallery", label: "Séries" },
  { href: "/about",   label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const NAV_EN = [
  { href: "/gallery", label: "Series" },
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
  const NAV = currentLang === "fr" ? NAV_FR : NAV_EN;

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: "var(--warm-white)",
        borderBottom: "1px solid var(--dust)",
        transition: "box-shadow 0.4s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 40px",
          height: "52px",
          maxWidth: "1600px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* GAUCHE — Logo */}
        <Link
          href={`/${currentLang}`}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "15px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            color: "var(--ink)",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          <em style={{ fontStyle: "italic", color: "var(--stone)" }}>The Girl</em>
          {" "}With A Camera
        </Link>

        {/* CENTRE — Numéro de parution */}
        <div style={{ textAlign: "center", whiteSpace: "nowrap" }}>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--dust)",
              margin: 0,
            }}
          >
            {currentLang === "fr" ? "No. 07 · Mai 2026" : "No. 07 · May 2026"}
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
                    color: active ? "var(--ink)" : "var(--stone)",
                    textDecoration: "none",
                    borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
                    paddingBottom: "2px",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--ink)"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--stone)"; }}
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
                color: currentLang === "fr" ? "var(--ink)" : "var(--dust)",
                textDecoration: "none",
              }}
            >
              FR
            </Link>
            <span style={{ color: "#d8d8d8", fontSize: "8px", lineHeight: 1 }}>|</span>
            <Link
              href={`/${otherLang}${pathWithoutLang || ""}`}
              hrefLang={otherLang}
              style={{
                fontSize: "9px",
                letterSpacing: "0.14em",
                fontWeight: currentLang === "en" ? 600 : 400,
                color: currentLang === "en" ? "var(--ink)" : "var(--dust)",
                textDecoration: "none",
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
                display: "block", width: "20px", height: "1px", background: "var(--ink)",
                transition: "transform 0.25s",
                transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none"
              }} />
              <span style={{
                display: "block", width: "20px", height: "1px", background: "var(--ink)",
                opacity: menuOpen ? 0 : 1, transition: "opacity 0.15s"
              }} />
              <span style={{
                display: "block", width: "20px", height: "1px", background: "var(--ink)",
                transition: "transform 0.25s",
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
            background: "var(--warm-white)",
            borderTop: "1px solid var(--dust)",
            padding: "32px 40px 36px",
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
                fontFamily: "'EB Garamond', serif",
                fontSize: "32px",
                fontWeight: 400,
                fontStyle: "italic",
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: i < NAV.length - 1 ? "1px solid var(--cream)" : "none",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "16px", marginTop: "28px", paddingTop: "24px", borderTop: "1px solid var(--cream)" }}>
            <Link href={pathname} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: currentLang === "fr" ? "var(--ink)" : "var(--dust)", fontWeight: currentLang === "fr" ? 600 : 400, textDecoration: "none" }}>FR</Link>
            <Link href={`/${otherLang}${pathWithoutLang || ""}`} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: currentLang === "en" ? "var(--ink)" : "var(--dust)", fontWeight: currentLang === "en" ? 600 : 400, textDecoration: "none" }}>EN</Link>
          </div>
        </div>
      )}
    </header>
  );
}
