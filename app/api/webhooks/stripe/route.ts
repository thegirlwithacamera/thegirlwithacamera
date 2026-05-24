import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/client';
import {
  sendCustomerOrderEmail,
  sendShopOwnerOrderEmail,
} from '@/lib/email/send-order-confirmation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ─────────────────────────────────────────────────────────
// Printful — activer dès que PRINTFUL_API_KEY est configurée
// ─────────────────────────────────────────────────────────
// async function createPrintfulOrder(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]) {
//   const printfulApiKey = process.env.PRINTFUL_API_KEY;
//   if (!printfulApiKey || printfulApiKey === 'your_printful_api_key_here') {
//     console.warn('⚠️  Printful API key not configured — skipping order creation');
//     return null;
//   }
//
//   // Mapping produit → Printful variant ID
//   // À remplir avec les vrais IDs depuis le dashboard Printful
//   // Dashboard : https://www.printful.com/dashboard/store/products
//   const PRINTFUL_VARIANT_MAP: Record<string, number> = {
//     // 'img-01-a4-print': 12345,
//     // 'img-01-a3-print': 12346,
//     // 'img-01-a4-frame': 12347,
//     // 'img-01-a3-frame': 12348,
//   };
//
//   const shipping = session.shipping_details;
//   if (!shipping?.address) {
//     console.warn('⚠️  No shipping address in session — cannot create Printful order');
//     return null;
//   }
//
//   const printfulItems = lineItems
//     .map((item) => {
//       const productId = item.price?.metadata?.product_id as string;
//       const variantId = PRINTFUL_VARIANT_MAP[productId];
//       if (!variantId) {
//         console.warn(`⚠️  No Printful variant mapped for product: ${productId}`);
//         return null;
//       }
//       return {
//         sync_variant_id: variantId,
//         quantity: item.quantity || 1,
//       };
//     })
//     .filter(Boolean);
//
//   if (printfulItems.length === 0) {
//     console.warn('⚠️  No Printful items to create — all variants unmapped');
//     return null;
//   }
//
//   const printfulOrder = {
//     external_id: session.id,
//     shipping: 'STANDARD',
//     recipient: {
//       name: shipping.name || session.customer_details?.name || 'Customer',
//       address1: shipping.address.line1 || '',
//       address2: shipping.address.line2 || '',
//       city: shipping.address.city || '',
//       state_code: shipping.address.state || '',
//       country_code: shipping.address.country || 'BE',
//       zip: shipping.address.postal_code || '',
//       email: session.customer_email || '',
//     },
//     items: printfulItems,
//   };
//
//   const response = await fetch('https://api.printful.com/orders', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${printfulApiKey}`,
//       'Content-Type': 'application/json',
//       'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '',
//     },
//     body: JSON.stringify(printfulOrder),
//   });
//
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(`Printful order failed: ${JSON.stringify(error)}`);
//   }
//
//   const result = await response.json();
//   console.log('✅ Printful order created:', result.result?.id);
//   return result.result;
// }
// ─────────────────────────────────────────────────────────

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for payment confirmation
 * Register this URL in: https://dashboard.stripe.com/webhooks
 */
export async function POST(request: NextRequest) {
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

        // Retrieve full session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
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
            shipping_address: (session as any).shipping_details?.address || null,
          })
          .select('id')
          .single();

        if (orderError) {
          throw new Error(`Failed to save order: ${orderError.message}`);
        }

        // Save order items
        if (fullSession.line_items?.data) {
          const items = fullSession.line_items.data.map((item) => ({
            order_id: orderData.id,
            product_id: item.price?.product as string,
            product_name: item.description || 'Unknown Product',
            quantity: item.quantity || 1,
            unit_price_cents: item.price?.unit_amount || 0,
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

        // Send confirmation emails (non-blocking)
        const emailItems = fullSession.line_items?.data.map((item) => ({
          product_name: item.description || 'Unknown Product',
          quantity: item.quantity || 1,
          unit_price_cents: item.price?.unit_amount || 0,
        })) || [];

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

        // Printful order creation — décommenter la fonction createPrintfulOrder ci-dessus
        // et activer ces lignes une fois PRINTFUL_API_KEY configurée :
        // try {
        //   await createPrintfulOrder(session, fullSession.line_items?.data || []);
        // } catch (printfulError) {
        //   console.error('Printful order creation failed:', printfulError);
        //   // Non-blocking — order is saved, email sent, Printful can be retried manually
        // }

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
