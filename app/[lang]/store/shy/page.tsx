import type { Metadata } from "next";
import Script from "next/script";
import { Display, PageHead } from "../../components/editorial";
import { pageMeta } from "@/lib/seo";
import s from "../pack-101/presets.module.css";

// Shy With A Camera : le guide street photo pour les timides. Premier
// produit non-preset de la boutique, cross-sell naturel du preset Street.
const GUMROAD_URL = "https://shop.thegirlwithacamera.com/l/shy";
const PRICE = "19 €";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const content = {
  fr: {
    eyebrow: "The Girl With A Camera",
    title: "Shy With *A Camera*",
    lede:
      "Le guide de street photo pour les timides. Comment je photographie des inconnus sans parler à personne, et comment toi aussi.",
    meta: ["Guide PDF · 12 pages", "EN + essentiel FR", PRICE],
    buy: `Acheter le guide · ${PRICE}`,
    buyNote: "Téléchargement immédiat · PDF 12 pages · usage personnel",
    insideTitle: "Dedans",
    inside: [
      "Le mental d'abord : pourquoi personne ne te regarde (vraiment).",
      "Le matériel qui te rend invisible, et les réglages zéro hésitation.",
      "Les techniques pour timides : photographier la scène, laisser la photo venir, les lieux où un appareil est attendu.",
      "Le script exact si quelqu'un te remarque, à répéter une fois chez toi.",
      "Mes limites éthiques, pour une pratique dont tu es fière.",
      "Le plan 30 jours qui commence ridiculement facile, exprès.",
    ],
    outro: "Une question avant d'acheter ?",
    outroCta: "Écris-moi",
  },
  en: {
    eyebrow: "The Girl With A Camera",
    title: "Shy With *A Camera*",
    lede:
      "The street photography guide for shy people. How I photograph strangers without talking to anyone, and how you can too.",
    meta: ["PDF guide · 12 pages", "EN + FR recap", PRICE],
    buy: `Buy the guide · ${PRICE}`,
    buyNote: "Instant download · 12-page PDF · personal use",
    insideTitle: "Inside",
    inside: [
      "Mindset first: why nobody is actually looking at you.",
      "The gear that makes you invisible, and the zero-hesitation settings.",
      "Shy-friendly techniques: shoot the scene, let the photo come to you, the places where cameras are expected.",
      "The exact script for when someone notices, to rehearse once at home.",
      "My ethical lines, for a practice you can be proud of.",
      "The 30-day plan that starts embarrassingly easy, on purpose.",
    ],
    outro: "A question before buying?",
    outroCta: "Write me",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/store/shy",
    title: "Shy With A Camera",
    description:
      lang === "fr"
        ? "Shy With A Camera : le guide de street photo pour les timides, par Sandrine Ceuppens. Techniques, réglages, script et plan 30 jours."
        : "Shy With A Camera: the street photography guide for shy people, by Sandrine Ceuppens. Techniques, settings, scripts and a 30-day plan.",
    image: "/store/shy.jpg",
  });
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

export default async function ShyPage({ params }: Props) {
  const { lang } = await params;
  const t = content[lang];

  return (
    <main>
      <Script src="https://gumroad.com/js/gumroad.js" strategy="afterInteractive" />
      <div className={s.container}>
        <PageHead eyebrow={t.eyebrow} title={t.title} meta={[...t.meta]} lede={t.lede}>
          <div>
            <BuyButton label={t.buy} />
            <p className={s.buyNote}>{t.buyNote}</p>
          </div>
        </PageHead>

        <div className={s.singleSlider}>
          <img
            src="/store/shy.jpg"
            alt="Shy With A Camera, the printed-zine style PDF guide"
            loading="lazy"
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <section style={{ marginTop: "56px" }}>
          <Display size="m" as="h2">{t.insideTitle}</Display>
          <ul className={s.insideList}>
            {t.inside.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className={s.outro}>
          <BuyButton label={t.buy} />
          <Display size="m" as="p" italic>
            {t.outro}
          </Display>
          <p className={s.buyNote}>
            <a href={`/${lang}/contact`} style={{ color: "inherit" }}>{t.outroCta}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
