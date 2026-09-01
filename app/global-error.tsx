"use client";

// Filet de sécurité global, ajouté le 01/09.
//
// Ce projet n'a pas de layout racine : c'est app/[lang]/layout.tsx qui porte
// <html> et <body>. Next génère alors sa propre page /_global-error, qui a
// besoin d'un contexte React qu'elle ne trouve pas, et le build de production
// échouait dessus. Une page global-error à nous règle le problème et donne au
// passage un écran lisible plutôt qu'une trace technique.
//
// Elle doit rendre ses propres <html> et <body> : quand elle s'affiche, le
// layout de langue n'est plus là.

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "Georgia, serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "480px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#999",
              margin: "0 0 18px",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Erreur
          </p>
          <h1 style={{ fontSize: "40px", fontWeight: 400, margin: "0 0 18px", lineHeight: 1.1 }}>
            Out of frame.
          </h1>
          <p
            style={{
              color: "#525252",
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            Quelque chose s&rsquo;est mal passé. / Something went wrong.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                border: "1px solid #0a0a0a",
                background: "#0a0a0a",
                color: "#fff",
                padding: "12px 24px",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Réessayer
            </button>
            <a
              href="/fr"
              style={{
                border: "1px solid #0a0a0a",
                padding: "12px 24px",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                textDecoration: "none",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
