import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { PageHead } from "../components/editorial";
import s from "../journal/journal.module.css";

interface Props {
  params: Promise<{ lang: "en" }>;
}

export function generateStaticParams() {
  return (["en"] as const).map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({
    lang: "en",
    path: "/affiliate-disclosure",
    title: "Affiliate disclosure",
    description:
      "How affiliate links and brand collaborations work on thegirlwithacamera.com.",
  });
}

// Page de transparence (18/09) : les articles renvoient ici par une petite
// ligne en bas, au lieu d'ouvrir sur une mention d'affiliation.
export default async function AffiliateDisclosurePage({ params }: Props) {
  await params;
  return (
    <main className={s.main}>
      <PageHead back={{ href: "/en/journal", label: "Journal" }} title="Affiliate disclosure" />
      <article className={s.body}>
        <section className="section">
          <div className="text">
            <p>
              Some articles on this site contain affiliate links, to Booking.com, Amazon, Insta360
              and other partners. If you book or buy through one of them, I earn a small commission.
              The price you pay is exactly the same.
            </p>
            <p>As an Amazon Associate, I earn from qualifying purchases.</p>
            <p>
              Affiliate links never decide what goes into an article. I only link to places I have
              stayed in, and to gear I actually use. When a stay, a trip or a piece of equipment was
              offered to me by a brand or a tourism board, it is written at the top of the article.
            </p>
            <p>
              Questions about this page? <Link href="/en/contact">Get in touch</Link>.
            </p>
          </div>
        </section>
      </article>
      <p className={s.back}>
        <Link href="/en/journal">← Back to the journal</Link>
      </p>
    </main>
  );
}
