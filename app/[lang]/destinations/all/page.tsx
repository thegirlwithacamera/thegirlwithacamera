import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { readCaseCover } from "@/lib/portfolio";
import { bookChapters, no2 } from "../../photographer/book";
import { Display, Eyebrow } from "../../components/editorial";
import s from "./contents.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/destinations/all",
    title: "Contents",
    description:
      "Every hotel, table and city photographed and filmed by Sandrine Ceuppens, from Austria to Italy and Japan, as the chapters of a book.",
    image: "/images/portfolio/travel/tokyo/1.jpg",
  });
}

// ─────────────────────────────────────────────────────────────
// Le sommaire du livre (28/10, direction "photobook"). Remplace la page
// "All destinations" en carrés du 27/09 : même adresse, même contenu, tous
// les projets avec photos, mais lus comme la table des matières d'un livre
// photo. Une partie par catégorie, un chapitre par projet, numéroté comme
// sur sa page (book.ts). Au survol, la couverture du chapitre apparaît.
// Pour cacher un projet : HIDDEN_CASES dans photographer/constants.ts.
// ─────────────────────────────────────────────────────────────

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export default async function ContentsPage({ params }: Props) {
  await params;
  const chapters = bookChapters();
  const parts = [...new Map(chapters.map((c) => [c.cat.slug, c.cat])).values()].map((cat) => ({
    cat,
    chapters: chapters.filter((c) => c.cat.slug === cat.slug),
  }));

  return (
    <main className={s.main}>
      <header className={s.head}>
        <Eyebrow tone="brick">The Girl With A Camera</Eyebrow>
        <Display size="xl">Contents</Display>
        <p className={s.lede}>
          {chapters.length} chapters, photographed and filmed between first light and the last train.
        </p>
      </header>

      {parts.map((part, pi) => (
        <section key={part.cat.slug} className={s.part}>
          <h2 className={s.partTitle}>
            <span>Part {ROMAN[pi] ?? pi + 1}</span>
            {part.cat.label.en}
          </h2>
          <ol className={s.list}>
            {part.chapters.map((c) => {
              const cover = c.item.coverImage ?? readCaseCover(c.cat.slug, c.item.slug);
              return (
                <li key={c.href}>
                  <Link href={`/en${c.href}`} className={s.row}>
                    {cover && (
                      <span className={s.thumb} aria-hidden="true">
                        <Image src={cover} alt="" width={360} height={450} sizes="(max-width: 767px) 56px, 200px" quality={70} />
                      </span>
                    )}
                    <span className={s.no}>{no2(c.no)}</span>
                    <span className={s.name}>{c.item.label.en}</span>
                    <span className={s.leader} aria-hidden="true" />
                    <span className={s.place}>
                      {c.item.place?.en}
                      {c.item.films && c.item.films.length > 0 && <em> · film</em>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <p className={s.back}><Link href="/en/destinations">← Selected work</Link></p>
    </main>
  );
}
