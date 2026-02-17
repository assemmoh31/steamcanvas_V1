-- Add bio fields to Users table
ALTER TABLE Users ADD COLUMN bio_headline TEXT;
ALTER TABLE Users ADD COLUMN bio_content TEXT;
ALTER TABLE Users ADD COLUMN social_links TEXT; -- JSON string
ALTER TABLE Users ADD COLUMN creator_tools TEXT; -- Comma-separated list
