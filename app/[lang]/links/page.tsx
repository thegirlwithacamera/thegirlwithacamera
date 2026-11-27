import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { siInstagram, siPinterest, siThreads, siTiktok, siYoutube } from "simple-icons";
import ProductBox from "../store/ProductBox";
import TrackedLink from "./TrackedLink";
import EmailForm from "./EmailForm";
import s from "./links.module.css";

// Page "lien en bio" : celle qu'on met dans la bio Instagram et TikTok.
// Pensee pour le telephone d'abord. Chaque lien passe par TrackedLink, qui
// compte le clic (voir workers/links) avant de laisser partir le visiteur.

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

const LINKS = [
  { id: "collabs", label: "Work with me", note: "Brands, hotels, destinations", href: "/en/about#contact" },
  { id: "shop", label: "Shop", note: "Presets and guides", href: "/en/store" },
  { id: "journal", label: "Journal", note: "Stories from the road", href: "/en/journal" },
] as const;

const PRODUCTS = [
  {
    id: "product-street",
    name: "Street",
    meta: "The signature preset · 9 €",
    cta: "Get Street",
    href: "/en/store/street",
    alt: "Street, the signature Lightroom preset",
    box: { front: "/store/street-box-front.jpg", spine: "/store/street-box-spine.jpg", color: "#b02c1e", edge: "#b02c1e", depth: 0.15, delay: 0 },
  },
  {
    id: "product-shy",
    name: "Shy With A Camera",
    meta: "The shy street guide · 12 €",
    cta: "Get the guide",
    href: "/en/store/shy",
    alt: "Shy With A Camera, the street photography guide for shy people",
    box: { front: "/store/shy-box-front.jpg", spine: "/store/shy-box-spine.jpg", color: "#1c3a2c", edge: "#efe7d8", depth: 0.07, delay: -3.5 },
  },
] as const;

// Reseaux : icones seules (jeu d'icones simple-icons), le nom reste lu par
// les lecteurs d'ecran.
const SOCIAL = [
  { id: "instagram", label: "Instagram", href: site.social.instagram, icon: siInstagram.path },
  { id: "tiktok", label: "TikTok", href: site.social.tiktok, icon: siTiktok.path },
  { id: "youtube", label: "YouTube", href: site.social.youtube, icon: siYoutube.path },
  { id: "threads", label: "Threads", href: site.social.threads, icon: siThreads.path },
  { id: "pinterest", label: "Pinterest", href: site.social.pinterest, icon: siPinterest.path },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return pageMeta({
    lang,
    path: "/links",
    title: "Links",
    description: "Sandrine Ceuppens, The Girl With A Camera: shop, presets, journal and contact for collaborations.",
    image: "/store/street.jpg",
  });
}

export default async function LinksPage({ params }: Props) {
  const { lang } = await params;

  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.eyebrow}>The Girl With A Camera</p>
        <h1 className={s.name}>Sandrine Ceuppens</h1>
        <p className={s.role}>Travel photographer &amp; filmmaker</p>
        <div className={s.foot}>
          {SOCIAL.map((l) => (
            <TrackedLink key={l.id} id={l.id} href={l.href} className={s.footLink} external label={l.label}>
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                <path d={l.icon} fill="currentColor" />
              </svg>
            </TrackedLink>
          ))}
        </div>
      </header>

      <nav className={s.links} aria-label="Links">
        {LINKS.map((l) => (
          <TrackedLink key={l.id} id={l.id} href={l.href} className={s.link}>
            <span className={s.linkLabel}>{l.label}</span>
            <span className={s.linkNote}>{l.note}</span>
            <span className={s.arrow} aria-hidden>→</span>
          </TrackedLink>
        ))}
      </nav>

      <section className={s.products} aria-label="Shop">
        <p className={s.sectionTitle}>From the shop</p>
        <div className={s.grid}>
          {PRODUCTS.map((p) => (
            <article key={p.id} className={s.product}>
              <TrackedLink id={`${p.id}-image`} href={p.href} className={s.productVisual}>
                <ProductBox
                  front={p.box.front}
                  spine={p.box.spine}
                  alt={p.alt}
                  color={p.box.color}
                  edge={p.box.edge}
                  depth={p.box.depth}
                  delay={p.box.delay}
                />
              </TrackedLink>
              <h2 className={s.productName}>{p.name}</h2>
              <p className={s.productMeta}>{p.meta}</p>
              <TrackedLink id={p.id} href={p.href} className={s.button}>
                {p.cta}
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>

      <section className={s.email} aria-label="Shop news by email">
        <p className={s.sectionTitle}>Be the first to know</p>
        <p className={s.emailSub}>One email when a new preset or guide comes out. Nothing else.</p>
        <EmailForm lang={lang} />
      </section>

    </main>
  );
}
