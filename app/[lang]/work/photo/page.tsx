import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// /work/photo pointe vers la galerie photo existante
export default async function WorkPhotoPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}/gallery`);
}
