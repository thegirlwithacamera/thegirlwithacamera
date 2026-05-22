"use client";

import { use, useState } from "react";
import { site } from "@/lib/site";

const content = {
  en: {
    eyebrow: "Contact",
    title: "Let's talk",
    intro: "A few details help me reply faster and better. I read everything.",
    name: "Your name",
    email: "Your email",
    company: "Company / publication (optional)",
    type: "Project type",
    typeOptions: [
      { value: "brand", label: "Brand content (video + photo)" },
      { value: "editorial", label: "Editorial / documentary" },
      { value: "print", label: "Prints" },
      { value: "mentoring", label: "Mentoring" },
      { value: "press", label: "Press / interview" },
      { value: "other", label: "Other" },
    ],
    budget: "Indicative budget",
    budgetOptions: [
      { value: "under-2k", label: "Under €2,000" },
      { value: "2-5k", label: "€2,000 – €5,000" },
      { value: "5-15k", label: "€5,000 – €15,000" },
      { value: "15k+", label: "€15,000+" },
      { value: "tbd", label: "To be discussed" },
    ],
    deadline: "Ideal timing",
    message: "Tell me about the project",
    messagePh: "Context, intention, references, anything that helps.",
    consent: "I'll only use this information to reply to you.",
    send: "Send",
    sending: "Sending…",
    success: "Message received. I'll be in touch within 48 working hours.",
    error: "Something went wrong. Try emailing me directly.",
    direct: "Or write directly:",
  },
  fr: {
    eyebrow: "Contact",
    title: "Discutons",
    intro: "Quelques précisions m'aident à répondre vite et bien. Je lis tout.",
    name: "Votre nom",
    email: "Votre email",
    company: "Entreprise / publication (optionnel)",
    type: "Type de projet",
    typeOptions: [
      { value: "brand", label: "Brand content (vidéo + photo)" },
      { value: "editorial", label: "Éditorial / documentaire" },
      { value: "print", label: "Tirages" },
      { value: "mentoring", label: "Mentorat" },
      { value: "press", label: "Presse / interview" },
      { value: "other", label: "Autre" },
    ],
    budget: "Budget indicatif",
    budgetOptions: [
      { value: "under-2k", label: "Moins de 2 000 €" },
      { value: "2-5k", label: "2 000 € – 5 000 €" },
      { value: "5-15k", label: "5 000 € – 15 000 €" },
      { value: "15k+", label: "15 000 € et +" },
      { value: "tbd", label: "À discuter" },
    ],
    deadline: "Échéance idéale",
    message: "Parlez-moi du projet",
    messagePh: "Contexte, intention, références, tout ce qui peut aider.",
    consent: "J'utilise ces informations uniquement pour vous répondre.",
    send: "Envoyer",
    sending: "Envoi…",
    success: "Message reçu. Je reviens vers vous sous 48h ouvrées.",
    error: "Une erreur. Écrivez-moi directement.",
    direct: "Ou directement :",
  },
};

