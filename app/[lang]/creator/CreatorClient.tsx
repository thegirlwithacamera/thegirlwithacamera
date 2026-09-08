"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import { withMeta } from "./meta";
import TrustLogos from "../components/TrustLogos";
import { Carousel, FocusOverlay, useVideoSound } from "../components/VideoShowcase";
import { Display, Eyebrow, Lede, PageHead, Section as Block } from "../components/editorial";
import s from "./CreatorClient.module.css";

export type { Clip, Section };

type Data = {
  gear: Clip[];
  lifestyle: Clip[];
  unboxing: Clip[];
  talk: Clip[];
};

const content = {
  fr: {
    eyebrow: "Creator",
    title: "Du contenu pensé pour *le feed*, tourné comme une histoire.",
    lede: "Des formats verticaux pour Instagram, TikTok et les Reels, produits pour des marques d'appareils, d'accessoires et de lieux. Tournés, montés et publiés, ou livrés pour vos propres canaux.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Campagnes et collaborations",
    framing: "Ces formats se produisent aussi pour les marques, avec ou sans publication sur mes propres canaux.",
    deliverables: "Vidéo verticale · Photos éditées · Concept, tournage et montage · Droits d'usage chiffrés séparément",
  },
  en: {
    eyebrow: "Creator",
    title: "Content made for *the feed*, shot like a story.",
    lede: "Vertical formats for Instagram, TikTok and Reels, produced for camera, accessory and hospitality brands. Shot, edited and posted, or delivered for your own channels.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Campaigns and collaborations",
    framing: "These formats are also produced for brands, with or without posting on my own channels.",
    deliverables: "Vertical video · Edited stills · Concept, shooting and editing · Usage rights quoted separately",
  },
};

function CreatorNav({ lang, active, labels }: { lang: "fr" | "en"; active: Section; labels: Record<Section, string> }) {
  const base = `/${lang}/creator`;
  return (
    <nav className={s.nav} aria-label="Creator sections">
      {SECTIONS.map((sec) => (
        <Link key={sec} href={`${base}/${sec}`} className={`${s.navLink} ${active === sec ? s.navActive : ""}`}>
          {labels[sec]}
        </Link>
      ))}
    </nav>
  );
}

export default function CreatorClient({
  lang,
  data,
  section = "gear",
}: {
  lang: "fr" | "en";
  data: Data;
  section?: Section;
}) {
  const t = content[lang];
  const { sound, focused, closeFocus } = useVideoSound();
  const clips = data[section].map((c) => withMeta(c, section, lang));

  return (
    <main className={s.main}>
      <PageHead eyebrow={t.eyebrow} title={t.title} lede={t.lede} />

      <CreatorNav
        lang={lang}
        active={section}
        labels={{ gear: t.gear, lifestyle: t.lifestyle, unboxing: t.unboxing, talk: t.talk }}
      />

      {/* La section active : les téléphones, en carrousel sur ordinateur et
          en pile sur mobile. Les vidéos restent dans des téléphones. */}
      <section className={s.tier}>
        <div className={s.tierHead}>
          <Display size="m" as="h2" italic>{t[section]}</Display>
        </div>
        <Carousel clips={clips} kind="phone" prefix={section} sound={sound} />
      </section>

      <div className={s.pitch}>
        <Lede className={s.lede} tone="stone">{t.framing}</Lede>
        <p className={s.deliverables}>{t.deliverables}</p>
      </div>

      <Block className={s.brands}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Eyebrow>{t.selected}</Eyebrow>
        </div>
        <TrustLogos lang={lang} cats={["brand"]} hideLabel />
      </Block>

      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
