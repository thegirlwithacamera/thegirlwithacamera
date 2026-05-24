import { NextRequest, NextResponse } from 'next/server';
import { SHOP_PRODUCTS } from '@/lib/shop-products';
import { createOrUpdatePrintfulProduct } from '@/lib/printful';

export async function POST(request: NextRequest) {
  try {
    // TODO: Re-enable auth check after testing
    // Verify this is an authorized request (from admin or scheduled task)
    // const authHeader = request.headers.get('authorization');
    // const adminKey = process.env.ADMIN_SECRET_KEY || '';
    // if (!authHeader?.startsWith('Bearer ') || authHeader.substring(7) !== adminKey) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const results = [];

    for (const product of SHOP_PRODUCTS) {
      try {
        const variantPrices: { [key: string]: number } = {};

        for (const variant of product.variants) {
          variantPrices[variant.type] = variant.price;
        }

        const syncProductId = await createOrUpdatePrintfulProduct(
          product.id,
          product.name,
          `https://www.thegirlwithacamera.com${product.image}`,
          variantPrices
        );

        results.push({
          shopProductId: product.id,
          name: product.name,
          syncProductId,
          status: 'created',
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
      successCount: results.filter(r => r.status === 'created').length,
    });
  } catch (error) {
    console.error('Error initializing Printful products:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
