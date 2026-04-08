"use client";

import { use } from "react";

const content = {
  fr: {
    title: "Contact",
    desc: "Un projet ? Une collaboration ? N'hésitez pas à me contacter.",
    talkProject: "Parlons de votre projet",
    email: "Email",
    social: "Réseaux Sociaux",
    location: "Localisation",
    paris: "Paris, France",
    travel: "Déplacements possibles",
    name: "Nom",
    yourName: "Votre nom",
    emailLabel: "Email",
    yourEmail: "votre@email.com",
    subject: "Sujet",
    yourProject: "Votre projet",
    message: "Message",
    describeProject: "Décrivez votre projet...",
    send: "ENVOYER",
  },
  en: {
    title: "Contact",
    desc: "A project? A collaboration? Feel free to contact me.",
    talkProject: "Let's talk about your project",
    email: "Email",
    social: "Social Media",
    location: "Location",
    paris: "Paris, France",
    travel: "Available for travel",
    name: "Name",
    yourName: "Your name",
    emailLabel: "Email",
    yourEmail: "your@email.com",
    subject: "Subject",
    yourProject: "Your project",
    message: "Message",
    describeProject: "Describe your project...",
    send: "SEND",
  },
};

export default function ContactPage({ params }: { params: Promise<{ lang: "fr" | "en" }> }) {
  const { lang } = use(params);
  const t = content[lang];

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            {t.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">
              {t.talkProject}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  {t.email.toUpperCase()}
                </h3>
                <a
                  href="mailto:hello@thegirlwithacamera.com"
                  className="text-[#525252] hover:text-black transition-colors"
                >
                  hello@thegirlwithacamera.com
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  {t.social.toUpperCase()}
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.instagram.com/sandrinecppns/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#525252] hover:text-black transition-colors"
                    >
                      Instagram @sandrinecppns
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  {t.location.toUpperCase()}
                </h3>
                <p className="text-[#525252]">{t.paris}</p>
                <p className="text-[#737373] text-sm mt-1">
                  {t.travel}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder={t.yourName}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder={t.yourEmail}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder={t.yourProject}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white resize-none"
                  placeholder={t.describeProject}
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
              >
                {t.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
