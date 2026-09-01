"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsletterCta from "./NewsletterCta";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  // Bande "Work with me" au-dessus du footer, sauf sur About (elle y mènerait
  // vers la page en cours) et sauf sur l'accueil, où la grille contient déjà
  // une tuile Travaillons ensemble : les deux se suivaient à l'écran et
  // disaient la même chose.
  const onAbout = pathname.startsWith(`/${currentLang}/about`);
  const onHome = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
  const hideCta = onAbout || onHome;
  const cta =
    currentLang === "fr"
      ? { eyebrow: "Un projet en tête ?", label: "Travaillons ensemble" }
      : { eyebrow: "Have a project in mind?", label: "Work with me" };

  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid #ebebeb" }}>
      {!hideCta && (
        <div style={{ textAlign: "center", padding: "32px 24px", borderBottom: "1px solid #ebebeb" }}>
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#737373",
            margin: "0 0 10px",
          }}>
            {cta.eyebrow}
          </p>
          <Link
            /* L'ancre d'A propos ne porte plus les offres depuis le 01/09,
               elles ont leur page. */
            href={`/${currentLang}/services`}
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: "26px",
              color: "#0a0a0a",
              textDecoration: "none",
              borderBottom: "1px solid #0a0a0a",
              paddingBottom: "3px",
            }}
          >
            {cta.label} →
          </Link>
        </div>
      )}
      {/* Bande journal : capture email sur toutes les pages du site.
          Le formulaire poste sur /api/newsletter, qui inscrit en abonne
          gratuit sur Substack (copie Resend en secours). */}
      <div style={{ padding: "44px 24px", borderBottom: "1px solid #ebebeb" }}>
        <NewsletterCta lang={currentLang} variant="footer" />
      </div>

      <div style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{ fontSize: "10px", color: "#c0c0c0", letterSpacing: "0.04em", margin: 0 }}>
          © {new Date().getFullYear()} Sandrine Ceuppens · Bruxelles
        </p>
        <a href="mailto:hello@thegirlwithacamera.com" style={{
          fontSize: "12px",
          color: "#0a0a0a",
          textDecoration: "none",
          borderBottom: "1px solid #0a0a0a",
          paddingBottom: "2px",
        }}>
          hello@thegirlwithacamera.com
        </a>
      </div>
    </footer>
  );
}
