// Sert les videos du portfolio depuis le bucket R2.
//
// Pourquoi ce Worker plutot que l'adresse publique du bucket : l'adresse en
// r2.dev fournie par Cloudflare est reservee au developpement et limitee en
// debit. La methode officielle pour de la production serait un sous-domaine
// de thegirlwithacamera.com, mais elle obligerait a deplacer la zone DNS du
// domaine chez Cloudflare, donc aussi le routage des mails. Hors de
// question pour des videos. Ce Worker sert le meme contenu sur une adresse
// workers.dev, sans toucher au domaine.
//
// Seul le prefixe videos/ est expose : le bucket pourrait contenir autre
// chose un jour, ce n'est pas au Worker d'en decider.

const ALLOWED_PREFIX = "videos/";

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Methode non autorisee", { status: 405, headers: { allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    if (!key.startsWith(ALLOWED_PREFIX)) {
      return new Response("Introuvable", { status: 404 });
    }

    const object = await env.VIDEOS.get(key, {
      range: request.headers,
      onlyIf: request.headers,
    });
    if (object === null) {
      return new Response("Introuvable", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    // Les fichiers ne changent jamais sous le meme nom : un nouveau montage
    // arrive sous un nouveau nom. On peut donc cacher sans retenue.
    headers.set("cache-control", "public, max-age=31536000, immutable");
    headers.set("accept-ranges", "bytes");
    headers.set("access-control-allow-origin", "*");

    if (object.range && "offset" in object.range) {
      const end = object.range.end ?? object.size - 1;
      headers.set("content-range", `bytes ${object.range.offset}-${end}/${object.size}`);
    }

    // 304 quand le navigateur a deja le fichier, 206 pour une lecture
    // partielle (le curseur de la video), 200 sinon.
    const status = object.body ? (request.headers.get("range") ? 206 : 200) : 304;
    return new Response(object.body, { headers, status });
  },
};
