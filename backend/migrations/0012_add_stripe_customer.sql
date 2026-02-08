-- Migration number: 0012 	 2026-02-07T14:40:00.000Z

ALTER TABLE Users ADD COLUMN stripe_customer_id TEXT;
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON Users(stripe_customer_id);
