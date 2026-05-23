import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price_cents: number;
}

interface SendOrderEmailParams {
  customerEmail: string;
  orderId: string;
  items: OrderItem[];
  totalCents: number;
  currency: string;
}

function formatPrice(cents: number, currency: string = 'eur'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export async function sendCustomerOrderEmail(params: SendOrderEmailParams) {
  const { customerEmail, orderId, items, totalCents, currency } = params;

  const itemsHtml = items
    .map(
      (item) =>
        `<tr style="border-bottom: 1px solid #e5e5e5;">
          <td style="padding: 12px 0; text-align: left;">${item.product_name}</td>
          <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right;">${formatPrice(item.unit_price_cents, currency)}</td>
          <td style="padding: 12px 0; text-align: right; font-weight: 600;">${formatPrice(item.unit_price_cents * item.quantity, currency)}</td>
        </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; line-height: 1.6; color: #0a0a0a; background: #f9f9f9; }
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; letter-spacing: 0.05em; margin: 0 0 12px 0; }
      .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
      .order-summary { background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 24px 0; }
      table { width: 100%; margin: 24px 0; border-collapse: collapse; }
      th { text-align: left; padding: 12px 0; font-weight: 600; font-size: 13px; border-bottom: 2px solid #0a0a0a; }
      .total-row { font-size: 16px; font-weight: 600; padding-top: 16px !important; }
      .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Order Confirmation</h1>
      <p class="subtitle">Thank you for your order!</p>
      <div class="order-summary">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Order Items</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td style="text-align: right;">${formatPrice(totalCents, currency)}</td>
          </tr>
        </tbody>
      </table>
      <p style="line-height: 1.8; color: #666; font-size: 13px;">You will receive a shipping confirmation email soon with tracking information.</p>
      <div class="footer">
        <p>© 2025 The Girl With A Camera. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'orders@thegirlwithacamera.com',
      to: customerEmail,
      subject: 'Order Confirmation - The Girl With A Camera',
      html,
    });
    console.log('✅ Customer order email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending customer email:', error);
    throw error;
  }
}

export async function sendShopOwnerOrderEmail(params: SendOrderEmailParams) {
  const { customerEmail, orderId, items, totalCents, currency } = params;
  const shopOwnerEmail = process.env.SHOP_OWNER_EMAIL || 'sandrineceuppens@icloud.com';

  const itemsHtml = items
    .map(
      (item) =>
        `<tr style="border-bottom: 1px solid #e5e5e5;">
          <td style="padding: 12px 0; text-align: left;">${item.product_name}</td>
          <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 0; text-align: right;">${formatPrice(item.unit_price_cents, currency)}</td>
          <td style="padding: 12px 0; text-align: right; font-weight: 600;">${formatPrice(item.unit_price_cents * item.quantity, currency)}</td>
        </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; line-height: 1.6; color: #0a0a0a; background: #f9f9f9; }
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 4px; }
      h1 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 400; margin: 0 0 12px 0; }
      .alert { background: #f0f9ff; border-left: 4px solid #0a0a0a; padding: 16px; margin: 20px 0; }
      .customer-info { background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 24px 0; }
      table { width: 100%; margin: 24px 0; border-collapse: collapse; }
      th { text-align: left; padding: 12px 0; font-weight: 600; font-size: 13px; border-bottom: 2px solid #0a0a0a; }
      .total-row { font-size: 16px; font-weight: 600; padding-top: 16px !important; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>New Order Received!</h1>
      <div class="alert">
        <strong>Order #${orderId}</strong> - ${new Date().toLocaleDateString('fr-FR')}
      </div>
      <h2 style="font-size: 16px; font-weight: 600; margin: 24px 0 16px 0;">Customer Information</h2>
      <div class="customer-info">
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Total Amount:</strong> <span style="font-size: 18px; font-weight: 600;">${formatPrice(totalCents, currency)}</span></p>
      </div>
      <h2 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total:</td>
            <td style="text-align: right;">${formatPrice(totalCents, currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'orders@thegirlwithacamera.com',
      to: shopOwnerEmail,
      subject: `New Order #${orderId} - ${formatPrice(totalCents, currency)}`,
      html,
    });
    console.log('✅ Shop owner notification email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending shop owner email:', error);
    throw error;
  }
}
