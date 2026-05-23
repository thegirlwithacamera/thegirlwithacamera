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

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events for payment confirmation
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
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Payment successful for:', session.customer_email);

        // Get the full session data from Stripe
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
          console.error('Error saving order:', orderError);
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
            console.error('Error saving order items:', itemsError);
            throw new Error(`Failed to save order items: ${itemsError.message}`);
          }
        }

        // Log successful webhook
        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          stripe_session_id: session.id,
          payload: event.data,
          processed: true,
        });

        // Send order confirmation emails
        try {
          const emailItems = fullSession.line_items?.data.map((item) => ({
            product_name: item.description || 'Unknown Product',
            quantity: item.quantity || 1,
            unit_price_cents: item.price?.unit_amount || 0,
          })) || [];

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

          console.log('✅ Order confirmation emails sent');
        } catch (emailError) {
          console.error('Error sending emails:', emailError);
          // Continue even if email fails - order is already saved
        }

        // TODO: Trigger Printful order creation
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('❌ Payment failed:', paymentIntent.id);

        // Update order status to failed
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ status: 'failed' })
          .eq('stripe_session_id', paymentIntent.metadata?.session_id || '');

        if (updateError) {
          console.error('Error updating order status:', updateError);
        }

        // Log webhook
        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          payload: event.data,
          processed: true,
        });

        // TODO: Send payment failure email to customer
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💰 Refund processed:', charge.id);

        // Update order status to refunded
        if (charge.metadata?.session_id) {
          const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ status: 'refunded' })
            .eq('stripe_session_id', charge.metadata.session_id);

          if (updateError) {
            console.error('Error updating order status:', updateError);
          }
        }

        // Log webhook
        await supabaseAdmin.from('webhook_logs').insert({
          event_type: event.type,
          stripe_session_id: charge.metadata?.session_id,
          payload: event.data,
          processed: true,
        });

        // TODO: Send refund notification email to customer
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);

    // Log error webhook
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
