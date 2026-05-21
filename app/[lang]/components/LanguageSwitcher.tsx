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
        style={{
          fontSize: "11px",
          letterSpacing: "0.08em",
          fontWeight: currentLang === "fr" ? 700 : 400,
          color: currentLang === "fr" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
      >
        FR
      </Link>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }} aria-hidden>|</span>
      <Link
        href={currentLang === "en" ? pathname : newPath}
        aria-current={currentLang === "en" ? "true" : undefined}
        hrefLang="en"
        style={{
          fontSize: "11px",
          letterSpacing: "0.08em",
          fontWeight: currentLang === "en" ? 700 : 400,
          color: currentLang === "en" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
      >
        EN
      </Link>
    </div>
  );
}
