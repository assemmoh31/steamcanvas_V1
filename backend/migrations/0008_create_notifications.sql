-- Migration number: 0008 	 2024-02-05T00:00:00.000Z

CREATE TABLE IF NOT EXISTS Notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_steam_id TEXT NOT NULL,
    type TEXT CHECK(type IN ('sale', 'like', 'follow', 'comment', 'system')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    meta_data TEXT, -- JSON string for extra data or null
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_steam_id) REFERENCES Users(steam_id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON Notifications(user_steam_id);
