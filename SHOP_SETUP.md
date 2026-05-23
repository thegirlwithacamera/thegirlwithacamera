# E-Commerce Shop Setup Guide

This guide outlines the local setup for the e-commerce SHOP page implementation.

## ✅ What's Been Created

### Configuration
- **`.env.local`** - Contains API keys and configuration:
  - `NEXT_PUBLIC_STRIPE_KEY` - Stripe public key (test mode)
  - `STRIPE_SECRET_KEY` - Stripe secret key (test mode)
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase database URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
  - `PRINTFUL_API_KEY` - Printful API token (placeholder)

### API Routes
1. **`/app/[lang]/api/shop/products`** - GET endpoint
   - Fetches products from Printful API
   - Returns transformed product data
   
2. **`/app/[lang]/api/shop/checkout`** - POST endpoint
   - Creates Stripe checkout sessions
   - Accepts cart items and customer email
   - Returns Stripe session URL

3. **`/app/api/webhooks/stripe`** - POST endpoint
   - Handles Stripe payment events
   - Processes: checkout.session.completed, payment_intent.payment_failed, charge.refunded
   - Ready for order confirmation, email, and Printful integration

### React Components
1. **ProductCard** (`/app/components/shop/ProductCard.tsx`)
   - Displays individual products with hover effects
   - Shows price and add-to-cart functionality

2. **CartContext** (`/app/components/shop/CartContext.tsx`)
   - React Context for cart state management
   - Methods: addItem, removeItem, updateQuantity, clearCart
   - Provides cart total calculation

3. **Shop Page** (`/app/[lang]/shop/page.tsx`)
   - Main shop page template
   - Responsive grid layout
   - Bilingual support (FR/EN)
   - SEO with JSON-LD structured data

### Database (Supabase)
Schema ready to be created:
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items
- `checkout_sessions` - Stripe session tracking

## 🚀 Next Steps for Local Development

### 1. Update Printful API Token
The `PRINTFUL_API_KEY` in `.env.local` is currently a placeholder. You need to:
- Get your real Printful API token (contact Printful support or generate via their API)
- Update it in `.env.local`

### 2. Create Supabase Tables
Run these commands to initialize the database:

```bash
# Option A: Use SQL Editor (recommended)
# Visit: https://supabase.com/dashboard/project/nsiroxvsorigzlkvfzwz/sql
# Create tables with provided SQL schema

# Option B: Use migrations
npm run db:migrate
```

### 3. Setup Stripe Webhook (for local testing)
Install Stripe CLI and test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get webhook signing secret and add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### 4. Test Stripe Payments Locally
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### 5. Run Development Server
```bash
npm run dev
# Visit http://localhost:3000/en/shop
```

## 📋 Implementation Checklist

### Phase 1: Fetch & Display Products ✅ Ready
- [ ] Fetch products from Printful API endpoint
- [ ] Transform and cache product data
- [ ] Render ProductCard grid

### Phase 2: Shopping Cart ⏳ In Progress
- [ ] Implement Cart display component
- [ ] Add/remove items from cart
- [ ] Update quantities
- [ ] Show cart totals

### Phase 3: Stripe Checkout ⏳ Ready for Testing
- [ ] Connect checkout form to Stripe API
- [ ] Handle checkout session creation
- [ ] Redirect to Stripe Hosted Checkout
- [ ] Process Stripe webhook events

### Phase 4: Order Management ⏳ Ready
- [ ] Save orders to Supabase
- [ ] Update order status on payment
- [ ] Send confirmation emails
- [ ] Create Printful orders automatically

### Phase 5: Printful Integration ⏳ Blocked
- Waiting for real Printful API token
- Will implement order creation and fulfillment

## ⚠️ Important Constraints

**❌ Do NOT Deploy Yet**
Per user request: "ne deploie encore rien, on va d'abord tout préparé en local!"

Everything must be:
1. ✅ Created and tested locally
2. ✅ Verified with real payment flows
3. ✅ Fully integrated before any deployment

## 🔑 API Credentials

All credentials are in `.env.local`:
- Stripe test keys are active ✅
- Supabase connection ready ✅
- Printful token needs to be filled in ⏳

## 📞 Support

For issues:
1. Check `.env.local` has all required keys
2. Verify Stripe test mode is enabled
3. Check Supabase connection
4. Review API route error logs in terminal

---

**Status**: Infrastructure complete, ready for local development ✅
