import { readCreatorData } from "@/lib/creator-videos";
import { BRANDS } from "@/lib/brands";
import { FEATURED, withMeta } from "./meta";
import type { SocialClip } from "./constants";

// Les verticales de la page Social, au build. Influence d'abord, puis UGC ;
// dans chaque métier, l'ordre des dossiers (Gear, Lifestyle, Unboxing,
// Fashion, Events).
function time(d?: string): number {
  const t = d ? Date.parse(d) : NaN;
  return Number.isNaN(t) ? 0 : t;
}

function brandFor(brand?: string) {
  if (!brand) return undefined;
  return BRANDS.find((b) => b.logo && b.name.toLowerCase() === brand.toLowerCase());
}

export function readSocial(lang: "fr" | "en"): SocialClip[] {
  const data = readCreatorData();
  const all = [...data.gear, ...data.lifestyle, ...data.unboxing, ...data.fashion, ...data.events]
    .map((c) => withMeta(c, lang))
    .filter((c): c is SocialClip => c !== null)
    // Sous les tas, le logo seul (10/11, Sandrine) : plus de nom de projet
    // (« 17 · Dreamy »). Une marque sans logo garde son nom en texte.
    .map((c) => {
      const b = brandFor(c.brand);
      return { ...c, project: undefined, logo: b?.logo, logoTall: b?.tall };
    });
  // Les plus récentes devant (10/11, Sandrine) : la page groupe ensuite par
  // marque dans l'ordre d'apparition, donc la marque du dernier projet ouvre
  // la rangée et chaque tas commence par sa vidéo la plus récente. À date
  // égale (même envoi), une vidéo marquée lead (meta.ts) passe devant, puis
  // l'ordre des dossiers.
  const ordered = all
    .map((c, i) => ({ c, i }))
    .sort((a, b) =>
      time(b.c.date) - time(a.c.date) ||
      Number(!!b.c.lead) - Number(!!a.c.lead) ||
      a.i - b.i)
    .map(({ c }) => c);
  // Puis les marques connues en tête (FEATURED), chacune gardant ses vidéos
  // de la plus récente à la plus ancienne ; le reste suit par date.
  const byMode = (mode: "influence" | "ugc") => {
    const rank = (c: SocialClip) => {
      const i = FEATURED[mode].indexOf(c.brand ?? "");
      return i === -1 ? FEATURED[mode].length : i;
    };
    return ordered
      .filter((c) => c.mode === mode)
      .map((c, i) => ({ c, i }))
      .sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i)
      .map(({ c }) => c);
  };
  return [...byMode("influence"), ...byMode("ugc")];
}
