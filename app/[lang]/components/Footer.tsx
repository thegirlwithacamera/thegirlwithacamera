"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const isFrench = currentLang === "fr";

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // bot detected
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang: currentLang }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid #ebebeb" }}>

      {/* CTA + newsletter */}
      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "80px 48px 64px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
      }}
        className="grid-cols-1 md:grid-cols-2"
      >
        {/* CTA gauche */}
        <div>
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
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 3vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#0a0a0a",
            marginBottom: "32px",
            maxWidth: "460px",
            letterSpacing: "-0.01em",
          }}>
            {isFrench ? "Et si on créait quelque chose qui reste ?" : "Let's create something worth remembering."}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px" }}>
            <Link
              href={`/${currentLang}/contact`}
              style={{
                display: "inline-block",
                padding: "12px 28px",
                border: "1px solid #0a0a0a",
                color: "#0a0a0a",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "#0a0a0a";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#0a0a0a";
              }}
            >
              {isFrench ? "Démarrer un projet" : "Start a project"}
            </Link>
            {site.availability.open && (
              <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9a9a9a" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                {site.availability.nextWindow[currentLang]}
              </span>
            )}
          </div>
        </div>

        {/* Newsletter droite */}
        <div>
          <p style={{
            fontSize: "9px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#b0b0b0",
            marginBottom: "20px",
            fontWeight: 500,
          }}>
            Newsletter
          </p>
          <p style={{ fontSize: "13px", color: "#6a6a6a", lineHeight: 1.7, marginBottom: "24px", maxWidth: "380px" }}>
            {isFrench
              ? "Une lettre par mois : nouvelles séries, carnets de tournage, lectures. Pas de spam."
              : "One letter a month : new series, field notes, things I'm reading. No spam."}
          </p>
          {status === "success" ? (
            <p style={{ fontSize: "13px", color: "#0a0a0a", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
              {isFrench ? "Merci. À très vite." : "Thanks. See you soon."}
            </p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" className="hidden" />
              <label htmlFor="newsletter-email" className="sr-only">{isFrench ? "Votre email" : "Your email"}</label>
              <div style={{ display: "flex", gap: "0" }}>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFrench ? "votre@email.com" : "you@email.com"}
                  style={{
                    flex: 1,
                    background: "#f8f8f8",
                    border: "1px solid #e8e8e8",
                    borderRight: "none",
                    color: "#0a0a0a",
                    padding: "13px 16px",
                    fontSize: "12px",
                    outline: "none",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#0a0a0a")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#e8e8e8")}
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    padding: "13px 22px",
                    background: "#0a0a0a",
                    color: "#fff",
                    border: "1px solid #0a0a0a",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    opacity: status === "sending" ? 0.5 : 1,
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status === "sending" ? "…" : isFrench ? "S'inscrire" : "Subscribe"}
                </button>
              </div>
            </form>
          )}
          {status === "error" && (
            <p style={{ fontSize: "12px", color: "#e53e3e", marginTop: "10px" }}>
              {isFrench ? "Une erreur. Réessayez." : "Something went wrong. Try again."}
            </p>
          )}
        </div>
      </div>

      {/* Sitemap */}
      <div style={{
        borderTop: "1px solid #ebebeb",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px 48px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
      }}>
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>
            {isFrench ? "Travail" : "Work"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><Link href={`/${currentLang}/gallery`} style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>{isFrench ? "Séries" : "Series"}</Link></li>
            <li><Link href={`/${currentLang}/services`} style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Services</Link></li>
            <li><Link href={`/${currentLang}/about`} style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>{isFrench ? "À propos" : "About"}</Link></li>
            <li><Link href={`/${currentLang}/contact`} style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>Contact</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="mailto:hello@thegirlwithacamera.com" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>hello@thegirlwithacamera.com</a></li>
            <li><a href="mailto:press@thegirlwithacamera.com" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>press@thegirlwithacamera.com</a></li>
          </ul>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginTop: "20px", marginBottom: "12px", fontWeight: 600 }}>
            {isFrench ? "Me retrouver" : "Join me on"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="https://instagram.com/thegirlwithacamera" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Instagram</a></li>
            <li><a href="https://threads.net/@thegirlwithacamera" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Threads</a></li>
            <li><a href="https://tiktok.com/@thegirlwithacamera" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>TikTok</a></li>
          </ul>
        </div>
        <div>
          <p style={{ fontSize: "8.5px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#b0b0b0", marginBottom: "16px", fontWeight: 600 }}>
            {isFrench ? "Travailler avec" : "Work with"}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><a href="https://www.ricoh-imaging.eu/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Ricoh Europe</a></li>
            <li><a href="https://www.ricoh-imaging.eu/pentax/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Pentax Europe</a></li>
            <li><a href="https://www.insta360.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#6a6a6a", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#0a0a0a"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#6a6a6a"}>Insta360</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: "1px solid #ebebeb",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
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
