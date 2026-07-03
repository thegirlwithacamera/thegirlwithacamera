import { Resend } from 'resend';

let resendClient: Resend | null = null;

// Lazy-initialized so the app builds without a Resend API key.
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

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
  lang?: 'fr' | 'en';
}

function formatPrice(cents: number, currency: string = 'eur'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export async function sendCustomerOrderEmail(params: SendOrderEmailParams) {
  const { customerEmail, orderId, items, totalCents, currency, lang = 'fr' } = params;

  const isFr = lang === 'fr';

  const labels = {
    title: isFr ? 'Commande confirmée' : 'Order Confirmed',
    subtitle: isFr ? 'Merci pour votre commande !' : 'Thank you for your order!',
    orderId: isFr ? 'Numéro de commande' : 'Order ID',
    date: isFr ? 'Date' : 'Date',
    orderItems: isFr ? 'Détail de la commande' : 'Order Items',
    product: isFr ? 'Produit' : 'Product',
    qty: isFr ? 'Qté' : 'Qty',
    unitPrice: isFr ? 'Prix unitaire' : 'Unit Price',
    total: isFr ? 'Total' : 'Total',
    shippingNote: isFr
      ? 'Vous recevrez un email de confirmation avec les informations de suivi dès que votre commande sera expédiée.'
      : 'You will receive a shipping confirmation email with tracking information once your order is dispatched.',
    footer: isFr
      ? '© 2026 The Girl With A Camera. Tous droits réservés.'
      : '© 2026 The Girl With A Camera. All rights reserved.',
  };

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
      h1 { font-family: 'EB Garamond', Georgia, serif; font-size: 32px; font-weight: 400; font-style: italic; letter-spacing: 0.05em; margin: 0 0 8px 0; color: #0a0a0a; }
      .brand { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #999; margin-bottom: 32px; }
      .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
      .order-summary { background: #f5f5f5; padding: 20px; margin: 24px 0; }
      .order-summary p { margin: 6px 0; font-size: 13px; color: #666; }
      .order-summary strong { color: #0a0a0a; }
      table { width: 100%; margin: 24px 0; border-collapse: collapse; }
      th { text-align: left; padding: 12px 0; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #0a0a0a; color: #0a0a0a; }
      .total-row td { font-size: 14px; font-weight: 600; padding-top: 16px; border-top: 1px solid #0a0a0a; }
      .shipping-note { line-height: 1.8; color: #666; font-size: 13px; margin: 24px 0; }
      .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #999; }
    </style>
  </head>
  <body>
    <div class="container">
      <p class="brand">The Girl With A Camera</p>
      <h1>${labels.title}</h1>
      <p class="subtitle">${labels.subtitle}</p>
      <div class="order-summary">
        <p><strong>${labels.orderId} :</strong> ${orderId.substring(0, 16)}...</p>
        <p><strong>Email :</strong> ${customerEmail}</p>
        <p><strong>${labels.date} :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
      </div>
      <h2 style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0;">${labels.orderItems}</h2>
      <table>
        <thead>
          <tr>
            <th>${labels.product}</th>
            <th style="text-align: center;">${labels.qty}</th>
            <th style="text-align: right;">${labels.unitPrice}</th>
            <th style="text-align: right;">${labels.total}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding-top: 16px;">${labels.total} :</td>
            <td style="text-align: right; padding-top: 16px;">${formatPrice(totalCents, currency)}</td>
          </tr>
        </tbody>
      </table>
      <p class="shipping-note">${labels.shippingNote}</p>
      <div class="footer">
        <p>${labels.footer}</p>
      </div>
    </div>
  </body>
</html>`;

  const subject = isFr
    ? `Confirmation de commande — The Girl With A Camera`
    : `Order Confirmation — The Girl With A Camera`;

  return getResend().emails.send({
    from: 'orders@thegirlwithacamera.com',
    to: customerEmail,
    subject,
    html,
  });
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
      .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; }
      h1 { font-family: 'EB Garamond', Georgia, serif; font-size: 28px; font-weight: 400; font-style: italic; margin: 0 0 12px 0; }
      .brand { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #999; margin-bottom: 28px; }
      .alert { background: #f5f5f5; border-left: 3px solid #0a0a0a; padding: 16px; margin: 20px 0; font-size: 13px; }
      .customer-info { background: #f5f5f5; padding: 20px; margin: 24px 0; }
      .customer-info p { margin: 6px 0; font-size: 13px; color: #666; }
      .customer-info strong { color: #0a0a0a; }
      table { width: 100%; margin: 24px 0; border-collapse: collapse; }
      th { text-align: left; padding: 12px 0; font-weight: 600; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #0a0a0a; }
      .total-row td { font-size: 14px; font-weight: 600; padding-top: 16px; border-top: 1px solid #0a0a0a; }
    </style>
  </head>
  <body>
    <div class="container">
      <p class="brand">The Girl With A Camera — Nouvelle commande</p>
      <h1>Nouvelle commande reçue</h1>
      <div class="alert">
        <strong>Commande #${orderId.substring(0, 16)}...</strong> — ${new Date().toLocaleDateString('fr-FR')}
      </div>
      <h2 style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin: 24px 0 8px 0;">Informations client</h2>
      <div class="customer-info">
        <p><strong>Email :</strong> ${customerEmail}</p>
        <p><strong>Montant total :</strong> <span style="font-size: 18px; font-weight: 600;">${formatPrice(totalCents, currency)}</span></p>
      </div>
      <h2 style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0;">Détail de la commande</h2>
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th style="text-align: center;">Qté</th>
            <th style="text-align: right;">Prix unitaire</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr class="total-row">
            <td colspan="3" style="text-align: right; padding-top: 16px;">Total :</td>
            <td style="text-align: right; padding-top: 16px;">${formatPrice(totalCents, currency)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;

  return getResend().emails.send({
    from: 'orders@thegirlwithacamera.com',
    to: shopOwnerEmail,
    subject: `Nouvelle commande — ${formatPrice(totalCents, currency)} — The Girl With A Camera`,
    html,
  });
}
