"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const isFrench = currentLang === "fr";

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid #ebebeb" }}>

      {/* CTA collaboration */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "64px 48px 48px",
      }}>
        <p style={{
          fontSize: "9px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#b0b0b0",
          marginBottom: "20px",
          fontWeight: 500,
        }}>
          {isFrench ? "Collaboration" : "Collaboration"}
        </p>
        <h2 style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "clamp(24px, 2.5vw, 38px)",
          fontWeight: 400,
          lineHeight: 1.2,
          color: "#0a0a0a",
          marginBottom: "32px",
          maxWidth: "520px",
          letterSpacing: "-0.01em",
          fontStyle: "italic",
        }}>
          {isFrench ? "Pour les marques et magazines qui ont quelque chose à dire." : "For brands and publications with something to say."}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px" }}>
          <Link
            href={`/${currentLang}/contact`}
            style={{
              display: "inline-block",
              padding: "11px 24px",
              border: "1px solid #0a0a0a",
              color: "#0a0a0a",
              fontSize: "9px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            {isFrench ? "Ouvrir une conversation" : "Start a conversation"}
          </Link>
          {site.availability.open && (
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#9a9a9a" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
              {site.availability.nextWindow[currentLang]}
            </span>
          )}
        </div>
      </div>

      {/* Sitemap */}
      <div style={{
        borderTop: "1px solid #ebebeb",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "36px 48px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
      }}>
        {/* Col 1 — Navigation */}
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>
            {isFrench ? "Navigation" : "Navigation"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { href: "/work",    label: "Work" },
              { href: "/about",   label: isFrench ? "À propos" : "About" },
              { href: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={`/${currentLang}${l.href}`} style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Contact + réseaux */}
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>Contact</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="mailto:hello@thegirlwithacamera.com" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none" }}>hello@thegirlwithacamera.com</a></li>
            <li><a href="mailto:press@thegirlwithacamera.com" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none" }}>press@thegirlwithacamera.com</a></li>
          </ul>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginTop: "24px", marginBottom: "14px", fontWeight: 600 }}>
            {isFrench ? "Me retrouver" : "Find me"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Instagram", href: "https://instagram.com/sandrinecppns" },
              { label: "Threads",   href: "https://threads.net/@sandrinecppns" },
              { label: "TikTok",    href: "https://tiktok.com/@sandrinecppns" },
            ].map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none" }}>
                  {s.label} <span style={{ color: "#c0c0c0", fontSize: "11px" }}>@sandrinecppns</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Trusted by */}
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>
            {isFrench ? "Confiance de" : "Trusted by"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Ricoh Europe",  href: "https://www.ricoh-imaging.eu/" },
              { label: "Pentax Europe", href: "https://www.ricoh-imaging.eu/pentax/" },
              { label: "Insta360",      href: "https://www.insta360.com/" },
            ].map((p) => (
              <li key={p.label}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none" }}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid #ebebeb",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "18px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <p style={{ fontSize: "10px", color: "#c0c0c0", letterSpacing: "0.04em" }}>
          © {new Date().getFullYear()} Sandrine Ceuppens · Bruxelles
        </p>
        <p style={{ fontSize: "10px", color: "#c0c0c0", letterSpacing: "0.04em" }}>
          {isFrench ? "Tous droits réservés" : "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}
