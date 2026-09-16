"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import s from "./Footer.module.css";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;

  // Bande "Travaillons ensemble" partout sauf sur About (elle y ramènerait
  // à la page en cours) et sur l'accueil, où la grille porte déjà la porte.
  const onAbout = pathname.startsWith(`/${currentLang}/about`);
  const onContact = pathname.startsWith(`/${currentLang}/contact`);
  const onHome = pathname === `/${currentLang}` || pathname === `/${currentLang}/`;
  // Les pages de cas portent déjà leur appel entre précédent et suivant :
  // deux "Travaillons ensemble" à dix centimètres d'écart, ça fait deux.
  const onCase = /^\/(fr|en)\/photographer\/[^/]+\/[^/]+/.test(pathname);
  const hideCta = onAbout || onHome || onCase || onContact;
  const cta =
    currentLang === "fr"
      ? { eyebrow: "Un projet en tête ?", label: "Travaillons ensemble" }
      : { eyebrow: "Have a project in mind?", label: "Work with me" };

  return (
    <footer className={s.footer}>
      {!hideCta && (
        <div className={s.cta}>
          {/* Lien discret façon page About (16/09, choix de Sandrine) : la
              grande bande « Have a project in mind? » pesait trop partout. */}
          <Link href={`/${currentLang}/contact`} className={s.work}>{cta.label} →</Link>
        </div>
      )}
      <div className={s.bottom}>
        <p className={s.copy}>© {new Date().getFullYear()} Sandrine Ceuppens · Brussels</p>
        <a href="mailto:hello@thegirlwithacamera.com" className={s.mail}>hello@thegirlwithacamera.com</a>
      </div>
    </footer>
  );
}
