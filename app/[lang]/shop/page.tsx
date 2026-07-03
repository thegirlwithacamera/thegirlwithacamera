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

  return <ShopContent lang={lang} />;
}
