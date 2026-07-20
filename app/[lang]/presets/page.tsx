import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import PresetCarousel from './PresetCarousel';

// Pour retirer la page (produit Gumroad depublie, etc.) :
// passer PRESETS_LIVE a false et re-commenter le lien Presets
// dans components/Header.tsx + "/presets" dans app/sitemap.ts.
const PRESETS_LIVE = true;

// Lien du produit Gumroad (overlay de paiement sans quitter le site).
const GUMROAD_URL = 'https://sandrine783.gumroad.com/l/ricoh-presets';

const PRICE_SINGLE = '19 €';
const PRICE_FAMILY = '49 €';
const PRICE_PACK = '99 €';

// Avant/apres : pour chaque scene (nuit / jour), le Raw reste fixe et un
// carrousel fait defiler les 15 rendus. Images dans public/presets/
// (sources : Desktop/day et Desktop/night, memes scenes avec chaque preset).
const ALL_PRESETS = [
  ['Froid', 'Bluehour'], ['Froid', 'Coldpress'], ['Froid', 'Frostfilm'], ['Froid', 'Nightfall'], ['Froid', 'Seafoam'],
  ['Douce', 'Haze'], ['Douce', 'Linen'], ['Douce', 'Mist'], ['Douce', 'Petal'], ['Douce', 'Whisper'],
  ['Chaude', 'Redwood'], ['Chaude', 'Retroglow'], ['Chaude', 'RoseFilm'], ['Chaude', 'Slidepop'], ['Chaude', 'Sunfaded'],
] as const;

const slidesFor = (scene: 'day' | 'night', startFamily: string) => {
  const ordered = [...ALL_PRESETS.filter(([f]) => f === startFamily), ...ALL_PRESETS.filter(([f]) => f !== startFamily)];
  return ordered.map(([fam, name]) => ({
    name: `${fam} — ${name}`,
    src: `/presets/${scene}-${name.toLowerCase()}.jpg`,
  }));
};

// La nuit s'ouvre sur la famille Froid, le jour sur la famille Douce.
const SCENES = [
  { key: 'night', raw: '/presets/night-raw.jpg', slides: slidesFor('night', 'Froid') },
  { key: 'day', raw: '/presets/day-raw.jpg', slides: slidesFor('day', 'Douce') },
] as const;

interface Props {
  params: Promise<{ lang: 'fr' | 'en' }>;
}

