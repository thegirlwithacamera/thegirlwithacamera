import { readCreatorData } from "@/lib/creator-videos";
import { BRANDS } from "@/lib/brands";
import { withMeta } from "./meta";
import type { SocialClip } from "./constants";

// Les verticales de la page Social, au build. Influence d'abord, puis UGC ;
// dans chaque métier, l'ordre des dossiers (Gear, Lifestyle, Unboxing,
// Fashion, Events).
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
  return [...all.filter((c) => c.mode === "influence"), ...all.filter((c) => c.mode === "ugc")];
}
