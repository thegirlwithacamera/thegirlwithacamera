import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

// /work redirige vers /work/photo (la section principale)
export default async function WorkPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}/work/photo`);
}
