import type { Metadata } from 'next';
import { ShopContent } from './ShopContent';

interface Props {
  params: Promise<{ lang: 'fr' | 'en' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    fr: {
      title: 'Boutique',
      description: 'Boutique de Sandrine Ceuppens. Acheter des tirages photo, produits de marque et contenus exclusifs.',
    },
    en: {
      title: 'Shop',
      description: 'Sandrine Ceuppens Shop. Buy photo prints, branded products and exclusive content.',
    },
  };

  const m = metadata[lang];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `/${lang}/shop`, languages: { fr: '/fr/shop', en: '/en/shop' } },
  };
}

export default async function ShopPage({ params }: Props) {
  const { lang } = await params;

  const messages = {
    fr: {
      title: 'Boutique hors ligne',
      message: 'La boutique est actuellement hors ligne. Veuillez réessayer plus tard.',
    },
    en: {
      title: 'Shop Offline',
      message: 'The shop is currently offline. Please try again later.',
    },
  };

  const m = messages[lang];

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-serif mb-4">{m.title}</h1>
        <p className="text-lg text-muted">{m.message}</p>
      </div>
    </div>
  );
}
