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
    consent: "I'll only use this to reply. See the ",
    consentLink: "privacy policy",
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
    consent: "J'utilise ces infos uniquement pour vous répondre. Voir la ",
    consentLink: "politique de confidentialité",
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
    <div className="pt-32 pb-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 border-b border-[#e5e5e5] pb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">{t.eyebrow}</p>
          <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] font-bold leading-none">
            {t.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
          {/* Left column */}
          <aside>
            <p className="text-[#525252] leading-relaxed mb-8 max-w-sm">{t.intro}</p>
            <p className="text-xs tracking-[0.25em] uppercase text-[#737373] mb-3">{t.direct}</p>
            <a href={`mailto:${site.email}`} className="block text-base hover:underline mb-2">{site.email}</a>
            <a href={`mailto:${site.pressEmail}`} className="block text-sm text-[#737373] hover:underline">{site.pressEmail}</a>
          </aside>

          {/* Form */}
          <div>
            {status === "success" ? (
              <p className="text-lg text-[#1a1a1a]">{t.success}</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  aria-hidden="true"
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.name} *</label>
                    <input id="name" type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.email} *</label>
                    <input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.company}</label>
                  <input id="company" type="text" value={form.company} onChange={(e) => update("company", e.target.value)} className={inputCls} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="type" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.type} *</label>
                    <select id="type" required value={form.type} onChange={(e) => update("type", e.target.value)} className={inputCls}>
                      <option value=""></option>
                      {t.typeOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.budget}</label>
                    <select id="budget" value={form.budget} onChange={(e) => update("budget", e.target.value)} className={inputCls}>
                      <option value=""></option>
                      {t.budgetOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.deadline}</label>
                  <input id="deadline" type="text" placeholder={lang === "fr" ? "ex. juin 2026" : "e.g. June 2026"} value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className={inputCls} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs tracking-[0.2em] uppercase text-[#737373] mb-2">{t.message} *</label>
                  <textarea id="message" required rows={6} placeholder={t.messagePh} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputCls} resize-none`} />
                </div>

                <p className="text-xs text-[#737373]">
                  {t.consent}
                  <a href={`/${lang}/legal/privacy`} className="underline hover:no-underline">{t.consentLink}</a>.
                </p>

                {status === "error" && <p className="text-red-600 text-sm">{t.error}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full md:w-auto px-10 py-4 bg-black text-white text-xs font-medium tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
                >
                  {status === "sending" ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
