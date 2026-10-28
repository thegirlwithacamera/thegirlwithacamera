"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, NAV_MORE } from "./nav";
import s from "./Header.module.css";

// ─────────────────────────────────────────────────────────────
// En-tête (refait le 28/10). Les rubriques vivent dans les coins des
// couvertures (composant Cover) : les pages qui en ont une n'ont pas
// d'en-tête du tout. Les autres (articles du Journal, Store, mentions) gardent
// une seule ligne dans la même écriture que les coins : le nom à gauche, les
// rubriques à droite. Plus de menu plein écran sur téléphone, la ligne passe
// simplement à la ligne.
// ─────────────────────────────────────────────────────────────

const COVER_PAGES = [/^\/en\/?$/, /^\/en\/(hotels|destinations|creator|about)\/?$/, /^\/en\/journal\/?$/, /^\/en\/photographer\//];

export default function Header() {
  const pathname = usePathname() ?? "";
  if (COVER_PAGES.some((re) => re.test(pathname))) return null;

  return (
    <header className={s.header}>
      <Link href="/en" className={s.name}>The Girl With A Camera</Link>
      <nav className={s.nav} aria-label="Main">
        {[...NAV, ...NAV_MORE.filter((l) => l.label !== "Sandrine Ceuppens"), { href: "/en/about", label: "About" }].map((l) => (
          <Link key={l.href + l.label} href={l.href} className={pathname.startsWith(l.href) ? s.on : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
