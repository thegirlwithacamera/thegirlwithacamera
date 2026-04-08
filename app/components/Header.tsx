"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/portfolio", label: "Portfolio Photos" },
    { href: "/creation", label: "Création" },
    { href: "/blog", label: "Blog" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <h1 className="font-serif text-xl font-bold tracking-tight hover:opacity-70 transition-opacity">
              THE GIRL WITH A CAMERA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  pathname === link.href
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-[#737373] hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-black transition-transform ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-black transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-full h-0.5 bg-black transition-transform ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#e5e5e5] py-4 px-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-base font-medium ${
                  pathname === link.href ? "text-black" : "text-[#737373]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
