import { permanentRedirect } from "next/navigation";

// Pack 101 retire de la vente (11/11/2026) : redirection vers Street.
interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function Pack101Page({ params }: Props) {
  const { lang } = await params;
  permanentRedirect(`/${lang}/store/street`);
}
