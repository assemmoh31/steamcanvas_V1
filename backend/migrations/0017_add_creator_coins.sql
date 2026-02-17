-- Add creator_balance column to Users table
ALTER TABLE Users ADD COLUMN creator_balance INTEGER DEFAULT 0;
