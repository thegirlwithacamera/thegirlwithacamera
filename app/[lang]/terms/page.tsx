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
    path: "/terms",
    title: "Terms of use",
    description: "The terms for using thegirlwithacamera.com and The Girl with a Camera Planner.",
  });
}

// Conditions d'utilisation (28/11/2026). Hors menu, comme la politique de
// confidentialité : demandée par TikTok et Pinterest pour l'outil de programmation.
export default async function TermsPage({ params }: Props) {
  await params;
  return (
    <main className={s.main}>
      <PageHead title="Terms of use" />
      <article className={s.body}>
        <section className="section">
          <div className="text">
            <p>Last updated: 28 November 2026.</p>
            <p>
              This site is run by Sandrine Ceuppens, a photographer and filmmaker based in Brussels,
              Belgium, working as The Girl With A Camera. By using it, you agree to these terms.
            </p>

            <h2>Photos, films and texts</h2>
            <p>
              All photos, films and texts on this site are my own work, unless stated otherwise. You
              may share links to them. You may not copy, download, edit or reuse them, in whole or
              in part, without my written permission.
            </p>

            <h2>The shop</h2>
            <p>
              Presets, LUTs and guides are digital products for your personal and professional
              work. You may not resell, share or redistribute the files. Purchases are handled by
              Gumroad, under its own terms.
            </p>

            <h2>The Girl with a Camera Planner</h2>
            <p>
              The Girl with a Camera Planner is a private tool I use to schedule and publish my own
              posts on Instagram, Threads, YouTube, Pinterest and TikTok. It is not offered to the
              public and connects only to my own accounts, through each platform&apos;s official API
              and under that platform&apos;s own terms. How it handles data is explained in the{" "}
              <Link href="/en/privacy-policy">privacy policy</Link>.
            </p>

            <h2>Links to other sites</h2>
            <p>
              Some pages link to other sites, including affiliate links. I am not responsible for
              their content or their terms.
            </p>

            <h2>Liability</h2>
            <p>
              I do my best to keep the information on this site accurate and up to date, but I
              cannot guarantee it. Travel details, prices and opening hours change: always check
              them before you go.
            </p>

            <h2>Law</h2>
            <p>These terms are governed by Belgian law.</p>

            <p>
              Questions? Write to{" "}
              <a href="mailto:hello@thegirlwithacamera.com">hello@thegirlwithacamera.com</a>.
            </p>
          </div>
        </section>
      </article>
      <p className={s.back}>
        <Link href="/en">← Back to the home page</Link>
      </p>
    </main>
  );
}
