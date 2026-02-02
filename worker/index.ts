// This worker handles the transaction logic for the economy.
// Assumes Cloudflare D1 is bound as `env.DB`

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta: any;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/buy-artwork') {
      return handlePurchase(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handlePurchase(request: Request, env: Env): Promise<Response> {
  try {
    const { buyerId, artworkId } = await request.json() as { buyerId: string; artworkId: string };

    // 1. Fetch Artwork to get price and creator
    const artwork = await env.DB.prepare(
      'SELECT id, price, creatorId FROM Artwork WHERE id = ?'
    ).bind(artworkId).first<{ id: string; price: number; creatorId: string }>();

    if (!artwork) {
      return new Response(JSON.stringify({ error: 'Artwork not found' }), { status: 404 });
    }

    // 2. Fetch Buyer to check balance
    const buyer = await env.DB.prepare(
      'SELECT id, purchaseCoins FROM User WHERE id = ?'
    ).bind(buyerId).first<{ id: string; purchaseCoins: number }>();

    if (!buyer) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (buyer.purchaseCoins < artwork.price) {
      return new Response(JSON.stringify({ error: 'Insufficient funds' }), { status: 400 });
    }

    // 3. ATOMIC TRANSACTION
    // D1 supports batching, which acts like a transaction for simple sequences
    
    // a. Deduct Coin A from Buyer
    const deductStmt = env.DB.prepare(
      'UPDATE User SET purchaseCoins = purchaseCoins - ? WHERE id = ?'
    ).bind(artwork.price, buyerId);

    // b. Add Coin B (Creator Coins) to Seller (Creator)
    const creditStmt = env.DB.prepare(
      'UPDATE User SET creatorCoins = creatorCoins + ? WHERE id = ?'
    ).bind(artwork.price, artwork.creatorId);

    // c. Record Transaction
    const recordStmt = env.DB.prepare(
      'INSERT INTO Transaction (id, amount, type, buyerId, sellerId, artworkId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), artwork.price, 'PURCHASE', buyerId, artwork.creatorId, artworkId, new Date().toISOString());

    // Execute batch
    const batchResults = await env.DB.batch([deductStmt, creditStmt, recordStmt]);

    // Check for success (pseudo-check, D1 throws if batch fails usually)
    if (batchResults.length === 3) {
      return new Response(JSON.stringify({ success: true, message: 'Purchase successful' }), { status: 200 });
    } else {
        throw new Error("Batch execution failed");
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}