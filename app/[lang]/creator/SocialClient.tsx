"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import TrustLogos from "../components/TrustLogos";
import { Carousel, FocusOverlay, useVideoSound } from "../components/VideoShowcase";
import { Eyebrow, Lede, PageHead } from "../components/editorial";
import { CATEGORIES, type Category, type Mode, type SocialClip } from "./constants";
import s from "./Social.module.css";

// Page Social (30/10) : les verticales, avec un interrupteur entre les deux
// métiers. Influence, publié sur les comptes de Sandrine ; UGC, tourné pour
// la marque et livré pour ses comptes. Au changement de mode, les téléphones
// repartent l'un après l'autre. Sous l'interrupteur, une rangée de catégories
// (09/11) qui ne montre que celles présentes dans le mode affiché. Les
// vidéos d'une même marque se rangent en tas (10/11).

const content = {
  fr: {
    title: "Du contenu pensé pour *le feed*, tourné comme une histoire.",
    lede: "Le même regard, deux façons de s'en servir.",
    other: "Brand films",
    modes: { influence: "Sur mes comptes", ugc: "Pour vos comptes" },
    line: {
      influence: "Publié sur mes comptes, avec ma voix, auprès d'une audience qui suit la photo et le voyage.",
      ugc: "Tourné et monté pour votre marque, livré prêt à publier sur votre feed ou dans vos publicités.",
    },
    deliverables: {
      influence: "Vidéo verticale · Publication sur mes comptes · Repost sur les vôtres",
      ugc: "Vidéo verticale · Concept, tournage et montage · Droits publicitaires chiffrés séparément",
    },
    selected: "Ils travaillent déjà avec moi",
    all: "Tout",
    cats: { gear: "Gear", fashion: "Mode", events: "Événements", lifestyle: "Lifestyle" },
  },
  en: {
    title: "Content made for *the feed*, shot like a story.",
    lede: "The same eye, two ways to use it.",
    other: "Brand films",
    modes: { influence: "On my channels", ugc: "For your channels" },
    line: {
      influence: "Posted on my channels, in my voice, to an audience that follows photography and travel.",
      ugc: "Shot and edited for your brand, delivered ready to post on your feed or run in your ads.",
    },
    deliverables: {
      influence: "Vertical video · Posted on my channels · Repost on yours",
      ugc: "Vertical video · Concept, shooting and editing · Paid-ad usage quoted separately",
    },
    selected: "Already working with",
    all: "All",
    cats: { gear: "Gear", fashion: "Fashion", events: "Events", lifestyle: "Lifestyle" },
  },
};

const MODES: Mode[] = ["influence", "ugc"];

export default function SocialClient({ lang, clips }: { lang: "fr" | "en"; clips: SocialClip[] }) {
  const t = content[lang];
  const [mode, setMode] = useState<Mode>("influence");
  const [cat, setCat] = useState<Category | null>(null);
  const { sound, focused, closeFocus } = useVideoSound();
  const inMode = clips.filter((c) => c.mode === mode);
  const cats = CATEGORIES.filter((k) => inMode.some((c) => c.cat === k));
  const active = cat && cats.includes(cat) ? cat : null;
  const shown = active ? inMode.filter((c) => c.cat === active) : inMode;

  // Un lien partagé peut ouvrir directement l'UGC, et même une catégorie :
  // /creator/social#ugc, /creator/social#ugc-fashion.
  useEffect(() => {
    const fromHash = () => {
      const [m, c] = window.location.hash.replace(/^#/, "").split("-");
      if (m === "ugc" || m === "influence") {
        setMode(m);
        setCat((CATEGORIES as readonly string[]).includes(c) ? (c as Category) : null);
      }
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
    setCat(null);
    history.replaceState(null, "", `#${m}`);
  };
  const chooseCat = (c: Category | null) => {
    setCat(c);
    history.replaceState(null, "", c ? `#${mode}-${c}` : `#${mode}`);
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

        {/* Pas de filtre tant qu'un mode n'a qu'une catégorie. */}
        {cats.length > 1 && (
          <div key={`cats-${mode}`} className={s.cats} role="group" aria-label={lang === "fr" ? "Catégories" : "Categories"}>
            {[null, ...cats].map((k) => (
              <button
                key={k ?? "all"}
                type="button"
                aria-pressed={active === k}
                className={active === k ? s.catOn : undefined}
                onClick={() => chooseCat(k)}
              >
                {k ? t.cats[k] : t.all}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* La clé relance l'entrée des téléphones à chaque changement de mode
          ou de catégorie. */}
      <section key={`${mode}-${active ?? "all"}`} className={s.rail} aria-label={t.modes[mode]}>
        <Carousel clips={shown} kind="phone" prefix={mode} sound={sound} stackBy={(c) => c.brand ?? c.label} lang={lang} />
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