export default function ContactPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const t = content[lang];

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    type: "",
    budget: "",
    deadline: "",
    message: "",
  });
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // bot
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full px-4 py-3 bg-white border border-[#d4d4d4] focus:outline-none focus:border-black text-sm placeholder:text-[#a3a3a3]";

  return (
    <main style={{ paddingTop: "64px" }}>
      <style>{`
        @media(max-width:768px){
          .contact-header { padding: 48px 24px 36px !important; }
          .contact-body { padding: 48px 24px 80px !important; flex-direction: column !important; }
          .contact-aside { width: 100% !important; paddingRight: 0 !important; paddingBottom: 40px !important; borderRight: none !important; borderBottom: 1px solid #ebebeb !important; }
        }
        .contact-input {
          width: 100%;
          padding: 14px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid #d8d8d8;
          font-size: 14px;
          color: #0a0a0a;
          outline: none;
          transition: border-color 0.2s;
        }
        .contact-input:focus { border-bottom-color: #0a0a0a; }
        .contact-input::placeholder { color: #c0c0c0; }
        .contact-label {
          display: block;
          font-size: 8px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b0b0b0;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .contact-select {
          width: 100%;
          padding: 14px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid #d8d8d8;
          font-size: 14px;
          color: #0a0a0a;
          outline: none;
          appearance: none;
          cursor: pointer;
        }
        .contact-select:focus { border-bottom-color: #0a0a0a; }
        .contact-textarea {
          width: 100%;
          padding: 14px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid #d8d8d8;
          font-size: 14px;
          color: #0a0a0a;
          outline: none;
          resize: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .contact-textarea:focus { border-bottom-color: #0a0a0a; }
        .contact-textarea::placeholder { color: #c0c0c0; }
      `}</style>

      {/* HERO HEADER */}
      <section className="contact-header" style={{ padding: "72px 64px 56px", borderBottom: "1px solid #ebebeb", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "20px" }}>
              {t.eyebrow}
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(48px, 7vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
            }}>
              {t.title}
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#9a9a9a", lineHeight: 1.8, maxWidth: "340px", paddingBottom: "8px" }}>
            {t.intro}
          </p>
        </div>
      </section>

      {/* BODY — aside + form */}
      <div className="contact-body" style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 64px 96px", display: "flex", gap: "80px" }}>

        {/* ASIDE */}
        <aside className="contact-aside" style={{ width: "280px", flexShrink: 0, paddingRight: "64px", borderRight: "1px solid #ebebeb" }}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "16px" }}>
              {t.direct}
            </p>
            <a href="mailto:hello@thegirlwithacamera.com" style={{ display: "block", fontSize: "13px", color: "#0a0a0a", textDecoration: "none", marginBottom: "6px", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#0a0a0a")}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              hello@thegirlwithacamera.com
            </a>
            <a href="mailto:press@thegirlwithacamera.com" style={{ display: "block", fontSize: "12px", color: "#9a9a9a", textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#9a9a9a")}
              onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              press@thegirlwithacamera.com
            </a>
          </div>

          <div>
            <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "16px" }}>
              {lang === "fr" ? "Me retrouver" : "Join me on"}
            </p>
            {[
              { label: "Instagram", href: "https://instagram.com/thegirlwithacamera" },
              { label: "Threads", href: "https://threads.net/@thegirlwithacamera" },
              { label: "TikTok", href: "https://tiktok.com/@thegirlwithacamera" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", fontSize: "12px", color: "#6a6a6a", textDecoration: "none", marginBottom: "8px", borderBottom: "1px solid transparent", transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0a0a0a"; e.currentTarget.style.borderBottomColor = "#0a0a0a"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6a6a6a"; e.currentTarget.style.borderBottomColor = "transparent"; }}
              >
                {s.label}
              </a>
            ))}
          </div>

          <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #ebebeb" }}>
            <p style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#b0b0b0", fontWeight: 600, marginBottom: "12px" }}>
              {lang === "fr" ? "Réponse sous" : "Response within"}
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "#0a0a0a", letterSpacing: "-0.01em" }}>
              48h
            </p>
          </div>
        </aside>

        {/* FORM */}
        <div style={{ flex: 1 }}>
          {status === "success" ? (
            <div style={{ paddingTop: "40px" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "#0a0a0a", marginBottom: "16px", letterSpacing: "-0.01em" }}>
                {lang === "fr" ? "Bien reçu." : "Got it."}
              </p>
              <p style={{ fontSize: "14px", color: "#9a9a9a", lineHeight: 1.8 }}>{t.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
              {/* honeypot */}
              <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" style={{ display: "none" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <label htmlFor="name" className="contact-label">{t.name} *</label>
                  <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className="contact-input" placeholder="—" />
                </div>
                <div>
                  <label htmlFor="email" className="contact-label">{t.email} *</label>
                  <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className="contact-input" placeholder="—" />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="contact-label">{t.company}</label>
                <input id="company" type="text" value={form.company} onChange={(e) => update("company", e.target.value)} className="contact-input" placeholder="—" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div>
                  <label htmlFor="type" className="contact-label">{t.type} *</label>
                  <select id="type" required value={form.type} onChange={(e) => update("type", e.target.value)} className="contact-select">
                    <option value="">—</option>
                    {t.typeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="budget" className="contact-label">{t.budget}</label>
                  <select id="budget" value={form.budget} onChange={(e) => update("budget", e.target.value)} className="contact-select">
                    <option value="">—</option>
                    {t.budgetOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="deadline" className="contact-label">{t.deadline}</label>
                <input id="deadline" type="text" placeholder={lang === "fr" ? "ex. juin 2026" : "e.g. June 2026"} value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className="contact-input" />
              </div>

              <div>
                <label htmlFor="message" className="contact-label">{t.message} *</label>
                <textarea id="message" required rows={5} placeholder={t.messagePh} value={form.message} onChange={(e) => update("message", e.target.value)} className="contact-textarea" />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
                <p style={{ fontSize: "11px", color: "#b0b0b0" }}>{t.consent}</p>
                {status === "error" && <p style={{ fontSize: "12px", color: "#cc3333" }}>{t.error}</p>}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    padding: "14px 40px",
                    background: "#0a0a0a",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    opacity: status === "sending" ? 0.5 : 1,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { if (status !== "sending") (e.currentTarget as HTMLElement).style.background = "#333"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; }}
                >
                  {status === "sending" ? t.sending : t.send}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
