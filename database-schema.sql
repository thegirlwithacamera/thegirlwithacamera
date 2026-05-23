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
