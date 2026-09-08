"use client";

import Link from "next/link";
import { SECTIONS, type Clip, type Section } from "./constants";
import { withMeta } from "./meta";
import { useEffect } from "react";
import TrustLogos from "../components/TrustLogos";
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
    lede: "Vidéo verticale pour les marques d'appareils et d'accessoires, et pour les maisons qui reçoivent. Sur mes canaux ou sur les vôtres.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Ils travaillent déjà avec moi",
    framing: "Ces formats se tournent aussi pour les marques, avec ou sans publication sur mes canaux.",
    deliverables: "Vidéo verticale · Photos éditées · Concept, tournage et montage · Droits d'usage chiffrés séparément",
  },
  en: {
    eyebrow: "Creator",
    title: "Content made for *the feed*, shot like a story.",
    lede: "Vertical video for camera and accessory brands, and for houses that welcome people. On my channels or yours.",
    gear: "Gear",
    lifestyle: "Lifestyle",
    unboxing: "Unboxing",
    talk: "Talk",
    selected: "Already working with",
    framing: "These formats are also shot for brands, with or without posting on my channels.",
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
  // Le type de contenu n'est pas répété sous chaque téléphone : la catégorie
  // active le dit déjà (décision du 08/09).
  const clips = data[section].map((c) => ({ ...withMeta(c, section, lang), kind: undefined }));

  // Un logo de marque mène ici avec une ancre, #ricoh par exemple : on ouvre
  // directement la première vidéo de cette marque dans la section.
  useEffect(() => {
    let timer = 0;
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, "")).toLowerCase().replace(/\s+/g, "");
      if (!hash) return;
      const idx = clips.findIndex((c) => (c.brand ?? "").toLowerCase().replace(/\s+/g, "") === hash);
      if (idx < 0) return;
      const el = document.querySelector<HTMLElement>(`[data-clip="${section}-${idx}"]`);
      el?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      timer = window.setTimeout(() => sound.openFocus(clips[idx], "phone"), 350);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => { window.clearTimeout(timer); window.removeEventListener("hashchange", openFromHash); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

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
        <TrustLogos lang={lang} cats={["brand"]} hideLabel align="left" />
      </section>

      {focused && (
        <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />
      )}
    </main>
  );
}
