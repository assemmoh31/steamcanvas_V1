-- Migration number: 0002 	 2024-02-02T13:00:00.000Z

CREATE TABLE IF NOT EXISTS Artworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    preview_url TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    category TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(steam_id)
);

CREATE INDEX IF NOT EXISTS idx_artworks_creator_id ON Artworks(creator_id);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON Artworks(category);

-- Seed Data (Initial Creators)
INSERT OR IGNORE INTO Users (steam_id, username, avatar_url) VALUES 
('76561198000000001', 'NeonVibe', 'https://picsum.photos/100/100?random=1'),
('76561198000000002', 'SynthLord', 'https://picsum.photos/100/100?random=2'),
('76561198000000003', 'OtakuArt', 'https://picsum.photos/100/100?random=3');

-- Seed Data (Initial Artworks)
INSERT INTO Artworks (id, title, description, price, preview_url, creator_id, category, is_featured)
VALUES 
('art_1', 'Neon Cyberpunk City', 'A futuristic cityscape with neon lights.', 500, 'https://picsum.photos/400/300?random=1', '76561198000000001', 'Cyberpunk', TRUE),
('art_2', 'Abstract Dreamscape', 'Surreal shapes and colors.', 250, 'https://picsum.photos/400/300?random=2', '76561198000000002', 'Abstract', FALSE),
('art_3', 'Retro Glitch Anime', '90s anime aesthetic with glitch effects.', 800, 'https://picsum.photos/400/300?random=3', '76561198000000003', 'Anime', TRUE),
('art_4', 'Dark Fantasy Knight', 'A brooding knight in dark armor.', 1200, 'https://picsum.photos/400/300?random=4', '76561198000000001', 'Fantasy', FALSE),
('art_5', 'Vaporwave Sunset', 'Purple and orange aesthetic sunset.', 0, 'https://picsum.photos/400/300?random=5', '76561198000000002', 'Vaporwave', TRUE);
