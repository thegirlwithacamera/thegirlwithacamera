const PRINTFUL_API_BASE = 'https://api.printful.com/v1';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

interface PrintfulProduct {
  external_id: string;
  name: string;
}

interface PrintfulVariant {
  external_id: string;
  variant_id: number;
  sku: string;
  price?: string;
}

interface PrintfulSyncVariant {
  external_id: string;
  sync_product_id: number;
  name: string;
  sku: string;
  price?: string;
}

async function callPrintfulAPI(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
) {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${PRINTFUL_API_BASE}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Printful API error: ${data.error?.message || response.statusText}`);
  }

  return data;
}

export async function createOrUpdatePrintfulProduct(
  shopProductId: string,
  name: string,
  imageUrl: string,
  variantPrices: { [key: string]: number }
) {
  try {
    // Create sync product (represents the product in Printful)
    const syncProduct = await callPrintfulAPI('/store/products', 'POST', {
      external_id: shopProductId,
      name: name,
    } as PrintfulProduct);

    const syncProductId = syncProduct.result.id;

    // Add variants (different sizes)
    const variantMappings: { [key: string]: number } = {
      'a5-print': 1, // A5 variant ID in Printful
      'a4-print': 2, // A4 variant ID
      'a3-print': 3, // A3 variant ID
    };

    for (const [variantKey, printfulVariantId] of Object.entries(variantMappings)) {
      const price = variantPrices[variantKey];
      if (price) {
        await callPrintfulAPI(`/store/products/${syncProductId}/variants`, 'POST', {
          external_id: `${shopProductId}-${variantKey}`,
          variant_id: printfulVariantId,
          price: (price / 100).toFixed(2), // Convert cents to euros
          sku: `${shopProductId}-${variantKey}`,
        } as PrintfulVariant);
      }
    }

    return syncProductId;
  } catch (error) {
    console.error('Error creating Printful product:', error);
    throw error;
  }
}

export async function submitOrderToPrintful(
  orderId: string,
  items: Array<{
    sync_variant_id: number;
    quantity: number;
  }>,
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    email: string;
    phone: string;
  }
) {
  try {
    const order = await callPrintfulAPI('/orders', 'POST', {
      external_id: orderId,
      shipping: 'STANDARD',
      items,
      recipient,
    });

    return order;
  } catch (error) {
    console.error('Error submitting order to Printful:', error);
    throw error;
  }
}

export async function getPrintfulOrderStatus(externalId: string) {
  try {
    const order = await callPrintfulAPI(`/orders/external/${externalId}`);
    return order;
  } catch (error) {
    console.error('Error getting Printful order status:', error);
    throw error;
  }
}
