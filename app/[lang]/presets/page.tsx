import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';

// Pour retirer la page (produit Gumroad depublie, etc.) :
// passer PRESETS_LIVE a false et re-commenter le lien Presets
// dans components/Header.tsx + "/presets" dans app/sitemap.ts.
const PRESETS_LIVE = true;

// Lien du produit Gumroad (overlay de paiement sans quitter le site).
const GUMROAD_URL = 'https://sandrine783.gumroad.com/l/ricoh-presets';

const PRICE_SINGLE = '19 €';
const PRICE_PACK = '79 €';

// Avant/apres montres sur la page (4 des 10 presets).
// 1. Deposer les images dans public/presets/ (export JPG ~1200px de large,
//    noms ci-dessous), 2. passer SHOW_BEFORE_AFTER a true.
const SHOW_BEFORE_AFTER = false;

const PRESET_PAIRS = [
  { name: '01 Signature', before: '/presets/signature-before.jpg', after: '/presets/signature-after.jpg' },
  { name: '02 Golden Hour', before: '/presets/golden-before.jpg', after: '/presets/golden-after.jpg' },
  { name: '07 Terracotta', before: '/presets/terracotta-before.jpg', after: '/presets/terracotta-after.jpg' },
  { name: '10 Street B&W', before: '/presets/bw-before.jpg', after: '/presets/bw-after.jpg' },
];

const PRESETS = SHOW_BEFORE_AFTER ? PRESET_PAIRS : [];

interface Props {
  params: Promise<{ lang: 'fr' | 'en' }>;
}

