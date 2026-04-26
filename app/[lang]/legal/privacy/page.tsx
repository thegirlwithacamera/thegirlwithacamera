import type { Metadata } from "next";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "Politique de confidentialité" : "Privacy policy",
    alternates: { canonical: `/${lang}/legal/privacy`, languages: { fr: "/fr/legal/privacy", en: "/en/legal/privacy" } },
    robots: { index: true, follow: false },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <article className="pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-neutral">
        <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10">
          {isFr ? "Politique de confidentialité" : "Privacy policy"}
        </h1>

        {isFr ? (
          <div className="space-y-6 text-[#525252] leading-relaxed">
            <p>Le présent site est édité par Sandrine Ceuppens, photographe indépendante établie à Bruxelles, Belgique. Cette page décrit comment vos données personnelles sont collectées et utilisées, dans le respect du Règlement général sur la protection des données (RGPD, UE 2016/679).</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Données collectées</h2>
            <p>Le formulaire de contact collecte votre nom, votre email et le contenu de votre message. La newsletter collecte uniquement votre email et la langue choisie.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Finalité</h2>
            <p>Ces données servent uniquement à vous répondre ou à vous envoyer la newsletter à laquelle vous vous êtes inscrit·e. Elles ne sont jamais revendues.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Sous-traitants</h2>
            <p>Les emails sont acheminés via <a className="underline" href="https://resend.com/legal/privacy" target="_blank" rel="noreferrer">Resend</a>. L'hébergement du site est assuré par <a className="underline" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel</a>. Le contenu éditorial transite via <a className="underline" href="https://www.sanity.io/legal/privacy" target="_blank" rel="noreferrer">Sanity</a>.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Vos droits</h2>
            <p>Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données. Pour exercer ces droits : <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Cookies</h2>
            <p>Ce site n'utilise pas de cookies de tracking ni de publicité. Aucune donnée n'est partagée avec des tiers à des fins commerciales.</p>
          </div>
        ) : (
          <div className="space-y-6 text-[#525252] leading-relaxed">
            <p>This site is operated by Sandrine Ceuppens, independent photographer based in Brussels, Belgium. This page describes how your personal data is collected and used, in accordance with the General Data Protection Regulation (GDPR, EU 2016/679).</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Data collected</h2>
            <p>The contact form collects your name, email and message. The newsletter collects only your email and language preference.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Purpose</h2>
            <p>This data is used solely to reply to you or to send the newsletter you subscribed to. It is never resold.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Processors</h2>
            <p>Emails are routed via <a className="underline" href="https://resend.com/legal/privacy" target="_blank" rel="noreferrer">Resend</a>. The site is hosted by <a className="underline" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel</a>. Editorial content goes through <a className="underline" href="https://www.sanity.io/legal/privacy" target="_blank" rel="noreferrer">Sanity</a>.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Your rights</h2>
            <p>You have the right to access, rectify, port and delete your data. To exercise these rights: <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>

            <h2 className="font-serif text-2xl font-bold mt-10">Cookies</h2>
            <p>This site does not use tracking or advertising cookies. No data is shared with third parties for commercial purposes.</p>
          </div>
        )}
      </div>
    </article>
  );
}
