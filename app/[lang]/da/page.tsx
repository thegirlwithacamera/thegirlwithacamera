import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function DAPage({ params }: Props) {
  const { lang } = await params;
  redirect(`/${lang}/services`);
}