const content = {
  fr: {
    eyebrow: 'The Girl With A Camera',
    title: 'Ricoh Signature Presets',
    subtitle:
      'Mon look cinématique et filmique en 10 presets Lightroom. Compatibles desktop, Classic et mobile.',
    cta: `Obtenir les presets — dès ${PRICE_SINGLE}`,
    ctaNote: `${PRICE_SINGLE} le preset · pack complet des 10 à ${PRICE_PACK} · guide inclus`,
    beforeAfter: 'Avant / Après',
    before: 'Avant',
    after: 'Après',
    includedTitle: 'Ce que vous recevez',
    includedText:
      `Chaque preset (${PRICE_SINGLE}) : fichier .xmp pour Lightroom desktop et Classic · compatible Lightroom mobile via la synchronisation Adobe · guide d’installation · licence usage personnel & commercial. Ou le pack complet des 10 (Signature, Golden Hour, Blue Hour, Warm Film, Cool Film, Faded Matte, Terracotta, Moody Muted, Vivid Film, Street B&W) pour ${PRICE_PACK} au lieu de 190 €.`,
    faq: [
      {
        q: 'Pour quel Lightroom ?',
        a: 'Lightroom desktop, Lightroom Classic et Lightroom mobile (gratuit). Les presets se synchronisent automatiquement entre desktop et mobile avec un compte Adobe.',
      },
      {
        q: 'RAW ou JPEG ?',
        a: 'Les deux. Les meilleurs résultats sont sur fichiers RAW, mais les presets fonctionnent aussi très bien sur JPEG.',
      },
      {
        q: 'Uniquement pour Ricoh ?',
        a: 'Non — le look est né avec mon Ricoh, mais les presets fonctionnent avec les photos de n’importe quel appareil ou smartphone.',
      },
    ],
  },
  en: {
    eyebrow: 'The Girl With A Camera',
    title: 'Ricoh Signature Presets',
    subtitle:
      'My cinematic, film-inspired look in 10 Lightroom presets. Works on desktop, Classic and mobile.',
    cta: `Get the presets — from ${PRICE_SINGLE}`,
    ctaNote: `${PRICE_SINGLE} per preset · full pack of 10 for ${PRICE_PACK} · guide included`,
    beforeAfter: 'Before / After',
    before: 'Before',
    after: 'After',
    includedTitle: 'What you get',
    includedText:
      `Each preset (${PRICE_SINGLE}): .xmp file for Lightroom desktop and Classic · works with Lightroom mobile via Adobe sync · installation guide · personal & commercial use licence. Or the full pack of 10 (Signature, Golden Hour, Blue Hour, Warm Film, Cool Film, Faded Matte, Terracotta, Moody Muted, Vivid Film, Street B&W) for ${PRICE_PACK} instead of €190.`,
    faq: [
      {
        q: 'Which Lightroom?',
        a: 'Lightroom desktop, Lightroom Classic and Lightroom mobile (free). Presets sync automatically between desktop and mobile with an Adobe account.',
      },
      {
        q: 'RAW or JPEG?',
        a: 'Both. Best results on RAW files, but the presets work great on JPEG too.',
      },
      {
        q: 'Ricoh only?',
        a: 'No — the look was born on my Ricoh, but the presets work on photos from any camera or smartphone.',
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    fr: {
      title: 'Presets',
      description:
        'Ricoh Signature Presets — le look cinématique de Sandrine Ceuppens en 10 presets Lightroom. Desktop + mobile, guide inclus.',
    },
    en: {
      title: 'Presets',
      description:
        'Ricoh Signature Presets — Sandrine Ceuppens’ cinematic look in 10 Lightroom presets. Desktop + mobile, guide included.',
    },
  };

  const m = metadata[lang];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/presets`, languages: { fr: '/fr/presets', en: '/en/presets' } },
  };
}

function GumroadButton({ label }: { label: string }) {
  return (
    <a
      className="gumroad-button"
      href={GUMROAD_URL}
      data-gumroad-overlay-checkout="true"
      style={{
        display: 'inline-block',
        padding: '16px 40px',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: '#0a0a0a',
        color: '#ffffff',
        textDecoration: 'none',
      }}
    >
      {label}
    </a>
  );
}

export default async function PresetsPage({ params }: Props) {
  if (!PRESETS_LIVE) notFound();
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: '60px', paddingBottom: '100px', background: '#ffffff' }}>
      {/* Lib Gumroad : ouvre le paiement en overlay sans quitter le site */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />

      <style>{`
        .presets-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 40px;
        }
        .presets-title {
          font-family: var(--font-serif), Georgia, serif;
          font-size: 40px;
          font-weight: 400;
          font-style: italic;
          color: #0a0a0a;
          margin: 16px 0 0;
        }
        .presets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
        .presets-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .presets-pair img {
          width: 100%;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          display: block;
          background: #f0f0f0;
        }
        .presets-pair-label {
          position: absolute;
          bottom: 8px;
          left: 8px;
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(10, 10, 10, 0.55);
          padding: 4px 8px;
        }
        @media (max-width: 767px) {
          .presets-container { padding: 0 20px; }
          .presets-title { font-size: 28px; }
          .presets-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>

      <div className="presets-container">
        {/* Hero */}
        <section style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#b0b0b0', margin: 0 }}>
            {t.eyebrow}
          </p>
          <h1 className="presets-title">{t.title}</h1>
          <p style={{
            fontSize: '13px', lineHeight: 1.8, letterSpacing: '0.04em', color: '#666666',
            maxWidth: '520px', margin: '16px auto 32px',
          }}>
            {t.subtitle}
          </p>
          <GumroadButton label={t.cta} />
          <p style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#b0b0b0', marginTop: '14px' }}>
            {t.ctaNote}
          </p>
        </section>

        {/* Avant / Apres — masque tant que les images ne sont pas dans public/presets/ */}
        {PRESETS.length > 0 && (
        <section style={{ marginTop: '90px' }}>
          <p style={{
            fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#b0b0b0', textAlign: 'center', marginBottom: '32px',
          }}>
            {t.beforeAfter}
          </p>
          <div className="presets-grid">
            {PRESETS.map((p) => (
              <figure key={p.name} style={{ margin: 0 }}>
                <div className="presets-pair">
                  <div style={{ position: 'relative' }}>
                    <img src={p.before} alt={`${p.name} — ${t.before}`} loading="lazy" />
                    <span className="presets-pair-label">{t.before}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <img src={p.after} alt={`${p.name} — ${t.after}`} loading="lazy" />
                    <span className="presets-pair-label">{t.after}</span>
                  </div>
                </div>
                <figcaption style={{
                  marginTop: '10px', textAlign: 'center', fontSize: '10px',
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8c8880',
                }}>
                  {p.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        )}

        {/* Ce que vous recevez */}
        <section style={{ marginTop: '90px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif), Georgia, serif', fontSize: '26px',
            fontWeight: 400, fontStyle: 'italic', color: '#0a0a0a', margin: 0,
          }}>
            {t.includedTitle}
          </h2>
          <p style={{
            fontSize: '13px', lineHeight: 2, letterSpacing: '0.04em', color: '#666666',
            maxWidth: '620px', margin: '20px auto 36px',
          }}>
            {t.includedText}
          </p>
          <GumroadButton label={t.cta} />
        </section>

        {/* FAQ */}
        <section style={{ marginTop: '90px', maxWidth: '620px', marginLeft: 'auto', marginRight: 'auto' }}>
          {t.faq.map((item) => (
            <div key={item.q} style={{ borderTop: '1px solid #f0f0f0', padding: '24px 0' }}>
              <p style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0a0a0a', margin: '0 0 10px',
              }}>
                {item.q}
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#666666', margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Ricoh Signature Presets — 10 Lightroom Presets',
        description: content[lang].subtitle,
        brand: { '@type': 'Brand', name: 'The Girl With A Camera' },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '19.00',
          highPrice: '79.00',
          offerCount: 11,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `https://thegirlwithacamera.com/${lang}/presets`,
        },
      }) }} />
    </main>
  );
}
