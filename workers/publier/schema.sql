-- Programmation des publications (workers/publier).
CREATE TABLE IF NOT EXISTS planning (
  id         TEXT PRIMARY KEY,
  reseau     TEXT NOT NULL,
  genre      TEXT NOT NULL,
  legende    TEXT,
  medias     TEXT NOT NULL,
  quand      TEXT NOT NULL,
  statut     TEXT NOT NULL,
  couverture INTEGER,
  conteneur  TEXT,
  enfants    TEXT,
  resultat   TEXT,
  lien       TEXT,
  erreur     TEXT,
  essais     INTEGER DEFAULT 0,
  menage     INTEGER,
  cree       TEXT,
  maj        TEXT,
  extra      TEXT
);
CREATE INDEX IF NOT EXISTS planning_statut_quand ON planning (statut, quand);

-- Machine a commentaires (src/commentaires.js).
CREATE TABLE IF NOT EXISTS reglages (nom TEXT PRIMARY KEY, valeur TEXT);
CREATE TABLE IF NOT EXISTS com_faits (id TEXT PRIMARY KEY, quand INTEGER);
CREATE TABLE IF NOT EXISTS com_compteurs (media TEXT PRIMARY KEY, n INTEGER);
CREATE TABLE IF NOT EXISTS com_journal (date TEXT, action TEXT, regle TEXT, compte TEXT, commentaire TEXT, id_commentaire TEXT, id_media TEXT, detail TEXT);

-- Reels du studio prets a programmer (envoyes depuis le Mac par studio/vers_planner.py).
CREATE TABLE IF NOT EXISTS studio (
  id TEXT PRIMARY KEY,
  reseau TEXT NOT NULL DEFAULT 'instagram',
  titre TEXT,
  legende TEXT,
  cle TEXT NOT NULL,
  duree TEXT,
  empreinte TEXT,
  statut TEXT NOT NULL DEFAULT 'pret',
  ajoute TEXT NOT NULL,
  photos TEXT
);
