"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TrustLogos from "../components/TrustLogos";
import { Carousel, FocusOverlay, useVideoSound } from "../components/VideoShowcase";
import { Eyebrow, Lede, PageHead } from "../components/editorial";
import type { Mode, SocialClip } from "./constants";
import s from "./Social.module.css";

// Page Social (30/10) : les verticales, avec un interrupteur entre les deux
// métiers. Influence, publié sur les comptes de Sandrine ; UGC, tourné pour
// la marque et livré pour ses comptes. Au changement de mode, les téléphones
// repartent l'un après l'autre.

const content = {
  fr: {
    title: "Du contenu pensé pour *le feed*, tourné comme une histoire.",
    lede: "Le même regard, deux façons de s'en servir.",
    other: "Brand films",
    modes: { influence: "Sur mes comptes", ugc: "Pour vos comptes" },
    line: {
      influence: "Publié sur mes comptes, avec ma voix, auprès d'une audience qui suit la photo et le voyage.",
      ugc: "Tourné pour votre marque et livré : le montage, les rushes, prêts pour votre feed ou vos publicités.",
    },
    deliverables: {
      influence: "Vidéo verticale · Publication sur mes comptes · Repost sur les vôtres",
      ugc: "Vidéo verticale · Montage et rushes · Droits publicitaires chiffrés séparément",
    },
    selected: "Ils travaillent déjà avec moi",
  },
  en: {
    title: "Content made for *the feed*, shot like a story.",
    lede: "The same eye, two ways to use it.",
    other: "Brand films",
    modes: { influence: "On my channels", ugc: "For your channels" },
    line: {
      influence: "Posted on my channels, in my voice, to an audience that follows photography and travel.",
      ugc: "Shot for your brand and handed over: the edit and the raw clips, ready for your feed or your ads.",
    },
    deliverables: {
      influence: "Vertical video · Posted on my channels · Repost on yours",
      ugc: "Vertical video · Edit and raw clips · Paid-ad usage quoted separately",
    },
    selected: "Already working with",
  },
};

const MODES: Mode[] = ["influence", "ugc"];

export default function SocialClient({ lang, clips }: { lang: "fr" | "en"; clips: SocialClip[] }) {
  const t = content[lang];
  const [mode, setMode] = useState<Mode>("influence");
  const { sound, focused, closeFocus } = useVideoSound();
  const shown = clips.filter((c) => c.mode === mode);

  // Un lien partagé peut ouvrir directement l'UGC : /creator/social#ugc.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "ugc" || h === "influence") setMode(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // La pastille noire glisse sous le bouton actif.
  const btns = useRef<Record<Mode, HTMLButtonElement | null>>({ influence: null, ugc: null });
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const place = () => {
      const b = btns.current[mode];
      if (b) setPill({ x: b.offsetLeft, w: b.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [mode]);

  const choose = (m: Mode) => {
    setMode(m);
    history.replaceState(null, "", `#${m}`);
  };

  return (
    <main className={s.main}>
      <div className={s.wrap}>
        <nav className={s.switch} aria-label="Brands">
          <Link href={`/${lang}/creator/films`} className={s.prev}>← {t.other}</Link>
          <Link href={`/${lang}/creator`}>Brands</Link>
        </nav>
        <PageHead eyebrow="Social" title={t.title} lede={t.lede} />

        <div className={s.toggle} role="group" aria-label={lang === "fr" ? "Diffusion" : "Where it runs"}>
          {pill && <span className={s.pill} style={{ width: pill.w, transform: `translateX(${pill.x}px)` }} aria-hidden="true" />}
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              ref={(el) => { btns.current[m] = el; }}
              aria-pressed={mode === m}
              className={mode === m ? s.on : undefined}
              onClick={() => choose(m)}
            >
              {t.modes[m]}
            </button>
          ))}
        </div>
        <Lede key={`line-${mode}`} className={s.line} tone="stone" align="center">{t.line[mode]}</Lede>
      </div>

      {/* La clé relance l'entrée des téléphones à chaque changement de mode. */}
      <section key={mode} className={s.rail} aria-label={t.modes[mode]}>
        <Carousel clips={shown} kind="phone" prefix={mode} sound={sound} />
      </section>

      <div className={s.wrap}>
        <p key={`del-${mode}`} className={s.deliverables}>{t.deliverables[mode]}</p>
        <section className={s.brands}>
          <Eyebrow className={s.brandsLabel}>{t.selected}</Eyebrow>
          <TrustLogos lang={lang} cats={["brand"]} hideLabel noLinks marquee />
        </section>
      </div>

      {focused && <FocusOverlay clip={focused.clip} kind={focused.kind} onClose={closeFocus} />}
    </main>
  );
}
