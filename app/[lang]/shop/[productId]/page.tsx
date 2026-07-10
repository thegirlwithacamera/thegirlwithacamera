import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProductPageInner from './ProductPageClient';
import { getProductById } from '@/lib/shop-products';

// Boutique HORS LIGNE — voir app/[lang]/shop/page.tsx pour la remettre.
const SHOP_OFFLINE = true;

type PageProps = {
  params: Promise<{ lang: 'fr' | 'en'; productId: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { productId, lang } = await params;
  const product = getProductById(productId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: `${product.name} · The Girl With A Camera`,
    description: lang === 'fr' ? product.descriptionFr : product.descriptionEn,
  };
}

export default async function ProductPage({ params }: PageProps) {
  if (SHOP_OFFLINE) notFound();
  const { lang, productId } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageInner lang={lang} productId={productId} />
    </Suspense>
  );
}
