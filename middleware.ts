import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────
// Site en anglais seulement depuis le 16/09.
//
// Toutes les pages vivent sous /en. Les adresses sans langue et les
// anciennes adresses en /fr (Google, liens partagés, signatures de mail)
// partent en 308 vers la même page en /en, pour ne rien casser.
// ─────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    url.pathname = `/en${pathname.slice(3)}`;
  } else {
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  }
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    "/((?!api|_next|opengraph-image|twitter-image|icon|favicon|.*\\..*).*)",
  ],
};
