import type { Metadata } from "next";
import Script from "next/script";
import { Display, PageHead } from "../../components/editorial";
import { pageMeta } from "@/lib/seo";
import BeforeAfter from "../pack-101/BeforeAfter";
import s from "../pack-101/presets.module.css";

// Street vendu seul : la porte d'entree a 15 euros vers le Pack 101.
const GUMROAD_URL = "https://shop.thegirlwithacamera.com/l/street";
const PRICE = "15 \u20ac";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  fr: {
    eyebrow: "The Girl With A Camera",
    title: "Street",
    lede: "Mon preset signature, celui de tous les jours. Construit sur ma recette bo\u00eetier, pour Lightroom desktop et mobile.",
    meta: ["1 preset Lightroom", "Desktop & mobile", PRICE],
    buy: `Acheter Street \u00b7 ${PRICE}`,
    buyNote: "T\u00e9l\u00e9chargement imm\u00e9diat \u00b7 guide PDF \u00b7 usage personnel",
    hint: "Glisse la ligne : \u00e0 gauche la photo brute, \u00e0 droite Street.",
    before: "Avant",
    packTitle: "Envie du look complet ?",
    packText: "Pack 101 ajoute Travel, Market et Neon, un preset par situation, m\u00eame ADN.",
    packCta: "D\u00e9couvrir le Pack 101 \u00b7 39 \u20ac",
  },
  en: {
    eyebrow: "The Girl With A Camera",
    title: "Street",
    lede: "My signature preset, the one I shoot every day. Built on my in-camera recipe, for Lightroom desktop & mobile.",
    meta: ["1 Lightroom preset", "Desktop & mobile", PRICE],
    buy: `Buy Street \u00b7 ${PRICE}`,
    buyNote: "Instant download \u00b7 PDF guide \u00b7 personal use license",
    hint: "Drag the line: raw on the left, Street on the right.",
    before: "Before",
    packTitle: "Want the full look?",
    packText: "Pack 101 adds Travel, Market and Neon: one preset per situation, same DNA.",
    packCta: "See Pack 101 \u00b7 39 \u20ac",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/store/street",
    title: "Street",
    description:
      lang === "fr"
        ? "Street : le preset signature de Sandrine Ceuppens pour Lightroom, desktop et mobile. Guide inclus."
        : "Street: Sandrine Ceuppens' signature Lightroom preset, desktop & mobile. Guide included.",
    image: "/presets101/street-after.jpg",
  });
}

export default async function StreetPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main>
      <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />
      <div className={s.container}>
        <PageHead eyebrow={t.eyebrow} title={t.title} meta={[...t.meta]} lede={t.lede}>
          <div>
            <a className={`gumroad-button ${s.buy}`} href={GUMROAD_URL} data-gumroad-overlay-checkout="true">
              {t.buy}
            </a>
            <p className={s.buyNote}>{t.buyNote}</p>
          </div>
        </PageHead>
        <p className={s.hint}>{t.hint}</p>
        <div className={s.singleSlider}>
          <BeforeAfter
            before="/presets101/street-before.jpg"
            after="/presets101/street-after.jpg"
            name="Street"
            beforeLabel={t.before}
          />
        </div>
        <div className={s.outro}>
          <Display size="m" as="p" italic>{t.packTitle}</Display>
          <p className={s.buyNote}>{t.packText}</p>
          <a className={s.buy} href={`/${lang}/store/pack-101`} style={{ textDecoration: "none" }}>
            {t.packCta}
          </a>
        </div>
      </div>
    </main>
  );
}
