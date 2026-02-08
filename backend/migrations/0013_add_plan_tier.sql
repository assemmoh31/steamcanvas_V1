-- Migration number: 0013 	 2026-02-07T14:50:00.000Z

-- Add plan_tier to Users table
ALTER TABLE Users ADD COLUMN plan_tier TEXT DEFAULT 'FREE';
