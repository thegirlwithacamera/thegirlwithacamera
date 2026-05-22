"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Lang = "fr" | "en";

const NAV_FR = [
  { href: "/work",    label: "Work",     sub: [{ href: "/work/photo", label: "Photo" }, { href: "/work/video", label: "Vidéo" }, { href: "/work/ugc", label: "UGC" }] },
  { href: "/about",   label: "À propos", sub: [] },
  { href: "/contact", label: "Contact",  sub: [] },
];

const NAV_EN = [
  { href: "/work",    label: "Work",     sub: [{ href: "/work/photo", label: "Photo" }, { href: "/work/video", label: "Video" }, { href: "/work/ugc", label: "UGC" }] },
  { href: "/about",   label: "About",    sub: [] },
  { href: "/contact", label: "Contact",  sub: [] },
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
        background: "#ffffff",
        borderBottom: "1px solid #ebebeb",
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

        {/* CENTRE — vide */}
        <div />

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
              if (l.sub && l.sub.length > 0) {
                return (
                  <div key={href} style={{ position: "relative" }} className="nav-dropdown-wrap">
                    <style>{`
                      .nav-dropdown-wrap .nav-dropdown { display: none; }
                      .nav-dropdown-wrap:hover .nav-dropdown { display: flex; }
                    `}</style>
                    <Link
                      href={href}
                      style={{
                        fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: active ? "#0a0a0a" : "#9a9a9a",
                        textDecoration: "none",
                        borderBottom: active ? "1px solid #0a0a0a" : "1px solid transparent",
                        paddingBottom: "2px",
                      }}
                    >
                      {l.label}
                    </Link>
                    {/* Dropdown */}
                    <div className="nav-dropdown" style={{
                      position: "absolute", top: "100%", left: "50%",
                      transform: "translateX(-50%)",
                      paddingTop: "16px",
                      flexDirection: "column", gap: "0",
                      zIndex: 100,
                    }}>
                      <div style={{
                        background: "#ffffff", border: "1px solid #ebebeb",
                        minWidth: "120px", padding: "8px 0",
                      }}>
                        {l.sub.map((s) => (
                          <Link
                            key={s.href}
                            href={`/${currentLang}${s.href}`}
                            style={{
                              display: "block", padding: "9px 20px",
                              fontSize: "9.5px", letterSpacing: "0.16em",
                              textTransform: "uppercase", color: "#6a6a6a",
                              textDecoration: "none",
                            }}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: "9.5px", fontWeight: 500, letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: active ? "#0a0a0a" : "#9a9a9a",
                    textDecoration: "none",
                    borderBottom: active ? "1px solid #0a0a0a" : "1px solid transparent",
                    paddingBottom: "2px",
                  }}
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
            background: "#ffffff",
            borderTop: "1px solid #ebebeb",
            padding: "32px 40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {NAV.map((l, i) => (
            <div key={l.href}>
              <Link
                href={`/${currentLang}${l.href}`}
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "32px",
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "-0.01em",
                  color: "#0a0a0a",
                  textDecoration: "none",
                  padding: "14px 0",
                  display: "block",
                  borderBottom: (l.sub && l.sub.length > 0) ? "none" : (i < NAV.length - 1 ? "1px solid #f0f0f0" : "none"),
                }}
              >
                {l.label}
              </Link>
              {l.sub && l.sub.length > 0 && (
                <div style={{ display: "flex", gap: "20px", paddingBottom: "14px", borderBottom: i < NAV.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  {l.sub.map((s) => (
                    <Link key={s.href} href={`/${currentLang}${s.href}`} style={{
                      fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "#9a9a9a", textDecoration: "none",
                    }}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
