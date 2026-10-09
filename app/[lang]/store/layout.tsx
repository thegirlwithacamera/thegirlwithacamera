import type { ReactNode } from "react";
import StoreGate from "./StoreGate";

// Layout commun du store : toutes les pages de la boutique passent par la
// porte email (inscription newsletter avant de parcourir les produits).

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function StoreLayout({ children, params }: Props) {
  const { lang } = await params;
  return (
    <>
      {children}
      <StoreGate lang={lang === "fr" ? "fr" : "en"} />
    </>
  );
}
