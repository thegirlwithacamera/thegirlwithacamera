"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Lang = "fr" | "en";

export default function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");
  const newPath = `/${otherLang}${pathWithoutLang || ""}`;

  return (
    <div className="flex items-center gap-2 text-sm" role="group" aria-label="Language">
      <Link
        href={currentLang === "fr" ? pathname : newPath}
        aria-current={currentLang === "fr" ? "true" : undefined}
        hrefLang="fr"
        className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          currentLang === "fr" ? "text-black font-semibold" : "text-[#525252] hover:text-black"
        }`}
      >
        FR
      </Link>
      <span className="text-[#d4d4d4]" aria-hidden>|</span>
      <Link
        href={currentLang === "en" ? pathname : newPath}
        aria-current={currentLang === "en" ? "true" : undefined}
        hrefLang="en"
        className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          currentLang === "en" ? "text-black font-semibold" : "text-[#525252] hover:text-black"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
