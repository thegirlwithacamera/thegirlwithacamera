import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutRequestBody {
  items: CheckoutItem[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

type LocaleType = 'fr' | 'en' | 'auto';

const localeMap: Record<string, LocaleType> = {
  fr: 'fr',
  en: 'auto',
};

const SHIPPING_RATE_CENTS = 695;
const FREE_SHIPPING_THRESHOLD_CENTS = 10000;

// Markets Printful fulfills from a regional facility (EU, UK, US, CA,
// AU, JP...), keeping delivery times and shipping costs predictable.
type ShippingCollection = NonNullable<Stripe.Checkout.SessionCreateParams['shipping_address_collection']>;
const SHIPPING_COUNTRIES: ShippingCollection['allowed_countries'] = [
  // Union européenne
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  // Europe hors UE
  'GB', 'CH', 'NO', 'IS', 'LI', 'MC', 'AD',
  // Amérique du Nord
  'US', 'CA', 'MX',
  // Océanie
  'AU', 'NZ',
  // Asie
  'JP', 'KR', 'SG', 'HK', 'TW',
  // Moyen-Orient
  'AE', 'IL',
];

/**
 * POST /[lang]/api/shop/checkout
 * Create a Stripe checkout session with language support
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment is not configured' },
        { status: 500 }
      );
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-04-22.dahlia',
    });

    // Await params to get lang
    const { lang } = await params as { lang: 'fr' | 'en' };

    const body: CheckoutRequestBody = await request.json();
    const { items, customerEmail, successUrl, cancelUrl } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      );
    }

    // Create line items for Stripe.
    // metadata.item_id is the shop variant id (e.g. "shop-01-a4-print"),
    // read back by the webhook to create the Printful order.
    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          metadata: { item_id: item.id },
        },
        unit_amount: Math.round(item.price), // Ensure price is in cents and rounded
      },
      quantity: item.quantity,
    }));

    // Map language to Stripe locale
    const stripeLocale = localeMap[lang] || 'auto';

    // Flat-rate shipping, free above the threshold
    const subtotal = items.reduce(
      (sum, item) => sum + Math.round(item.price) * item.quantity,
      0
    );
    const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: stripeLocale,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: SHIPPING_COUNTRIES,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: freeShipping ? 0 : SHIPPING_RATE_CENTS,
              currency: 'eur',
            },
            display_name: freeShipping
              ? (lang === 'fr' ? 'Livraison offerte' : 'Free shipping')
              : (lang === 'fr' ? 'Livraison standard' : 'Standard shipping'),
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe checkout URL');
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
