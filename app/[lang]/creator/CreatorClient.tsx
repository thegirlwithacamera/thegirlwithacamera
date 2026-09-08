"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import { withMeta } from "./meta";
import { brandsIn } from "@/lib/brands";
import { Carousel, FocusOverlay, useVideoSound } from "../components/VideoShowcase";
import { Eyebrow, Lede, PageHead } from "../components/editorial";
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
    lede: "Vidéo verticale pour les marques d'appareils, d'accessoires et de lieux, sur mes canaux ou sur les vôtres.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Ils travaillent déjà avec moi",
    framing: "Ces formats se produisent aussi pour les marques, avec ou sans publication sur mes propres canaux.",
    deliverables: "Vidéo verticale · Photos éditées · Concept, tournage et montage · Droits d'usage chiffrés séparément",
  },
  en: {
    eyebrow: "Creator",
    title: "Content made for *the feed*, shot like a story.",
    lede: "Vertical video for camera, accessory and hospitality brands, on my channels or yours.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Already working with",
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

  const brands = brandsIn("brand");

  return (
    <main className={s.main}>
      <PageHead eyebrow={t.eyebrow} title={t.title} lede={t.lede} split />

      <CreatorNav
        lang={lang}
        active={section}
        labels={{ gear: t.gear, lifestyle: t.lifestyle, unboxing: t.unboxing, talk: t.talk }}
      />

      {/* La section active : les téléphones, en rangée sur ordinateur et en
          pile sur mobile. Les vidéos restent dans des téléphones. */}
      <section className={s.tier} aria-label={t[section]}>
        <Carousel clips={clips} kind="phone" prefix={section} sound={sound} />
      </section>

      <div className={s.pitch}>
        <Lede className={s.lede} tone="stone" align="left">{t.framing}</Lede>
        <p className={s.deliverables}>{t.deliverables}</p>
      </div>

      <section className={s.brands}>
        <Eyebrow tone="brick" className={s.brandsLabel}>{t.selected}</Eyebrow>
        <ul className={s.names}>
          {brands.map((b) => (
            <li key={b.name}>
              {b.href ? <Link href={`/${lang}${b.href}`}>{b.name}</Link> : b.name}
            </li>
          ))}
        </ul>
      </section>

      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
