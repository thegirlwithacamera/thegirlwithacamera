import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/shop/products
 * Fetch all products from Printful API
 */
export async function GET(request: NextRequest) {
  try {
    const printfulToken = process.env.PRINTFUL_API_KEY;
    
    if (!printfulToken) {
      return NextResponse.json(
        { error: 'Printful API key not configured' },
        { status: 500 }
      );
    }

    // Fetch products from Printful API
    const response = await fetch('https://api.printful.com/store/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${printfulToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Printful products to our format
    const products = data.result?.map((product: any) => ({
      id: product.id,
      printfulId: product.id,
      name: product.title,
      description: product.description,
      image: product.thumbnail_url,
      // Price will be fetched from variant data
    })) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