const content = {
  fr: {
    eyebrow: 'The Girl With A Camera',
    title: 'Ricoh Signature Presets',
    subtitle:
      'Mon look cinématique et filmique en 15 presets Lightroom, en 3 familles : Froid, Douce et Chaude. Desktop, Classic et mobile.',
    ctaPack: `Pack complet — les 15 presets · ${PRICE_PACK}`,
    ctaSingle: `Ou choisir un preset (${PRICE_SINGLE}) ou une famille (${PRICE_FAMILY})`,
    ctaNote: `Guide d’installation et licence commerciale inclus · ${PRICE_SINGLE} le preset · ${PRICE_FAMILY} la famille de 5 · ${PRICE_PACK} les 15`,
    beforeAfter: 'Avant / Après',
    before: 'Avant',
    after: 'Après',
    scenes: { night: 'De nuit — les 15 presets sur la même photo', day: 'De jour — les 15 presets sur la même photo' },
    prev: 'Preset précédent',
    next: 'Preset suivant',
    includedTitle: 'Ce que vous recevez',
    includedText:
      `Trois familles de 5 presets : Froid (Bluehour, Coldpress, Frostfilm, Nightfall, Seafoam) · Douce (Haze, Linen, Mist, Petal, Whisper) · Chaude (Redwood, Retroglow, RoseFilm, Slidepop, Sunfaded). Chaque preset : fichier .xmp pour Lightroom desktop et Classic, compatible Lightroom mobile via la synchronisation Adobe, guide d’installation, licence usage personnel & commercial. À l’unité (${PRICE_SINGLE}), par famille (${PRICE_FAMILY}) ou les 15 (${PRICE_PACK}).`,
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
      'My cinematic, film-inspired look in 15 Lightroom presets, in 3 families: Cold, Vivid and Vintage Tones. Desktop, Classic and mobile.',
    ctaPack: `Full pack — all 15 presets · ${PRICE_PACK}`,
    ctaSingle: `Or pick a single preset (${PRICE_SINGLE}) or a family (${PRICE_FAMILY})`,
    ctaNote: `Installation guide and commercial licence included · ${PRICE_SINGLE} per preset · ${PRICE_FAMILY} per 5-preset family · ${PRICE_PACK} for all 15`,
    beforeAfter: 'Before / After',
    before: 'Before',
    after: 'After',
    scenes: { night: 'By night — all 15 presets on the same photo', day: 'By day — all 15 presets on the same photo' },
    prev: 'Previous preset',
    next: 'Next preset',
    includedTitle: 'What you get',
    includedText:
      `Three families of 5 presets: Cold Tones (Bluehour, Coldpress, Frostfilm, Nightfall, Seafoam) · Vivid Tones (Haze, Linen, Mist, Petal, Whisper) · Vintage Tones (Redwood, Retroglow, RoseFilm, Slidepop, Sunfaded). Each preset: .xmp file for Lightroom desktop and Classic, works with Lightroom mobile via Adobe sync, installation guide, personal & commercial use licence. Single (${PRICE_SINGLE}), family (${PRICE_FAMILY}) or all 15 (${PRICE_PACK}).`,
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
        'Ricoh Signature Presets — le look cinématique de Sandrine Ceuppens en 15 presets Lightroom. Desktop + mobile, guide inclus.',
    },
    en: {
      title: 'Presets',
      description:
        'Ricoh Signature Presets — Sandrine Ceuppens’ cinematic look in 15 Lightroom presets. Desktop + mobile, guide included.',
    },
  };

  const m = metadata[lang];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/presets`, languages: { fr: '/fr/presets', en: '/en/presets' } },
  };
}

// Nom exact de la version pack sur Gumroad (preselectionnee via ?variant=).
const PACK_VARIANT = 'PACK COMPLET — Les 15 presets';

// Deux CTA :
// - le pack : va directement au paiement avec la bonne version
// - "choisir" : ouvre la fiche Gumroad en overlay avec les 11 options
function BuyButtons({ pack, single }: { pack: string; single: string }) {
  const btn = {
    display: 'inline-block',
    padding: '16px 40px',
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <a
        className="gumroad-button"
        href={`${GUMROAD_URL}?variant=${encodeURIComponent(PACK_VARIANT)}`}
        data-gumroad-overlay-checkout="true"
        style={{ ...btn, background: '#0a0a0a', color: '#ffffff' }}
      >
        {pack}
      </a>
      <a
        className="gumroad-button"
        href={GUMROAD_URL}
        style={{ ...btn, background: '#ffffff', color: '#0a0a0a', border: '1px solid #d8d8d8', padding: '14px 32px' }}
      >
        {single}
      </a>
    </div>
  );
}

export default async function PresetsPage({ params }: Props) {
  if (!PRESETS_LIVE) notFound();
  const { lang } = await params;
  const t = content[lang];

  return (
    <main style={{ paddingTop: '60px', paddingBottom: '24px', background: '#ffffff' }}>
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
          <BuyButtons pack={t.ctaPack} single={t.ctaSingle} />
          <p style={{ fontSize: '10px', letterSpacing: '0.08em', color: '#b0b0b0', marginTop: '14px' }}>
            {t.ctaNote}
          </p>
        </section>

        {/* Avant / Apres : Raw fixe + carrousel des 15 presets, de nuit puis de jour */}
        <section style={{ marginTop: '90px' }}>
          <p style={{
            fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#b0b0b0', textAlign: 'center', marginBottom: '32px',
          }}>
            {t.beforeAfter}
          </p>
          <div style={{ display: 'grid', gap: '48px' }}>
            {SCENES.map((scene) => (
              <figure key={scene.key} style={{ margin: 0 }}>
                <div className="presets-pair">
                  <div style={{ position: 'relative' }}>
                    <img src={scene.raw} alt={t.before} loading="lazy" />
                    <span className="presets-pair-label">{t.before} · RAW</span>
                  </div>
                  <PresetCarousel
                    slides={[...scene.slides]}
                    afterLabel={t.after}
                    prevLabel={t.prev}
                    nextLabel={t.next}
                  />
                </div>
                <figcaption style={{
                  marginTop: '10px', textAlign: 'center', fontSize: '10px',
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8c8880',
                }}>
                  {t.scenes[scene.key]}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

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
          <BuyButtons pack={t.ctaPack} single={t.ctaSingle} />
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
        name: 'Ricoh Signature Presets — 15 Lightroom Presets',
        description: content[lang].subtitle,
        brand: { '@type': 'Brand', name: 'The Girl With A Camera' },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '19.00',
          highPrice: '99.00',
          offerCount: 19,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `https://thegirlwithacamera.com/${lang}/presets`,
        },
      }) }} />
    </main>
  );
}
