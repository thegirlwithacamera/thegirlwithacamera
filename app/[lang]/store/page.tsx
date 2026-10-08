import type { Metadata } from "next";
import Script from "next/script";
import { Eyebrow, Display, PageHead, Section } from "../components/editorial";
import { pageMeta } from "@/lib/seo";
import BeforeAfter from "./BeforeAfter";
import s from "./presets.module.css";

// Pack 101 — 4 presets Lightroom construits sur la recette boîtier de
// Sandrine. Paiement en overlay Gumroad (le visiteur reste sur le site,
// Gumroad reste vendeur officiel : TVA, factures, livraison du fichier).
//
// Page Store : pour l'instant un seul produit (Pack 101), concue pour
// accueillir les suivants.

// À mettre à jour si le username Gumroad change (ex. thegirlwithacamera).
const GUMROAD_URL = "https://thegirlwithacamera.gumroad.com/l/pack-101";
const PRICE = "39 €";

const PRESETS = [
  { key: "street", name: "Street", usage: { fr: "La rue, le quotidien", en: "Street & everyday" } },
  { key: "travel", name: "Travel", usage: { fr: "Voyage & lumière dorée", en: "Travel & golden light" } },
  { key: "market", name: "Market", usage: { fr: "Couleurs fortes", en: "Bold color" } },
  { key: "neon", name: "Neon", usage: { fr: "La nuit urbaine", en: "Urban night" } },
] as const;

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  fr: {
    eyebrow: "The Girl With A Camera",
    title: "Pack *101*",
    lede:
      "Mon rendu, enfin en presets. Quatre looks construits sur ma vraie recette boîtier, un preset par situation, pour Lightroom desktop et mobile.",
    meta: ["4 presets Lightroom", "Desktop & mobile", PRICE],
    buy: `Acheter le pack · ${PRICE}`,
    buyNote: "Téléchargement immédiat · guide d’installation FR/EN · licence commerciale incluse",
    hint: "Glisse la ligne sur chaque photo : à gauche le preset, à droite la photo brute.",
    before: "Avant",
    outro: "Une question avant d’acheter ?",
    outroCta: "Écris-moi",
  },
  en: {
    eyebrow: "The Girl With A Camera",
    title: "Pack *101*",
    lede:
      "My look, finally as presets. Four looks built on my actual in-camera recipe, one preset per situation, for Lightroom desktop & mobile.",
    meta: ["4 Lightroom presets", "Desktop & mobile", PRICE],
    buy: `Buy the pack · ${PRICE}`,
    buyNote: "Instant download · install guide EN/FR · commercial license included",
    hint: "Drag the line on each photo: preset on the left, straight-out-of-camera on the right.",
    before: "Before",
    outro: "A question before buying?",
    outroCta: "Write me",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const base = pageMeta({
    lang,
    path: "/store",
    title: "Pack 101",
    description:
      lang === "fr"
        ? "Pack 101 : le rendu de Sandrine Ceuppens en 4 presets Lightroom (Street, Travel, Market, Neon). Desktop et mobile, guide inclus."
        : "Pack 101: Sandrine Ceuppens' look in 4 Lightroom presets (Street, Travel, Market, Neon). Desktop & mobile, guide included.",
    image: "/presets101/neon-after.jpg",
  });
  return base;
}

function BuyButton({ label }: { label: string }) {
  return (
    <a
      className={`gumroad-button ${s.buy}`}
      href={GUMROAD_URL}
      data-gumroad-overlay-checkout="true"
    >
      {label}
    </a>
  );
}

export default async function PresetsPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main>
      {/* Overlay de paiement Gumroad, chargé après l'hydratation */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />

      <div className={s.container}>
        <PageHead
          eyebrow={t.eyebrow}
          title={t.title}
          meta={[...t.meta]}
          lede={t.lede}
        >
          <div>
            <BuyButton label={t.buy} />
            <p className={s.buyNote}>{t.buyNote}</p>
          </div>
        </PageHead>

        <p className={s.hint}>{t.hint}</p>

        <div className={s.presetList}>
          {PRESETS.map((p) => (
            <Section key={p.key}>
              <div className={s.presetHead}>
                <Display size="m" as="h2">{p.name}</Display>
                <span className={s.presetUsage}>{p.usage[lang]}</span>
              </div>
              <BeforeAfter
                before={`/presets101/${p.key}-before.jpg`}
                after={`/presets101/${p.key}-after.jpg`}
                name={p.name}
                beforeLabel={t.before}
              />
            </Section>
          ))}
        </div>

        <div className={s.outro}>
          <BuyButton label={t.buy} />
          <Display size="m" as="p" italic>
            {t.outro}
          </Display>
          <Eyebrow>
            <a href={`/${lang}/contact`} style={{ color: "inherit" }}>{t.outroCta}</a>
          </Eyebrow>
        </div>
      </div>
    </main>
  );
}
