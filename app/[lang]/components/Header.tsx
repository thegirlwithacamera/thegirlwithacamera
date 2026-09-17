"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import s from "./Header.module.css";

type NavLink = { href: string; label: string };

// Réseaux affichés dans le menu mobile plein écran.
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sandrinecppns/",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </g>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@sandrineceuppens",
    icon: <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.84 1.56V6.81a4.85 4.85 0 01-1.07-.12z" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sandrinecppns",
    icon: <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/sandrineceuppens/",
    icon: <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.44 7.58 5.94 9.13-.08-.78-.16-1.97.03-2.82.18-.77 1.15-4.87 1.15-4.87s-.29-.59-.29-1.46c0-1.37.79-2.39 1.78-2.39.84 0 1.25.63 1.25 1.39 0 .85-.54 2.11-.82 3.28-.23.98.49 1.78 1.46 1.78 1.75 0 3.1-1.85 3.1-4.52 0-2.36-1.7-4.02-4.13-4.02-2.81 0-4.46 2.11-4.46 4.29 0 .85.33 1.76.74 2.25.08.1.09.19.07.29-.08.32-.25 1-.28 1.14-.05.19-.15.23-.35.14-1.28-.6-2.08-2.47-2.08-3.97 0-3.23 2.35-6.2 6.77-6.2 3.55 0 6.32 2.53 6.32 5.92 0 3.53-2.23 6.38-5.32 6.38-1.04 0-2.01-.54-2.35-1.18l-.64 2.44c-.23.89-.85 2.01-1.27 2.69.96.3 1.97.46 3.03.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />,
  },
];

// Navigation refaite le 16/09, sur le modèle d'adriana-maria.com : cinq
// entrées, chacune un type de page, plus de sélecteur de langue (site en
// anglais seulement) et plus de menu « + ». « Destinations » remplace
// Photographer/Filmmaker : à côté de « Content creator », « Portfolio » aurait
// laissé croire que le contenu créatrice n'était pas du travail.
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  // Menu mobile plein écran (16/09) : la page derrière ne défile plus tant
  // qu'il est ouvert, et Échap le referme.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const navLinks: NavLink[] = [
    { href: "/en/destinations", label: "Destinations" },
    { href: "/en/creator", label: "Content creator" },
    { href: "/en/journal", label: "Journal" },
    { href: "/en/about", label: "About" },
  ];
  const contact: NavLink = { href: "/en/contact", label: "Contact" };

  const isActive = (l: NavLink) =>
    pathname.startsWith(l.href) ||
    (l.href === "/en/destinations" && pathname.startsWith("/en/photographer"));

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link href="/en" className={s.title}>The Girl With A Camera</Link>

        <nav className={s.nav} aria-label="Main">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className={`${s.link} ${isActive(l) ? s.active : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={s.right}>
          <Link href={contact.href} className={s.work}>{contact.label}</Link>
        </div>

        <div className={`${s.burger} ${menuOpen ? s.open : ""}`}>
          <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" aria-expanded={menuOpen} className={s.burgerBtn}>
            <span className={s.burgerLines}>
              <span className={s.burgerLine} />
              <span className={s.burgerLine} />
              <span className={s.burgerLine} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={s.mobileMenu} role="dialog" aria-modal="true" aria-label="Menu">
          <Image src="/images/about/portrait-beach.jpg" alt="" fill sizes="100vw" quality={70} className={s.mobileBg} priority />
          <span className={s.mobileVeil} aria-hidden="true" />
          <button type="button" onClick={close} aria-label="Close menu" className={s.mobileClose}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <nav className={s.mobileNav} aria-label="Mobile">
            <Link href="/en" onClick={close} className={s.mobileLink}>Home</Link>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className={s.mobileLink}>{l.label}</Link>
            ))}
            <Link href={contact.href} onClick={close} className={s.mobileLink}>{contact.label}</Link>
          </nav>
          <ul className={s.mobileSocials}>
            {SOCIALS.map((so) => (
              <li key={so.label}>
                <a href={so.href} target="_blank" rel="noopener noreferrer" aria-label={so.label}>
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">{so.icon}</svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
