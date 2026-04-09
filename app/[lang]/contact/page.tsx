"use client";

import { use, useState } from "react";

const content = {
  en: {
    sub: "Your Masterpiece Starts Here",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "Your Masterpiece Starts Here",
    send: "Send It!",
    sending: "Sending...",
    success: "Message sent. I'll be in touch soon.",
    error: "Something went wrong. Try emailing me directly.",
  },
  fr: {
    sub: "Votre projet commence ici",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "Votre email",
    messagePlaceholder: "Votre projet commence ici",
    send: "Envoyer !",
    sending: "Envoi...",
    success: "Message envoyé. Je reviens vers vous très vite.",
    error: "Une erreur s'est produite. Écrivez-moi directement.",
  },
};

export default function ContactPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const t = content[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen pt-20 px-8 md:px-16 pb-16">
      {/* Big title */}
      <h1 className="font-serif text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-tight mt-8 mb-16">
        SHOOT A<br />REQUEST
      </h1>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left — email */}
        <div>
          <a
            href="mailto:hello@thegirlwithacamera.com"
            className="text-sm text-[#525252] hover:text-black transition-colors"
          >
            hello@thegirlwithacamera.com
          </a>
        </div>

        {/* Right — form */}
        <div>
          {status === "success" ? (
            <p className="text-[#525252]">{t.success}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f5] border-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f5] border-none focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
              <textarea
                required
                rows={6}
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-[#f5f5f5] border-none focus:outline-none focus:ring-1 focus:ring-black text-sm resize-none"
              />
              {status === "error" && (
                <p className="text-red-500 text-sm">{t.error}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-black text-white text-sm font-medium tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {status === "sending" ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
