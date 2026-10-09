import type { ReactNode } from "react";
import NewsletterGate from "../components/NewsletterGate";

// Layout du store : la porte email (mini-guide offert + newsletter) ne
// s'affiche que sur les pages de la boutique.

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function StoreLayout({ children, params }: Props) {
  const { lang } = await params;
  return (
    <>
      {children}
      <NewsletterGate lang={lang === "fr" ? "fr" : "en"} />
    </>
  );
}
