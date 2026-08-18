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
        .nl-cta { text-align: center; max-width: 460px; margin: 0 auto; }
        .nl-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 26px;
          color: #0a0a0a;
          margin: 0 0 10px;
        }
        .nl-sub {
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #737373;
          margin: 0 0 22px;
          line-height: 1.8;
        }
        .nl-form { display: flex; gap: 8px; justify-content: center; }
        .nl-input {
          flex: 1;
          max-width: 280px;
          border: none;
          border-bottom: 1px solid #cccccc;
          background: transparent;
          padding: 8px 4px;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: #0a0a0a;
          outline: none;
        }
        .nl-input:focus { border-bottom-color: #0a0a0a; }
        .nl-btn {
          border: none;
          background: none;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0a0a0a;
          cursor: pointer;
          border-bottom: 1px solid #0a0a0a;
          padding: 0 0 4px;
          white-space: nowrap;
        }
        .nl-btn:disabled { color: #999; border-color: #999; cursor: default; }
        .nl-msg { font-size: 11px; letter-spacing: 0.06em; color: #666666; margin: 16px 0 0; }

        /* Variante footer : plus discrete, le titre passe en capitales fines. */
        .nl-compact .nl-title {
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #737373;
          margin: 0 0 10px;
        }
        .nl-compact .nl-sub { font-size: 11px; margin: 0 0 18px; }

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
