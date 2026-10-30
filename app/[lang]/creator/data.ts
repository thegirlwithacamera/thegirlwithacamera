import { readCreatorData } from "@/lib/creator-videos";
import { withMeta } from "./meta";
import type { SocialClip } from "./constants";

// Les verticales de la page Social, au build. Influence d'abord, puis UGC ;
// dans chaque métier, l'ordre des dossiers (Gear, Lifestyle, Unboxing).
export function readSocial(lang: "fr" | "en"): SocialClip[] {
  const data = readCreatorData();
  const all = [...data.gear, ...data.lifestyle, ...data.unboxing]
    .map((c) => withMeta(c, lang))
    .filter((c): c is SocialClip => c !== null);
  return [...all.filter((c) => c.mode === "influence"), ...all.filter((c) => c.mode === "ugc")];
}
