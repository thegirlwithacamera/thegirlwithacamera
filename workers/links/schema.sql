-- Une ligne par jour, par lien et par provenance. Rien sur les visiteurs.
CREATE TABLE IF NOT EXISTS clicks (
  day    TEXT    NOT NULL,
  link   TEXT    NOT NULL,
  source TEXT    NOT NULL DEFAULT 'direct',
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, link, source)
);
