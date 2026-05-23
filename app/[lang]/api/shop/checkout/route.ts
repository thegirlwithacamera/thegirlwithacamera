import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

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

/**
 * POST /[lang]/api/shop/checkout
 * Create a Stripe checkout session with language support
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
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

    // Create line items for Stripe
    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: undefined, // Stripe accepts description
        },
        unit_amount: Math.round(item.price), // Ensure price is in cents and rounded
      },
      quantity: item.quantity,
    }));

    // Map language to Stripe locale
    const stripeLocale = localeMap[lang] || 'auto';

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
        allowed_countries: ['BE', 'FR', 'DE', 'NL', 'LU', 'CH'],
      },
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
