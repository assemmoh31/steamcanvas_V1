-- Migration number: 0011 	 2024-02-05T03:00:00.000Z

-- 1. Transactions Table Update
CREATE TABLE Transactions_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    type TEXT CHECK(type IN ('DEPOSIT', 'PURCHASE', 'WITHDRAWAL', 'REFUND')) NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    meta_data TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

INSERT INTO Transactions_new (id, user_id, amount, type, status, created_at, meta_data)
SELECT id, user_id, amount, type, status, created_at, meta_data FROM Transactions;

DROP TABLE Transactions;
ALTER TABLE Transactions_new RENAME TO Transactions;

CREATE INDEX idx_transactions_user_id ON Transactions(user_id);


-- 2. coin_purchases Table Update
CREATE TABLE coin_purchases_new (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    amount_coins INTEGER NOT NULL,
    amount_price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'eur',
    pack_name TEXT NOT NULL,
    status TEXT CHECK(status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_intent_id TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

INSERT INTO coin_purchases_new (id, user_id, session_id, amount_coins, amount_price, currency, pack_name, status, created_at, payment_intent_id)
SELECT id, user_id, session_id, amount_coins, amount_price, currency, pack_name, status, created_at, payment_intent_id FROM coin_purchases;

DROP TABLE coin_purchases;
ALTER TABLE coin_purchases_new RENAME TO coin_purchases;

CREATE INDEX idx_coin_purchases_session ON coin_purchases(session_id);
