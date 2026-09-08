"use client";

import { usePathname } from "next/navigation";
import NewsletterCta from "./NewsletterCta";
import Cta from "./editorial/Cta";
import Eyebrow from "./editorial/Eyebrow";
import s from "./Footer.module.css";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  // Bande "Travaillons ensemble" partout sauf sur About (elle y ramènerait
  // à la page en cours) et sur l'accueil, où la grille porte déjà la porte.
  const onAbout = pathname.startsWith(`/${currentLang}/about`);
  const onHome = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
  const hideCta = onAbout || onHome;
  const cta =
    currentLang === "fr"
      ? { eyebrow: "Un projet en tête ?", label: "Travaillons ensemble" }
      : { eyebrow: "Have a project in mind?", label: "Work with me" };

  return (
    <footer className={s.footer}>
      {!hideCta && (
        <div className={s.cta}>
          <Eyebrow className={s.eyebrow}>{cta.eyebrow}</Eyebrow>
          <Cta href={`/${currentLang}/services`} variant="serif">{cta.label} →</Cta>
        </div>
      )}
      <div className={s.news}>
        <NewsletterCta lang={currentLang} variant="band" />
      </div>
      <div className={s.bottom}>
        <p className={s.copy}>© {new Date().getFullYear()} Sandrine Ceuppens · Bruxelles</p>
        <a href="mailto:hello@thegirlwithacamera.com" className={s.mail}>hello@thegirlwithacamera.com</a>
      </div>
    </footer>
  );
}
