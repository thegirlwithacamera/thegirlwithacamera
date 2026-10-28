"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV, NAV_MORE } from "./nav";
import s from "./Footer.module.css";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  // Bande "Travaillons ensemble" partout sauf sur About (elle y ramènerait
  // à la page en cours) et sur l'accueil, où la grille porte déjà la porte.
  const onAbout = pathname.startsWith(`/${currentLang}/about`);
  const onHome = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
  // Les pages de cas portent déjà leur appel entre précédent et suivant :
  // deux "Travaillons ensemble" à dix centimètres d'écart, ça fait deux.
  const onCase = /^\/(fr|en)\/photographer\/[^/]+\/[^/]+/.test(pathname);
  const hideCta = onAbout || onHome || onCase;
  const cta =
    currentLang === "fr"
      ? { eyebrow: "Un projet en tête ?", label: "Travaillons ensemble" }
      : { eyebrow: "Have a project in mind?", label: "Work with me" };

  // L'accueil n'est que sa couverture, rien en dessous (28/10, Sandrine).
  if (onHome) return null;

  return (
    <footer className={s.footer}>
      {!hideCta && (
        <div className={s.cta}>
          {/* Lien discret façon page About (16/09, choix de Sandrine) : la
              grande bande « Have a project in mind? » pesait trop partout. */}
          <Link href={`/${currentLang}/about#contact`} className={s.work}>{cta.label} →</Link>
        </div>
      )}
      {/* Sans menu en haut de page (28/10), le pied reprend les rubriques de
          la couverture pour qui est descendu jusqu'ici. */}
      <nav className={s.nav} aria-label="Footer">
        {[...NAV, ...NAV_MORE].map((l) => (
          <Link key={l.href + l.label} href={l.href}>{l.label}</Link>
        ))}
      </nav>
      <div className={s.bottom}>
        <p className={s.copy}>© {new Date().getFullYear()} Sandrine Ceuppens · Brussels</p>
        <a href="mailto:hello@thegirlwithacamera.com" className={s.mail}>hello@thegirlwithacamera.com</a>
      </div>
    </footer>
  );
}
