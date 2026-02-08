-- Add statistics columns to partnership_banners
ALTER TABLE partnership_banners ADD COLUMN impressions INTEGER DEFAULT 0;
ALTER TABLE partnership_banners ADD COLUMN clicks INTEGER DEFAULT 0;
