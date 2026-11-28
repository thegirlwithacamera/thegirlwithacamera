#!/usr/bin/env python3
"""Programmer des posts depuis le Mac, dans l'outil maison (workers/publier).

C'est l'outil dont Claude se sert pour programmer a la place de Sandrine,
comme avant avec Postiz. Aucune dependance : Python 3.9+ suffit.

Un lot = un fichier JSON :
{
  "posts": [
    {"genre": "essai", "fichiers": ["/Volumes/T7/.../clip1.mp4"], "legende": "...", "quand": "2026-11-28 09:00"},
    {"genre": "carrousel", "fichiers": ["a.jpg", "b.jpg"], "legende": "...", "quand": "2026-11-28 18:30"}
  ]
}
genre : essai (reel d'essai), reel, photo, carrousel. Heure de Bruxelles.
reseau : "instagram" (par defaut) ou "threads" ; sur Threads, genre texte, photo, video ou carrousel
(texte seul : pas de fichiers, 500 caracteres au plus).

Commandes :
  python3 programmer.py lot.json        envoie les fichiers et programme
  python3 programmer.py --essai lot.json  verifie le lot sans rien envoyer
  python3 programmer.py --liste         ce qui est au programme
  python3 programmer.py --retirer ID    retire un post prevu
  python3 programmer.py --legendes f.json  change les legendes {id: legende}
"""
import json
import pathlib
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

URL = "https://tgwac-publier.thegirlwithacamera.workers.dev"
CLE = (pathlib.Path.home() / "Developer/tgwac-website/workers/links/.env.stats-key").read_text().strip()
BXL = ZoneInfo("Europe/Brussels")
MORCEAU = 20 * 1024 * 1024
GENRES = {"essai", "reel", "photo", "carrousel"}
GENRES_THREADS = {"texte", "photo", "video", "carrousel"}
GENRES_YOUTUBE = {"video"}


def api(chemin, data=None, methode=None, brut=None):
    sep = "&" if "?" in chemin else "?"
    url = f"{URL}{chemin}{sep}key={urllib.parse.quote(CLE)}"
    corps = brut if brut is not None else (json.dumps(data).encode() if data is not None else None)
    req = urllib.request.Request(url, data=corps, method=methode or ("POST" if corps is not None else "GET"),
                                 headers={"user-agent": "tgwac-programmer"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            msg = json.loads(e.read()).get("erreur")
        except Exception:
            msg = None
        raise SystemExit(f"Refuse ({e.code}) : {msg or 'erreur'}")


def preparer(chemin):
    """Les photos partent en JPEG (seul format accepte par Instagram)."""
    p = pathlib.Path(chemin).expanduser()
    if not p.exists():
        raise SystemExit(f"Fichier introuvable : {p}")
    ext = p.suffix.lower().lstrip(".")
    if ext in ("heic", "png", "tif", "tiff"):
        sortie = pathlib.Path("/tmp") / (p.stem + "-ig.jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "92", str(p), "--out", str(sortie)],
                       check=True, capture_output=True)
        return sortie
    if ext not in ("jpg", "jpeg", "mp4", "mov", "m4v"):
        raise SystemExit(f"Format non pris en charge : {p.name}")
    return p


def envoyer(p):
    ext = p.suffix.lower().lstrip(".")
    d = api(f"/api/envoi/debut?ext={ext}", methode="POST", brut=b"")
    cle, uid = d["cle"], urllib.parse.quote(d["uploadId"])
    parts, taille, n = [], p.stat().st_size, 1
    with p.open("rb") as f:
        while True:
            bloc = f.read(MORCEAU)
            if not bloc:
                break
            parts.append(api(f"/api/envoi/morceau?cle={cle}&uploadId={uid}&n={n}", methode="PUT", brut=bloc))
            print(f"  {p.name} : {min(n * MORCEAU, taille) * 100 // taille} %", end="\r")
            n += 1
    api(f"/api/envoi/fin?cle={cle}&uploadId={uid}", {"parts": parts})
    print(f"  {p.name} : envoye      ")
    return cle


def lire_lot(fichier):
    lot = json.loads(pathlib.Path(fichier).read_text())
    posts = lot.get("posts", lot if isinstance(lot, list) else [])
    for i, p in enumerate(posts, 1):
        reseau = p.setdefault("reseau", "instagram")
        if p.get("genre") not in ({"threads": GENRES_THREADS, "youtube": GENRES_YOUTUBE}.get(reseau, GENRES)):
            raise SystemExit(f"Post {i} : genre inconnu pour {reseau} ({p.get('genre')})")
        if reseau == "threads" and len(p.get("legende", "")) > 500:
            raise SystemExit(f"Post {i} : texte trop long pour Threads (500 caracteres au plus)")
        p.setdefault("fichiers", [])
        if not p["fichiers"] and p["genre"] != "texte":
            raise SystemExit(f"Post {i} : aucun fichier")
        quand = datetime.strptime(p["quand"], "%Y-%m-%d %H:%M").replace(tzinfo=BXL)
        if quand < datetime.now(BXL):
            raise SystemExit(f"Post {i} : l'heure {p['quand']} est deja passee")
        p["_quand"] = quand
        if len(p.get("legende", "")) > 2200:
            raise SystemExit(f"Post {i} : legende trop longue (2200 caracteres au plus)")
    return posts


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        return
    if a[0] == "--liste":
        for p in api("/api/posts"):
            q = datetime.fromisoformat(p["quand"].replace("Z", "+00:00")).astimezone(BXL)
            print(f"{q:%a %d/%m %H:%M}  {p.get('reseau','instagram')[:2]} {p['genre']:<9} {p['statut']:<10} {p['id']}  {(p['legende'] or '')[:50]!r}"
                  + (f"  ERREUR: {p['erreur']}" if p["statut"] == "erreur" else "") + (f"  {p['lien']}" if p.get("lien") else ""))
        return
    if a[0] == "--legendes":
        # Fichier JSON {"<id>": "nouvelle legende", ...}
        for pid, leg in json.loads(pathlib.Path(a[1]).read_text()).items():
            r = api(f"/api/posts/{pid}/legende", {"legende": leg})
            print(("ok  " if r.get("ok") else "NON ") + pid[:8] + "  " + leg[:60])
        return
    if a[0] == "--retirer":
        api(f"/api/posts/{a[1]}/supprimer", methode="POST", brut=b"")
        print("retire")
        return
    essai = a[0] == "--essai"
    posts = lire_lot(a[-1])
    print(f"{len(posts)} post(s) dans le lot.")
    if essai:
        for p in posts:
            print(f"  {p['_quand']:%a %d/%m %H:%M}  {p['reseau'][:2]} {p['genre']:<9} {len(p['fichiers'])} fichier(s)  {p.get('legende', '')[:60]!r}")
        return
    a_programmer = []
    for p in posts:
        cles = [envoyer(preparer(f)) for f in p["fichiers"]]
        a_programmer.append({"reseau": p["reseau"], "genre": p["genre"], "medias": cles, "legende": p.get("legende", ""),
                             "quand": p["_quand"].astimezone(ZoneInfo("UTC")).isoformat()})
    r = api("/api/posts", {"posts": a_programmer})
    print(f"Programme : {len(r.get('ids', []))} post(s).")


if __name__ == "__main__":
    main()
