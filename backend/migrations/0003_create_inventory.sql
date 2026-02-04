-- Migration number: 0003 	 2024-02-02T13:45:00.000Z

CREATE TABLE IF NOT EXISTS Inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id TEXT NOT NULL,
    artwork_id TEXT NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_steam_id) REFERENCES Users(steam_id),
    FOREIGN KEY (artwork_id) REFERENCES Artworks(id),
    UNIQUE(user_steam_id, artwork_id)
);

CREATE INDEX IF NOT EXISTS idx_inventory_user ON Inventory(user_steam_id);
