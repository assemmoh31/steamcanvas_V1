-- Migration number: 0009 	 2024-02-05T01:00:00.000Z

CREATE TABLE IF NOT EXISTS coin_purchases (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    amount_coins INTEGER NOT NULL,
    amount_price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'eur',
    pack_name TEXT NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE INDEX IF NOT EXISTS idx_coin_purchases_session ON coin_purchases(session_id);
