import type { Product } from '@/lib/shop-products';

const PRINTFUL_API_BASE = 'https://api.printful.com';

// Printful catalog variant ids — Enhanced Matte Paper Poster (in), product 1.
// Verified against GET https://api.printful.com/products/1 (2026-07).
// 'a5-print' is sold on the site as 15×20 cm (Printful has no true A5 poster).
const CATALOG_VARIANT_IDS: Record<string, number> = {
  'a5-print': 48489, // 6″×8″ (15.2×20.3 cm)
  'a4-print': 48505, // 8.27″×11.69″ (exact A4)
  'a3-print': 48504, // 11.69″×16.54″ (exact A3)
};

export function isPrintfulConfigured(): boolean {
  return !!process.env.PRINTFUL_API_KEY;
}

async function callPrintfulAPI(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const storeId = process.env.PRINTFUL_STORE_ID;
  if (storeId) {
    headers['X-PF-Store-Id'] = storeId;
  }

  const response = await fetch(`${PRINTFUL_API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      `Printful API error (${response.status}): ${data.error?.message || data.result || response.statusText}`
    ) as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Create the product in the Printful store with one sync variant per size,
 * using the full-resolution site image as the print file.
 * Sync variant external_id matches the cart item id (`shop-01-a5-print`),
 * so orders can reference variants without any id mapping table.
 * Returns the sync product id, or the existing one if already synced.
 */
export async function syncProductToPrintful(
  product: Product,
  siteBaseUrl: string
): Promise<{ syncProductId: number; alreadyExisted: boolean }> {
  try {
    const existing = await callPrintfulAPI(`/store/products/@${product.id}`);
    return { syncProductId: existing.result.sync_product.id, alreadyExisted: true };
  } catch (error) {
    if ((error as { status?: number }).status !== 404) throw error;
  }

  const imageUrl = `${siteBaseUrl}${product.image}`;

  const created = await callPrintfulAPI('/store/products', 'POST', {
    sync_product: {
      external_id: product.id,
      name: product.name,
      thumbnail: imageUrl,
    },
    sync_variants: product.variants.map((variant) => ({
      external_id: `${product.id}-${variant.type}`,
      variant_id: CATALOG_VARIANT_IDS[variant.type],
      retail_price: (variant.price / 100).toFixed(2),
      files: [{ url: imageUrl }],
    })),
  });

  return { syncProductId: created.result.id, alreadyExisted: false };
}

/**
 * Create a DRAFT order in Printful (not confirmed — nothing is produced or
 * charged until the order is confirmed in the Printful dashboard).
 * Items reference sync variants by external_variant_id (= cart item id).
 */
export async function createPrintfulDraftOrder(
  externalId: string,
  items: Array<{ external_variant_id: string; quantity: number }>,
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code?: string;
    country_code: string;
    zip: string;
    email?: string;
  }
) {
  const order = await callPrintfulAPI('/orders', 'POST', {
    external_id: externalId,
    shipping: 'STANDARD',
    items,
    recipient,
  });
  return order.result;
}

export async function getPrintfulOrderStatus(externalId: string) {
  const order = await callPrintfulAPI(`/orders/@${externalId}`);
  return order.result;
}
