import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Film",
    description:
      lang === "fr"
        ? "Films documentaires et créations vidéo par Sandrine Ceuppens."
        : "Documentary films and video work by Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/film`, languages: { fr: "/fr/film", en: "/en/film" } },
  };
}

// Ajouter des films ici.
// { src: "/videos/mon-film.mp4", poster: "/videos/mon-film-cover.jpg" }
const ALL_FILMS: { src: string; poster?: string }[] = [];

export default async function FilmPage({ params }: Props) {
  const { lang } = await params;

  return (
    <>
      <style>{`
        .film-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          padding: 0 20px;
        }
        .film-cell {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          position: relative;
          background: #111;
        }
        .film-cell video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 767px) {
          .film-grid {
            grid-template-columns: 1fr;
            gap: 4px;
            padding: 0 16px;
          }
        }
      `}</style>

      <main style={{ paddingTop: "16px", paddingBottom: "60px", background: "#ffffff" }}>
        {ALL_FILMS.length === 0 ? (
          <p style={{
            textAlign: "center",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#c0c0c0",
            paddingTop: "80px",
          }}>
            {lang === "fr" ? "En préparation" : "Coming soon"}
          </p>
        ) : (
          <div className="film-grid">
            {ALL_FILMS.map((v, i) => (
              <div key={i} className="film-cell">
                <video src={v.src} poster={v.poster} autoPlay muted loop playsInline />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
