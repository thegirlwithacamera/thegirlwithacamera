-- Orders table to store all customer orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  billing_address JSONB,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Order items table to store individual items in each order
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Webhook logs for debugging and audit trail
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  stripe_session_id TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT false,
  error TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_stripe_session_id ON webhook_logs(stripe_session_id);

-- Enable row-level security (optional but recommended)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role access
CREATE POLICY "Service role can access orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access order_items" ON order_items
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access webhook_logs" ON webhook_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────
-- MIGRATION 2026-07: Limited edition print tracking
-- Run this in the Supabase SQL Editor (safe to re-run — idempotent).
-- ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS print_editions (
  product_id TEXT PRIMARY KEY,
  edition_size INTEGER NOT NULL,
  sold_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE print_editions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can access print_editions" ON print_editions;
CREATE POLICY "Service role can access print_editions" ON print_editions
  FOR ALL
  USING (true)
  WITH CHECK (true);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS shop_product_id TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS edition_numbers INTEGER[];

-- Atomically claims up to p_quantity sequential edition numbers for a
-- product. The FOR UPDATE row lock makes this race-safe under concurrent
-- checkouts. Returns fewer numbers than requested if the edition sells
-- out mid-checkout, or NULL if product_id isn't tracked (not limited).
CREATE OR REPLACE FUNCTION claim_edition_numbers(p_product_id TEXT, p_quantity INTEGER)
RETURNS INTEGER[] AS $$
DECLARE
  v_sold INTEGER;
  v_size INTEGER;
  v_grant INTEGER;
  v_numbers INTEGER[];
BEGIN
  SELECT sold_count, edition_size INTO v_sold, v_size
  FROM print_editions WHERE product_id = p_product_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  v_grant := LEAST(p_quantity, v_size - v_sold);
  IF v_grant <= 0 THEN
    RETURN ARRAY[]::INTEGER[];
  END IF;

  SELECT ARRAY(SELECT generate_series(v_sold + 1, v_sold + v_grant)) INTO v_numbers;

  UPDATE print_editions SET sold_count = sold_count + v_grant, updated_at = now()
    WHERE product_id = p_product_id;

  RETURN v_numbers;
END;
$$ LANGUAGE plpgsql;

-- Seed the current 8-print collection (safe to re-run; won't reset counts)
INSERT INTO print_editions (product_id, edition_size) VALUES
  ('shop-06', 30),
  ('shop-09', 30),
  ('shop-10', 30),
  ('shop-14', 30),
  ('shop-17', 30),
  ('shop-19', 30),
  ('shop-21', 10),
  ('shop-25', 10)
ON CONFLICT (product_id) DO NOTHING;
