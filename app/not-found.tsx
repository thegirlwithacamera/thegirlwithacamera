// Page 404 de racine.
//
// Elle porte ses propres <html> et <body> depuis le 01/09. Ce projet n'a pas
// de layout racine : c'est app/[lang]/layout.tsx qui les rend. Une page posee
// a la racine n'a donc aucun layout au dessus d'elle, et le build de
// production echouait en essayant de la pre-rendre.
//
// En pratique on ne la voit presque jamais : le middleware renvoie toute URL
// sans prefixe de langue vers /fr ou /en. Elle reste le filet pour ce que le
// middleware ne couvre pas.

export default function NotFound() {
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
          textAlign: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
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
            }}
          >
            404
          </p>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "44px",
              fontWeight: 400,
              margin: "0 0 18px",
              lineHeight: 1.05,
            }}
          >
            Off frame.
          </h1>
          <p style={{ color: "#525252", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px" }}>
            Cette page n&rsquo;existe pas, ou plus. / This page doesn&rsquo;t exist, or doesn&rsquo;t any more.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/fr"
              style={{
                background: "#0a0a0a",
                color: "#fff",
                padding: "12px 24px",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              FR · Accueil
            </a>
            <a
              href="/en"
              style={{
                border: "1px solid #0a0a0a",
                color: "#0a0a0a",
                padding: "12px 24px",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              EN · Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
