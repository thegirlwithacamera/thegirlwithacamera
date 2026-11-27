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
  maj        TEXT
);
CREATE INDEX IF NOT EXISTS planning_statut_quand ON planning (statut, quand);
