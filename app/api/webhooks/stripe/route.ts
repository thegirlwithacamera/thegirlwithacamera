import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabase/client';
import {
  sendCustomerOrderEmail,
  sendShopOwnerOrderEmail,
} from '@/lib/email/send-order-confirmation';
import { isPrintfulConfigured, createPrintfulDraftOrder } from '@/lib/printful';
import { getBaseProductId, getProductById } from '@/lib/shop-products';
import { claimEditionNumbers } from '@/lib/editions';

function getLineItemId(item: Stripe.LineItem): string | undefined {
  const product = item.price?.product;
  return typeof product === 'object' && product !== null && 'metadata' in product
    ? (product.metadata as Record<string, string>).item_id
    : undefined;
}

// ─────────────────────────────────────────────────────────
// Printful — creates a DRAFT order (confirmed manually in the
// Printful dashboard, so nothing is produced or charged automatically).
// Sync variants are referenced by external_variant_id = cart item id
// (e.g. "shop-01-a4-print"), carried through Stripe product metadata.
// ─────────────────────────────────────────────────────────
type ShippingDetails = { name?: string; address?: Stripe.Address };

function getShippingDetails(session: Stripe.Checkout.Session): ShippingDetails | undefined {
  const s = session as unknown as {
    collected_information?: { shipping_details?: ShippingDetails };
    shipping_details?: ShippingDetails;
  };
  return s.collected_information?.shipping_details ?? s.shipping_details;
}

async function createPrintfulOrder(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
) {
  const shipping = getShippingDetails(session);

  if (!shipping?.address) {
    console.warn('No shipping address in session — skipping Printful order');
    return null;
  }

  const printfulItems = lineItems
    .map((item) => {
      const itemId = getLineItemId(item);
      if (!itemId) {
        console.warn(`No item_id metadata on line item: ${item.description}`);
        return null;
      }
      return { external_variant_id: itemId, quantity: item.quantity || 1 };
    })
    .filter((item): item is { external_variant_id: string; quantity: number } => item !== null);

  if (printfulItems.length === 0) {
    console.warn('No Printful items resolved from line items — skipping');
    return null;
  }

  const order = await createPrintfulDraftOrder(session.id, printfulItems, {
    name: shipping.name || session.customer_details?.name || 'Customer',
    address1: shipping.address.line1 || '',
    address2: shipping.address.line2 || undefined,
    city: shipping.address.city || '',
    state_code: shipping.address.state || undefined,
    country_code: shipping.address.country || 'BE',
    zip: shipping.address.postal_code || '',
    email: session.customer_email || undefined,
  });

  console.log('Printful draft order created:', order?.id);
  return order;
}

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for payment confirmation
 * Register this URL in: https://dashboard.stripe.com/webhooks
 */
export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error('Stripe webhook not configured: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-04-22.dahlia',
  });
  const supabaseAdmin = getSupabaseAdmin();

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve full session with line items (products expanded for
        // the item_id metadata used by the Printful order)
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items.data.price.product'],
        });

        // Save order to database
        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            stripe_session_id: session.id,
            customer_email: session.customer_email,
            total_amount_cents: session.amount_total || 0,
            currency: session.currency || 'eur',
            status: 'completed',
            billing_address: session.customer_details?.address || null,
            shipping_address: getShippingDetails(session)?.address || null,
          })
          .select('id')
          .single();

        if (orderError) {
          throw new Error(`Failed to save order: ${orderError.message}`);
        }

        // Save order items — claiming edition numbers for limited prints
        // as we go (non-blocking: a claim failure just leaves that item
        // unnumbered rather than failing the whole paid order).
        const lineItemsData = fullSession.line_items?.data || [];
        const emailItems: Array<{
          product_name: string;
          quantity: number;
          unit_price_cents: number;
          editionLabel?: string;
        }> = [];

        if (lineItemsData.length > 0) {
          const items = await Promise.all(lineItemsData.map(async (item) => {
            const quantity = item.quantity || 1;
            const itemId = getLineItemId(item);
            const shopProductId = itemId ? getBaseProductId(itemId) : undefined;
            const editionSize = shopProductId ? getProductById(shopProductId)?.editionSize : undefined;

            let editionNumbers: number[] | null = null;
            if (shopProductId && editionSize) {
              try {
                editionNumbers = await claimEditionNumbers(shopProductId, quantity);
                if (editionNumbers && editionNumbers.length < quantity) {
                  console.error(
                    `Oversold edition ${shopProductId}: claimed ${editionNumbers.length}/${quantity} for session ${session.id} — review manually`
                  );
                }
              } catch (claimError) {
                console.error(`Failed to claim edition numbers for ${shopProductId}:`, claimError);
              }
            }

            const editionLabel = editionNumbers && editionNumbers.length > 0
              ? (editionNumbers.length === 1
                ? `Édition n° ${editionNumbers[0]}/${editionSize}`
                : `Édition n° ${editionNumbers[0]}-${editionNumbers[editionNumbers.length - 1]}/${editionSize}`)
              : undefined;

            emailItems.push({
              product_name: item.description || 'Unknown Product',
              quantity,
              unit_price_cents: item.price?.unit_amount || 0,
              editionLabel,
            });

            return {
              order_id: orderData.id,
              product_id: item.price?.product as string,
              shop_product_id: shopProductId || null,
              product_name: item.description || 'Unknown Product',
              quantity,
              unit_price_cents: item.price?.unit_amount || 0,
              edition_numbers: editionNumbers,
            };
          }));

          const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(items);

          if (itemsError) {
            throw new Error(`Failed to save order items: ${itemsError.message}`);
          }
        }

        // Log webhook
        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          stripe_session_id: session.id,
          payload: event.data,
          processed: true,
        });

        try {
          await Promise.all([
            sendCustomerOrderEmail({
              customerEmail: session.customer_email || '',
              orderId: orderData.id,
              items: emailItems,
              totalCents: session.amount_total || 0,
              currency: session.currency || 'eur',
            }),
            sendShopOwnerOrderEmail({
              customerEmail: session.customer_email || '',
              orderId: orderData.id,
              items: emailItems,
              totalCents: session.amount_total || 0,
              currency: session.currency || 'eur',
            }),
          ]);
        } catch (emailError) {
          // Email failure must not block the webhook response
          console.error('Error sending confirmation emails:', emailError);
        }

        // Printful draft order — non-blocking: the order is already saved
        // and emails sent, so a Printful failure can be retried manually
        if (isPrintfulConfigured()) {
          try {
            await createPrintfulOrder(fullSession, fullSession.line_items?.data || []);
          } catch (printfulError) {
            console.error('Printful order creation failed:', printfulError);
          }
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await supabaseAdmin
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_session_id', paymentIntent.metadata?.session_id || '');

        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          payload: event.data,
          processed: true,
        });

        // TODO (optionnel) : envoyer un email d'échec de paiement au client
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        if (charge.metadata?.session_id) {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'refunded' })
            .eq('stripe_session_id', charge.metadata.session_id);
        }

        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          stripe_session_id: charge.metadata?.session_id,
          payload: event.data,
          processed: true,
        });

        // TODO (optionnel) : envoyer un email de remboursement au client
        break;
      }

      default:
        // Ignorer les événements non gérés
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);

    await supabaseAdmin.from('webhook_logs').insert({
      event_type: event.type,
      payload: event.data,
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
