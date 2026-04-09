interface Props {
  params: Promise<{ lang: "fr" | "en" }>;
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-20 border-b border-[#e5e5e5] pb-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Journal</h1>
        </div>

        <p className="text-xs tracking-widest uppercase text-[#b5b5b5]">
          {lang === "fr" ? "Bientôt" : "Coming soon"}
        </p>

      </div>
    </div>
  );
}
