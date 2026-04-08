"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Lang = "fr" | "en";

export default function LanguageSwitcher({ currentLang }: { currentLang: Lang }) {
  const pathname = usePathname();
  const otherLang: Lang = currentLang === "fr" ? "en" : "fr";

  // Get the path without the language prefix
  const pathWithoutLang = pathname.replace(/^\/(fr|en)/, "");
  const newPath = `/${otherLang}${pathWithoutLang}`;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href={currentLang === "fr" ? pathname : newPath}
        className={`transition-colors ${
          currentLang === "fr" ? "text-black font-semibold" : "text-[#737373]"
        }`}
      >
        FR
      </Link>
      <span className="text-[#e5e5e5]">|</span>
      <Link
        href={currentLang === "en" ? pathname : newPath}
        className={`transition-colors ${
          currentLang === "en" ? "text-black font-semibold" : "text-[#737373]"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
