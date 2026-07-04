import { NextResponse } from 'next/server';
import { SHOP_PRODUCTS } from '@/lib/shop-products';
import { getEditionAvailability } from '@/lib/editions';

/**
 * GET /api/shop/editions
 * Public read-only stock levels for all limited-edition prints.
 */
export async function GET() {
  const limitedIds = SHOP_PRODUCTS.filter(p => p.editionSize).map(p => p.id);
  const editions = await getEditionAvailability(limitedIds);
  return NextResponse.json({ editions });
}
