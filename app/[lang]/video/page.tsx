import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Video",
    description:
      lang === "fr"
        ? "Créations vidéo et brand content par Sandrine Ceuppens."
        : "Video work and brand content by Sandrine Ceuppens.",
    alternates: { canonical: `/${lang}/video`, languages: { fr: "/fr/video", en: "/en/video" } },
  };
}

// Ajouter des vidéos ici — même principe que les photos.
// Chaque entrée : src (chemin dans /public/videos/), poster (miniature), title optionnel.
const ALL_VIDEOS: { src: string; poster?: string }[] = [
  // { src: "/videos/mon-film.mp4", poster: "/videos/mon-film-cover.jpg" },
];

export default async function VideoPage({ params }: Props) {
  const { lang } = await params;

  return (
    <>
      <style>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 0 20px;
        }
        .video-cell {
          display: block;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          position: relative;
          background: #f0f0f0;
        }
        .video-cell video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @media (max-width: 767px) {
          .video-grid {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 0 16px;
          }
        }
      `}</style>

      <main style={{ paddingTop: "90px", paddingBottom: "60px", background: "#ffffff" }}>
        {ALL_VIDEOS.length === 0 ? (
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
          <div className="video-grid">
            {ALL_VIDEOS.map((v, i) => (
              <div key={i} className="video-cell">
                <video
                  src={v.src}
                  poster={v.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
