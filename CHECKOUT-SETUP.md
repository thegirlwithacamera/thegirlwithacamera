# E-Commerce Checkout Setup Guide

This guide walks through setting up the complete checkout flow for The Girl With A Camera shop.

## ✅ Completed: Shop Frontend Infrastructure

- **Product Grid**: 3-column responsive layout with hover overlays
- **Add to Cart**: Functional cart system with React Context
- **Cart Sidebar**: Real-time cart updates with quantity controls
- **Email Collection Modal**: Custom modal for collecting customer email before checkout
- **Success/Cancel Pages**: Bilingual success and cancellation pages
- **Responsive Design**: Mobile-friendly with bilingual (FR/EN) support

## 🔧 Next Steps: Stripe Integration

### Step 1: Get Stripe API Keys (5 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create an account
3. Navigate to **Developers > API keys** (left sidebar)
4. You'll see two keys in **Test mode**:
   - **Publishable key** - starts with `pk_test_...`
   - **Secret key** - starts with `sk_test_...`
5. Copy both keys

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root (if it doesn't exist):

```bash
# Stripe Configuration (test mode)
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# For production (after launch):
# STRIPE_PUBLIC_KEY=pk_live_YOUR_LIVE_KEY
# STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
```

2. Replace `YOUR_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with your actual Stripe keys
3. Save the file (it's in `.gitignore` - never commit credentials!)

### Step 3: Test Checkout Flow Locally

1. **Start dev server** (if not already running):
```bash
npm run dev
```

2. **Navigate to shop**:
   - English: http://localhost:3000/en/shop
   - French: http://localhost:3000/fr/shop

3. **Add product to cart**:
   - Hover over a product
   - Click "ADD TO CART"
   - Verify cart updates in sidebar

4. **Proceed to checkout**:
   - Click "PROCEED TO CHECKOUT" button
   - Email modal appears
   - Enter test email: `test@example.com`
   - Click "CONTINUE"
   - You'll be redirected to Stripe Checkout

5. **Complete payment** (using test card):
   - Use card number: `4242 4242 4242 4242`
   - Expiration: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any postal code)
   - Click "Pay"

6. **Verify success page**:
   - Should redirect to `/en/shop/success` or `/fr/shop/success`
   - Shows order confirmation with session ID
   - Displays customer email

### Step 4: Current Implementation Details

#### Files Created/Modified:

1. **`app/[lang]/api/shop/checkout/route.ts`**
   - Accepts POST requests with cart items
   - Creates Stripe checkout session
   - Returns checkout URL for redirect
   - Supports bilingual locales (FR/EN)
   - Requires billing address collection

2. **`app/[lang]/shop/ShopContent.tsx`**
   - Email modal for customer email collection
   - Email validation (basic regex)
   - Handles checkout flow with loading state
   - Passes email to API endpoint

3. **`app/[lang]/shop/success/page.tsx`**
   - Displays order confirmation
   - Shows session ID and customer email
   - Bilingual support
   - Links back to shop and contact page

4. **`app/[lang]/shop/cancel/page.tsx`**
   - Displays cancellation message
   - No charges message
   - Option to retry or contact support

#### API Endpoints:

```
POST /${lang}/api/shop/checkout
Request:
{
  "items": [
    {
      "id": "print-01",
      "name": "Street Light - Limited Edition Print",
      "price": 2999,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "customerEmail": "customer@example.com",
  "successUrl": "http://localhost:3000/en/shop/success?session_id={CHECKOUT_SESSION_ID}&email=...",
  "cancelUrl": "http://localhost:3000/en/shop/cancel"
}

Response:
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

## 🗄️ Next Phase: Database Integration

To complete the checkout flow, you'll need:

### Supabase Setup (PostgreSQL)

1. **Create Supabase account** at [supabase.com](https://supabase.com)
2. **Create new project** with PostgreSQL database
3. **Create tables**:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  total_amount INTEGER,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  billing_address JSONB,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Webhook logs (for debugging)
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  stripe_session_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

4. **Get connection credentials** from project settings
5. **Add to `.env.local`**:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Webhook Setup

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to listen for:
   - `checkout.session.completed` - save order to database
   - `payment_intent.payment_failed` - mark order as failed
5. Copy webhook signing secret and add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📧 Email Integration (Resend)

The project already has Resend installed for email:

1. **Create Resend account** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Add to `.env.local`**:
```
RESEND_API_KEY=re_...
```

### Send Order Confirmation Email

Create `app/api/shop/order-confirmation/route.ts`:

```typescript
import { resend } from 'resend';

export async function POST(request: NextRequest) {
  const { customerEmail, orderId, items, total } = await request.json();
  
  await resend.emails.send({
    from: 'noreply@thegirlwithacamera.com',
    to: customerEmail,
    subject: 'Your Order Confirmation',
    html: `<h1>Thank you for your order!</h1>
           <p>Order ID: ${orderId}</p>
           <p>Total: €${(total / 100).toFixed(2)}</p>`,
  });
}
```

## 🚀 Testing Checklist

- [ ] Stripe keys configured in `.env.local`
- [ ] Add to cart works
- [ ] Email validation works
- [ ] Stripe checkout modal opens
- [ ] Test card payment succeeds
- [ ] Redirected to success page
- [ ] Session ID displays on success page
- [ ] Cancel payment works
- [ ] Redirected to cancel page
- [ ] Bilingual flow works (FR/EN)

## 📋 Future Enhancements

1. **Printful Integration**
   - Fetch products from Printful API
   - Create print orders automatically on payment
   - Track fulfillment status

2. **Order Management**
   - Admin dashboard for orders
   - Order history for customers
   - Order tracking page

3. **Inventory Management**
   - Track stock levels
   - Auto-disable out-of-stock items

4. **Analytics**
   - Revenue tracking
   - Popular products
   - Customer metrics

## 📞 Support

- **Stripe Docs**: https://stripe.com/docs/payments/checkout
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Remember**: ⚠️ **DO NOT DEPLOY TO PRODUCTION YET**
- Complete local testing first
- Set up webhooks before going live
- Use live Stripe keys only in production
- Enable email verification in production
