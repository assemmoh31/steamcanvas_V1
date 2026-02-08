-- Create table for Partnership Banners
CREATE TABLE IF NOT EXISTS partnership_banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_url TEXT NOT NULL,
    redirect_url TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Platform Configurations
CREATE TABLE IF NOT EXISTS platform_configs (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed initial platform configuration
INSERT OR IGNORE INTO platform_configs (key, value) VALUES ('global_ads_enabled', 'true');
INSERT OR IGNORE INTO platform_configs (key, value) VALUES ('banner_injection_interval', '15');
