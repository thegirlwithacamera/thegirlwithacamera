"use client";

import { useState } from "react";

type Lang = "fr" | "en";
type Status = "idle" | "loading" | "done" | "error";
type Variant = "page" | "footer";

const copy = {
  fr: {
    title: "Le journal",
    sub: "La rue, le voyage, et ce qui se passe autour des images. Gratuit, presque chaque semaine.",
    placeholder: "Ton email",
    button: "Je m'inscris",
    sending: "...",
    done: "C'est fait. Le premier email arrive.",
    error: "Une erreur est survenue. Réessaie.",
  },
  en: {
    title: "The journal",
    sub: "Street, travel, and what happens between the pictures. Free, most weeks.",
    placeholder: "Your email",
    button: "Subscribe",
    sending: "...",
    done: "You are in. The first letter is on its way.",
    error: "Something went wrong. Try again.",
  },
};

export default function NewsletterCta({
  lang,
  variant = "page",
}: {
  lang: Lang;
  variant?: Variant;
}) {
  const t = copy[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const compact = variant === "footer";

  return (
    <div className={compact ? "nl-cta nl-compact" : "nl-cta"}>
      <style>{`
        .nl-cta { text-align: center; max-width: 520px; margin: 0 auto; }
        .nl-title {
          font-family: var(--font-serif);
          font-size: var(--text-m);
          font-weight: 400;
          color: var(--ink);
          margin: 0 0 10px;
        }
        .nl-title em { font-style: italic; color: var(--brick); }
        .nl-sub {
          font-family: var(--font-serif);
          font-size: var(--text-body);
          line-height: 1.5;
          color: var(--stone);
          margin: 0 0 24px;
        }
        .nl-form { display: flex; gap: 12px; justify-content: center; align-items: flex-end; }
        .nl-input {
          flex: 1;
          max-width: 300px;
          border: none;
          border-bottom: 1px solid var(--dust);
          background: transparent;
          padding: 8px 4px;
          font-family: var(--font-sans);
          font-size: var(--text-ui);
          color: var(--ink);
          outline: none;
          border-radius: 0;
        }
        .nl-input:focus { border-bottom-color: var(--brick); }
        .nl-btn {
          border: none;
          background: none;
          font-family: var(--font-sans);
          font-size: var(--text-label);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink);
          cursor: pointer;
          border-bottom: 1px solid var(--ink);
          padding: 0 0 6px;
          white-space: nowrap;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .nl-btn:hover { color: var(--brick); border-color: var(--brick); }
        .nl-btn:disabled { color: var(--stone); border-color: var(--stone); cursor: default; }
        .nl-msg { font-size: var(--text-ui); color: var(--stone); margin: 16px 0 0; }
        /* Variante footer : le titre passe en petites capitales. */
        .nl-compact .nl-title {
          font-family: var(--font-sans);
          font-size: var(--text-label);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--stone);
          margin: 0 0 12px;
        }
        .nl-compact .nl-sub { font-size: var(--text-caption); margin: 0 0 20px; }
        @media (max-width: 520px) {
          .nl-form { flex-direction: column; align-items: center; gap: 16px; }
          .nl-input { max-width: 100%; width: 100%; text-align: center; }
        }
      `}</style>

      <h3 className="nl-title">{t.title}</h3>
      <p className="nl-sub">{t.sub}</p>

      {status === "done" ? (
        <p className="nl-msg">{t.done}</p>
      ) : (
        <form className="nl-form" onSubmit={onSubmit}>
          <input
            className="nl-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
          />
          <button className="nl-btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? t.sending : t.button}
          </button>
        </form>
      )}
      {status === "error" && <p className="nl-msg">{t.error}</p>}
    </div>
  );
}
