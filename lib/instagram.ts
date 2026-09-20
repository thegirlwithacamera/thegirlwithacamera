// ─────────────────────────────────────────────────────────────
// Flux Instagram de la bande "Follow on Instagram" (accueil).
//
// Mise en place le 20/09 : la bande montrait cinq photos du site avec des
// liens de posts collés à la main. Elle montre maintenant les cinq derniers
// posts du compte, lus par l'API officielle (Instagram API with Instagram
// Login, compte Creator ou Business).
//
// Le jeton vit dans la variable d'environnement INSTAGRAM_TOKEN sur Vercel.
// Il dure 60 jours et se renouvelle tout seul (.github/workflows/
// instagram-token.yml, une fois par semaine). Si le jeton manque, a expire
// ou si Meta repond mal, on retombe sur INSTAGRAM_FALLBACK : la bande garde
// l'allure qu'elle a toujours eue, l'accueil ne casse jamais.
// ─────────────────────────────────────────────────────────────

export type InstaTile = {
  src: string;
  href: string;
  alt: string;
  reel?: boolean;
};

// Les cinq vignettes d'avant, gardees comme filet de secours.
export const INSTAGRAM_FALLBACK: InstaTile[] = [
  { src: "/images/portfolio/hospitality/naturel-dorf-schonleitn/7.jpg", href: "https://www.instagram.com/p/DdDv9EIsJqX/", alt: "The pool at Naturel Hoteldorf Schönleitn" },
  { src: "/images/portfolio/hospitality/hotel-rathaus-wien/1.jpg", href: "https://www.instagram.com/p/DdO1LtrMUgC/", alt: "A morning at Hotel Rathaus Wein & Design, Vienna" },
  { src: "/images/journal/interrail/train-window.jpg", href: "https://www.instagram.com/p/DdTY_Rzscp-/", alt: "On the train across Europe" },
  { src: "/images/portfolio/travel/villach/5.jpg", href: "https://www.instagram.com/p/Dc0Au8aIaXM/", alt: "Villach, Carinthia" },
  { src: "/images/home/instagram/vending-machine-story.jpg", href: "https://www.instagram.com/p/DRaAAitjNuO/", alt: "A Vending Machine Story, by The Girl With A Camera" },
];

type Media = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
};

const FIELDS = "id,media_type,media_url,thumbnail_url,permalink,caption";

// La legende sert de texte alternatif. On prend la premiere ligne, sans les
// hashtags, coupee court : c'est ce qu'un lecteur d'ecran doit entendre.
function altFromCaption(caption?: string): string {
  const first = (caption ?? "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !l.startsWith("#"));
  if (!first) return "A photograph by Sandrine Ceuppens on Instagram";
  const clean = first.replace(/#\S+/g, "").replace(/\s+/g, " ").trim();
  if (!clean) return "A photograph by Sandrine Ceuppens on Instagram";
  return clean.length > 120 ? `${clean.slice(0, 117).trimEnd()}...` : clean;
}

export async function latestInstagramTiles(limit = 5): Promise<InstaTile[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) return INSTAGRAM_FALLBACK;

  try {
    const url = `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${limit * 3}&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return INSTAGRAM_FALLBACK;

    const json: { data?: Media[] } = await res.json();
    const tiles = (json.data ?? [])
      .map((m): InstaTile | null => {
        // Une video n'a pas de media_url affichable en vignette, on prend sa
        // miniature. Un carrousel renvoie la premiere image.
        const src = m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url;
        if (!src || !m.permalink) return null;
        return {
          src,
          href: m.permalink,
          alt: altFromCaption(m.caption),
          reel: m.media_type === "VIDEO",
        };
      })
      .filter((t): t is InstaTile => t !== null)
      .slice(0, limit);

    // La bande est dessinee pour cinq vignettes exactement (la cinquieme est
    // masquee sur mobile pour garder deux rangees de deux). Moins que ca,
    // c'est que la reponse est incomplete : on garde le filet.
    return tiles.length === limit ? tiles : INSTAGRAM_FALLBACK;
  } catch {
    return INSTAGRAM_FALLBACK;
  }
}
