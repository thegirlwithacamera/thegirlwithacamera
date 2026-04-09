"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Lang = "fr" | "en";

export default function Footer() {
  const pathname = usePathname();
  const currentLang = (pathname.split("/")[1] || "fr") as Lang;
  const isFrench = currentLang === "fr";

  return (
    <footer className="bg-black text-white">
      {/* CTA section */}
      <div className="px-8 md:px-16 pt-24 pb-16">
        <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-10 max-w-3xl">
          {isFrench
            ? <span className="whitespace-nowrap">Et si on créait quelque chose&nbsp;?</span>
            : "Curious what we could create together?"}
          <br />
          <span className="text-[#a3a3a3]">
            {isFrench
              ? "Quelque chose qui reste."
              : "Let's craft something worth remembering."}
          </span>
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href={`/${currentLang}/contact`}
            className="inline-block px-8 py-3 border border-white text-white text-xs font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            {isFrench ? "Me contacter" : "Get in Touch"}
          </Link>
          <span className="flex items-center gap-2 text-sm text-[#a3a3a3]">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            {isFrench ? "Disponible" : "Available for Work"}
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#262626] px-8 md:px-16 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <a
          href="mailto:hello@thegirlwithacamera.com"
          className="text-sm text-[#737373] hover:text-white transition-colors"
        >
          hello@thegirlwithacamera.com
        </a>
        <p className="text-xs text-[#525252] order-last md:order-none">
          All rights reserved, Sandrine Ceuppens &copy;{new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/sandrinecppns/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#737373] hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.threads.net/@sandrinecppns"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#737373] hover:text-white transition-colors"
          >
            Threads
          </a>
        </div>
      </div>
    </footer>
  );
}
