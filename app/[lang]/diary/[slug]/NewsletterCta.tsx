"use client";

import { useState } from "react";

type Lang = "fr" | "en";
type Status = "idle" | "loading" | "done" | "error";

const copy = {
  fr: {
    title: "Reçois les prochaines séries",
    sub: "Une lettre discrète quand un nouveau voyage sort. Pas de spam.",
    placeholder: "Ton email",
    button: "Je m'inscris",
    sending: "...",
    done: "C'est noté, à bientôt.",
    error: "Une erreur est survenue. Réessaie.",
  },
  en: {
    title: "Get the next series",
    sub: "A quiet letter when a new trip goes live. No spam.",
    placeholder: "Your email",
    button: "Subscribe",
    sending: "...",
    done: "You are in, see you soon.",
    error: "Something went wrong. Try again.",
  },
};

export default function NewsletterCta({ lang }: { lang: Lang }) {
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

  return (
    <div className="nl-cta">
      <style>{`
        .nl-cta { text-align: center; max-width: 420px; margin: 0 auto; }
        .nl-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 22px;
          color: #0a0a0a;
          margin: 0 0 8px;
        }
        .nl-sub { font-size: 11px; letter-spacing: 0.04em; color: #999999; margin: 0 0 20px; line-height: 1.7; }
        .nl-form { display: flex; gap: 8px; justify-content: center; }
        .nl-input {
          flex: 1;
          max-width: 260px;
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
