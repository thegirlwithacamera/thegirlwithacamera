"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import s from "./Header.module.css";

type NavLink = { href: string; label: string };

// Navigation refaite le 16/09, sur le modèle d'adriana-maria.com : cinq
// entrées, chacune un type de page, plus de sélecteur de langue (site en
// anglais seulement) et plus de menu « + ». « Destinations » remplace
// Photographer/Filmmaker : à côté de « Content creator », « Portfolio » aurait
// laissé croire que le contenu créatrice n'était pas du travail.
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

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
        <div className={s.mobileMenu}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className={s.link}>{l.label}</Link>
          ))}
          <Link href={contact.href} onClick={close} className={s.work}>{contact.label}</Link>
        </div>
      )}
    </header>
  );
}
