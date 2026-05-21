"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

type Lang = "fr" | "en";

const NAV = [
  { href: "/gallery", label: "Work" },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "14px 32px",
          gap: "16px",
        }}
      >
        {/* GAUCHE — Nom */}
        <Link
          href={`/${currentLang}`}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            textDecoration: "none",
          }}
        >
          Sandrine Ceuppens
        </Link>

        {/* CENTRE — Tagline */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Where photography <em style={{ fontWeight: 400, fontStyle: "italic" }}>and fashion meet.</em>
          </p>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              margin: "4px 0 0",
            }}
          >
            Photographer / Creative / Video Diary
          </p>
        </div>

        {/* DROITE — Nav + Langue */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "28px",
          }}
        >
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((l) => {
              const href = `/${currentLang}${l.href}`;
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    borderBottom: active ? "1px solid rgba(255,255,255,0.6)" : "none",
                    paddingBottom: active ? "2px" : "0",
                    transition: "color 0.2s",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher currentLang={currentLang} />

          {/* Burger mobile */}
          <button
            className="md:hidden"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "#fff" }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "#fff" }} />
              <span style={{ display: "block", width: "22px", height: "1.5px", background: "#fff" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(0,0,0,0.95)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: "24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={`/${currentLang}${l.href}`}
              style={{
                fontSize: "14px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
