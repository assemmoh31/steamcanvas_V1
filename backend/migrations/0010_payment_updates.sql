-- Migration number: 0010 	 2024-02-05T02:00:00.000Z

-- Add payment intent to coin_purchases for better refund tracking
ALTER TABLE coin_purchases ADD COLUMN payment_intent_id TEXT;

-- Add metadata to Transactions for linking back to source (e.g. Stripe ID, Purchase ID)
ALTER TABLE Transactions ADD COLUMN meta_data TEXT;
