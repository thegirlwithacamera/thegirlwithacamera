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
    path: "/privacy-policy",
    title: "Privacy policy",
    description:
      "What personal data thegirlwithacamera.com collects, why, and how to ask for it to be changed or deleted.",
  });
}

// Politique de confidentialité (16/11/2026). Volontairement absente du menu :
// elle sert au RGPD et à l'écran de consentement Google (app « TGWAC Studio »,
// accès YouTube). À mettre à jour si le site ajoute un outil qui collecte des
// données (formulaire, statistiques, boutique, vidéos intégrées).
export default async function PrivacyPolicyPage({ params }: Props) {
  await params;
  return (
    <main className={s.main}>
      <PageHead title="Privacy policy" />
      <article className={s.body}>
        <section className="section">
          <div className="text">
            <p>Last updated: 28 November 2026.</p>
            <p>
              This site is run by Sandrine Ceuppens, a photographer and filmmaker based in Brussels,
              Belgium, working as The Girl With A Camera. I am responsible for the personal data
              collected here. You can reach me at{" "}
              <a href="mailto:hello@thegirlwithacamera.com">hello@thegirlwithacamera.com</a>.
            </p>

            <h2>What I collect, and why</h2>
            <h3>The contact form</h3>
            <p>
              When you write to me, I receive your name, your email address and your message, plus
              the optional details you choose to give (company, type of project, budget, deadline).
              I use them only to answer you and, if we work together, to prepare and run the
              project. The form is sent by email through Resend, an email delivery service.
            </p>
            <h3>Shop news by email</h3>
            <p>
              If you leave your email address, I keep it in a mailing list hosted by Resend, to write
              to you when I release something new in the shop, and for nothing else. You can{" "}
              <a href="/en/unsubscribe">unsubscribe</a> at any time, and you can also ask me to remove you.
            </p>
            <h3>Visit statistics</h3>
            <p>
              The site uses Vercel Web Analytics and Speed Insights to count visits and measure page
              speed. They do not use cookies and do not identify you: I only see totals, such as
              how many people read a page and from which country.
            </p>
            <h3>Hosting</h3>
            <p>
              The site is hosted by Vercel. Like any web host, its servers briefly record technical
              information such as your IP address and browser type, to deliver pages and protect
              the site against abuse.
            </p>

            <h2>Cookies</h2>
            <p>
              This site does not set advertising or tracking cookies of its own. Some pages show
              content from other services (Instagram posts and reels, the Gumroad shop, affiliate
              links to partners such as Booking.com or Amazon). When you view or click on them,
              those services may set their own cookies, under their own privacy policies.
            </p>

            <h2>Purchases</h2>
            <p>
              Presets and guides in the store are sold through Gumroad. Gumroad handles the payment
              and your billing details; I only receive what I need to deliver your order, such as
              your email address.
            </p>

            <h2>Tools connected to my own accounts</h2>
            <p>
              I use a private application, TGWAC Studio, to manage my own YouTube channel and
              Instagram account: reading their statistics, comments and video details, and
              updating my own videos. It connects only to accounts that I own, through the official
              Google and Meta APIs, after I have authorised it. It is not offered to anyone else
              and does not collect data from visitors to this site.
            </p>
            <p>
              Data received from Google APIs is used only for that purpose, is stored only on my
              own computer, is never sold or shared, and is not used for advertising. Its use
              complies with the{" "}
              <a href="https://developers.google.com/terms/api-services-user-data-policy">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. You can see how YouTube handles data in the{" "}
              <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
            </p>

            <p>
              I also use a second private tool, The Girl with a Camera Planner, to schedule and
              publish my own posts on Instagram, Threads, YouTube, Pinterest and TikTok, and to read
              basic statistics about them. It connects only to my own accounts, through each
              platform's official API, after I have authorised it. The access keys are stored
              encrypted on Cloudflare, and the photos and videos I upload to it are deleted seven
              days after they are published. It collects nothing from anyone else.
            </p>

            <h2>YouTube API Services</h2>
            <p>
              The Girl with a Camera Planner uses YouTube API Services to upload my own videos to my
              own YouTube channel. By using it, you agree to the{" "}
              <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>, and Google
              handles data as described in the{" "}
              <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
            </p>
            <p>
              What it accesses: the name of the connected channel, and permission to upload videos to
              it. What it stores: the access key Google returns, encrypted, and the videos waiting to
              be published. It does not read, store or share anything else, and nothing is sold or
              used for advertising.
            </p>
            <p>
              You can withdraw the tool&apos;s access at any time on the{" "}
              <a href="https://security.google.com/settings/security/permissions">
                Google security settings page
              </a>
              . When access is withdrawn, or on request at{" "}
              <a href="mailto:sandrine@thegirlwithacamera.com">sandrine@thegirlwithacamera.com</a>,
              the stored key and any waiting videos are deleted within seven days.
            </p>

            <h2>How long I keep it</h2>
            <p>
              Messages from the contact form are kept for as long as we are in touch, and for up to
              three years after our last exchange, unless a project requires longer (for example
              invoices, which Belgian law requires me to keep for seven years). Mailing list
              addresses are kept until you unsubscribe.
            </p>

            <h2>Who else sees it</h2>
            <p>
              I never sell your data. It is only handled by the services named above (Resend,
              Vercel, Gumroad), which process it on my behalf. Some of them are based in the United
              States; they transfer data under the safeguards required by European law.
            </p>

            <h2>Your rights</h2>
            <p>
              Under the GDPR, you can ask me to see the data I hold about you, to correct it, to
              delete it, to limit how it is used, or to receive a copy of it. You can also object
              to its use or withdraw your consent at any time. Write to{" "}
              <a href="mailto:hello@thegirlwithacamera.com">hello@thegirlwithacamera.com</a>, and I
              will answer within one month.
            </p>
            <p>
              If you think your data has been mishandled, you can also file a complaint with the
              Belgian Data Protection Authority,{" "}
              <a href="https://www.dataprotectionauthority.be">dataprotectionauthority.be</a>.
            </p>

            <p>
              Questions about this page? <Link href="/en/about#contact">Get in touch</Link>.
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
