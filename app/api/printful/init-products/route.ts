import { NextRequest, NextResponse } from 'next/server';
import { SHOP_PRODUCTS } from '@/lib/shop-products';
import { isPrintfulConfigured, syncProductToPrintful } from '@/lib/printful';

const SITE_BASE_URL = 'https://www.thegirlwithacamera.com';

/**
 * POST /api/printful/init-products
 * Push the shop catalog to the Printful store (idempotent — existing
 * products are skipped). Requires: Authorization: Bearer <ADMIN_SECRET_KEY>
 */
export async function POST(request: NextRequest) {
  const adminKey = process.env.ADMIN_SECRET_KEY;
  const authHeader = request.headers.get('authorization');
  if (!adminKey || !authHeader?.startsWith('Bearer ') || authHeader.substring(7) !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPrintfulConfigured()) {
    return NextResponse.json(
      { error: 'PRINTFUL_API_KEY is not configured' },
      { status: 500 }
    );
  }

  const results = [];

  for (const product of SHOP_PRODUCTS) {
    try {
      const { syncProductId, alreadyExisted } = await syncProductToPrintful(
        product,
        SITE_BASE_URL
      );
      results.push({
        shopProductId: product.id,
        name: product.name,
        syncProductId,
        status: alreadyExisted ? 'already-exists' : 'created',
      });
    } catch (error) {
      results.push({
        shopProductId: product.id,
        name: product.name,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    message: 'Printful products initialization completed',
    results,
    totalProducts: SHOP_PRODUCTS.length,
    createdCount: results.filter(r => r.status === 'created').length,
    existingCount: results.filter(r => r.status === 'already-exists').length,
    errorCount: results.filter(r => r.status === 'error').length,
  });
}
