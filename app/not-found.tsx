import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="text-xs tracking-[0.3em] uppercase text-[#737373] mb-6">404</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold leading-none mb-6">
          Off frame.
        </h1>
        <p className="text-[#525252] mb-10">
          Cette page n&rsquo;existe pas — ou plus. / This page doesn&rsquo;t exist — or doesn&rsquo;t any more.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/fr" className="px-6 py-3 bg-black text-white text-xs tracking-widest uppercase">FR · Accueil</Link>
          <Link href="/en" className="px-6 py-3 border border-black text-black text-xs tracking-widest uppercase">EN · Home</Link>
        </div>
      </div>
    </div>
  );
}
