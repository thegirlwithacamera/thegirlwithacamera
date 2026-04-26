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
    <footer className="bg-black text-white">
      {/* CTA + newsletter */}
      <div className="px-8 md:px-16 pt-24 pb-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-8 max-w-xl">
            {isFrench ? "Et si on créait quelque chose qui reste ?" : "Let's create something worth remembering."}
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={`/${currentLang}/contact`}
              className="inline-block px-8 py-3 border border-white text-white text-xs font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {isFrench ? "Démarrer un projet" : "Start a project"}
            </Link>
            {site.availability.open && (
              <span className="flex items-center gap-2 text-sm text-[#a3a3a3]">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" aria-hidden />
                {site.availability.nextWindow[currentLang]}
              </span>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#a3a3a3] mb-4">
            {isFrench ? "Newsletter" : "Newsletter"}
          </p>
          <p className="text-sm text-[#d4d4d4] leading-relaxed mb-6 max-w-md">
            {isFrench
              ? "Une lettre par mois — nouvelles séries, carnets de tournage, lectures. Pas de spam, désinscription en un clic."
              : "One letter a month — new series, field notes, things I'm reading. No spam, one-click unsubscribe."}
          </p>
          {status === "success" ? (
            <p className="text-sm text-[#d4d4d4]">
              {isFrench ? "Merci. À très vite." : "Thanks. See you soon."}
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                aria-hidden="true"
                className="hidden"
              />
              <label htmlFor="newsletter-email" className="sr-only">
                {isFrench ? "Votre email" : "Your email"}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFrench ? "votre@email.com" : "you@email.com"}
                className="flex-1 bg-transparent border border-[#525252] text-white placeholder:text-[#737373] px-4 py-3 text-sm focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-3 bg-white text-black text-xs font-medium tracking-widest uppercase hover:bg-[#e5e5e5] transition-colors disabled:opacity-50"
              >
                {status === "sending" ? (isFrench ? "..." : "...") : isFrench ? "S'inscrire" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400 mt-3">
              {isFrench ? "Une erreur. Réessayez." : "Something went wrong. Try again."}
            </p>
          )}
        </div>
      </div>

      {/* Sitemap row */}
      <div className="border-t border-[#262626] px-8 md:px-16 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">{isFrench ? "Travail" : "Work"}</p>
          <ul className="space-y-2">
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/gallery`}>{isFrench ? "Séries" : "Series"}</Link></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/creation`}>{isFrench ? "Création" : "Creation"}</Link></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/services`}>Services</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">Studio</p>
          <ul className="space-y-2">
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/about`}>{isFrench ? "À propos" : "About"}</Link></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/now`}>Now</Link></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/press`}>Press</Link></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/blog`}>Journal</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">Contact</p>
          <ul className="space-y-2">
            <li><a className="text-[#d4d4d4] hover:text-white" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="text-[#d4d4d4] hover:text-white" href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a></li>
            <li><Link className="text-[#d4d4d4] hover:text-white" href={`/${currentLang}/contact`}>{isFrench ? "Formulaire" : "Form"}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#737373] mb-3">{isFrench ? "Suivre" : "Follow"}</p>
          <ul className="space-y-2">
            <li><a className="text-[#d4d4d4] hover:text-white" href={site.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a className="text-[#d4d4d4] hover:text-white" href={site.social.threads} target="_blank" rel="noopener noreferrer">Threads</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#262626] px-8 md:px-16 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <p className="text-[#737373]">
          © {new Date().getFullYear()} Sandrine Ceuppens — {isFrench ? "Tous droits réservés" : "All rights reserved"}.
        </p>
        <div className="flex items-center gap-6 text-[#737373]">
          <Link className="hover:text-white" href={`/${currentLang}/legal/privacy`}>
            {isFrench ? "Confidentialité" : "Privacy"}
          </Link>
          <Link className="hover:text-white" href={`/${currentLang}/legal/mentions`}>
            {isFrench ? "Mentions légales" : "Legal notice"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
