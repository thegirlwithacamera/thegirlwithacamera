import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────
// Redirection des URLs sans prefixe de langue.
//
// Ajoute le 01/09. Avant ca, thegirlwithacamera.com/about et /creator
// renvoyaient une erreur 500, pas une 404 : le projet n'a pas de layout
// racine, donc Next ne sait pas rendre app/not-found.tsx en dehors de
// /[lang]. Or les anciens liens, les citations presse et les signatures de
// mail pointent tous vers des URLs sans langue.
//
// Regle : tout ce qui ne commence pas par /fr ou /en part en 308 vers la
// meme route prefixee, langue choisie sur Accept-Language. La 308 conserve
// la methode et dit aux moteurs que le deplacement est definitif.
// ─────────────────────────────────────────────────────────────

const LANGS = ["fr", "en"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LANGS.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  const accept = (request.headers.get("accept-language") ?? "").toLowerCase();
  const lang = accept.startsWith("fr") ? "fr" : "en";

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Tout sauf les routes techniques, les images generees et les fichiers
  // statiques (tout ce qui contient un point).
  //
  // Le studio Sanity etait exclu ici ; la route a ete supprimee le 01/09, et
  // l'exclusion faisait renvoyer une erreur 500 a /studio au lieu d'une 404.
  matcher: [
    "/((?!api|_next|opengraph-image|twitter-image|icon|favicon|.*\\..*).*)",
  ],
};
