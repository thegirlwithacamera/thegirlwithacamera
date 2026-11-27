-- Une ligne par jour, par lien et par provenance. Rien sur les visiteurs.
CREATE TABLE IF NOT EXISTS clicks (
  day    TEXT    NOT NULL,
  link   TEXT    NOT NULL,
  source TEXT    NOT NULL DEFAULT 'direct',
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, link, source)
);

-- Tableau de bord Instagram : le dernier releve, et le nombre d'abonnes jour apres jour.
CREATE TABLE IF NOT EXISTS releves (
  nom   TEXT PRIMARY KEY,
  corps TEXT NOT NULL,
  maj   TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS abonnes (
  jour TEXT PRIMARY KEY,
  n    INTEGER NOT NULL
);

-- Chiffres notes a la main depuis l'app (reels pousses en pub par un partenaire).
CREATE TABLE IF NOT EXISTS corrections (
  code   TEXT PRIMARY KEY,
  vues   INTEGER,
  portee INTEGER,
  maj    TEXT NOT NULL
);

-- Notes de Sandrine sur ses reels d'essai.
CREATE TABLE IF NOT EXISTS notes (
  code     TEXT PRIMARY KEY,
  accroche TEXT,
  format   TEXT,
  musique  TEXT,
  maj      TEXT NOT NULL
);
