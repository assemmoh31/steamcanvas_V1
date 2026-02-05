import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { sign } from 'hono/jwt';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { buildSteamAuthUrl, verifySteamAssertion, getSteamUserSummary } from './auth';
import { authMiddleware } from './middleware/auth';
import payments from './payments';

type Bindings = {
    STEAMCANVAS_DB: D1Database;
    STEAMCANVAS_ASSETS: R2Bucket;
    STEAM_API_KEY: string;
    JWT_SECRET: string;
    FRONTEND_URL: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;

    R2_ACCOUNT_ID: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS Middleware
app.use('/*', cors({
    origin: (origin) => {
        if (!origin) return 'http://localhost:3000'; // Fallback

        // Allow Localhost
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return origin;
        }

        // Allow Cloudflare Pages (Production & Previews)
        if (origin.endsWith('.pages.dev')) {
            return origin;
        }

        return 'http://localhost:3000';
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

// Root route
app.get('/', (c) => {
    return c.text('SteamCanvas Backend is Running!');
});

// Health Check Route
app.get('/health', async (c) => {
    try {
        // Check D1 connection by running a simple query
        const result = await c.env.STEAMCANVAS_DB.prepare('SELECT 1').first();

        if (result && result['1'] === 1) {
            return c.json({
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('Unexpected database result');
        }

    } catch (error) {
        console.error('Health check failed:', error);
        return c.json({
            status: 'error',
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, 500);
    }
});

// Get Artworks (Public Gallery - Approved Only)
app.get('/api/v1/artworks', async (c) => {
    try {
        // Return APPROVED artworks. 
        // Optional: We could also let creators see their OWN pending artworks if we verified the token here.
        // For now, simple public filter.
        const { results } = await c.env.STEAMCANVAS_DB.prepare("SELECT * FROM Artworks WHERE status = 'APPROVED' ORDER BY created_at DESC").all();
        return c.json(results);
    } catch (error) {
        console.error('Failed to fetch artworks:', error);
        return c.json({ error: 'Failed to fetch artworks' }, 500);
    }
});

// Payment Routes
app.route('/api/v1/payments', payments);

// ... (Auth routes remain the same) ...

// --- ADMIN ROUTES ---

// Middleware helper for Admin check
const adminCheck = async (c: any, next: any) => {
    const user = c.get('user');
    // Check if user is admin in DB
    const dbUser = await c.env.STEAMCANVAS_DB.prepare('SELECT is_admin FROM Users WHERE steam_id = ?').bind(user.sub).first();

    if (!dbUser || !dbUser.is_admin) {
        return c.json({ error: 'Unauthorized: Admin access required' }, 403);
    }
    await next();
};

const createNotification = async (db: D1Database, userId: string, type: string, title: string, description: string, meta: string | null = null) => {
    try {
        await db.prepare(`
            INSERT INTO Notifications (user_steam_id, type, title, description, meta_data) 
            VALUES (?, ?, ?, ?, ?)
        `).bind(userId, type, title, description, meta).run();
    } catch (e) {
        console.error('Failed to create notification', e);
    }
};

// Admin: Get Pending Artworks
app.get('/api/v1/admin/pending', authMiddleware, adminCheck, async (c) => {
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT Artworks.*, Users.username as creator_name, Users.avatar_url as creator_avatar 
            FROM Artworks 
            LEFT JOIN Users ON Artworks.creator_id = Users.steam_id 
            WHERE Artworks.status = 'PENDING' 
            ORDER BY Artworks.created_at ASC
        `).all();
        return c.json(results);
    } catch (error) {
        return c.json({ error: 'Failed to fetch pending queue' }, 500);
    }
});

// ... (other methods) ...

// Protected Route: Finalize Upload (Save Metadata)
app.post('/api/v1/assets/finalize', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const body = await c.req.json();

    const {
        title, description, price, tags, dominantColors,
        isAiGenerated, previewKey, sourceKey, category
    } = body;

    if (!title || !previewKey || !sourceKey) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    const artworkId = `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const creatorId = user.sub;

    // Use Worker Proxy URL for preview images to ensure they load
    const url = new URL(c.req.url);
    let origin = url.origin;

    // FIX PREVIEW: Force localhost origin if running locally
    if (c.env.FRONTEND_URL.includes('localhost') && c.req.url.includes('localhost')) {
        origin = 'http://localhost:8787';
    } else {
        // In production, trust the worker's URL
        origin = new URL(c.req.url).origin;
    }

    const imageUrl = `${origin}/api/v1/assets/public/${previewKey}`;

    try {
        await c.env.STEAMCANVAS_DB.prepare(`
            INSERT INTO Artworks (
                id, title, description, price, creator_id, preview_url, 
                category, tags, dominant_colors, is_ai_generated, 
                preview_key, source_key, author_type, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP)
        `).bind(
            artworkId, title, description, price, creatorId, imageUrl,
            category || 'artwork',
            JSON.stringify(tags || []),
            JSON.stringify(dominantColors || []),
            isAiGenerated ? 1 : 0,
            previewKey, sourceKey,
            isAiGenerated ? 'AI' : 'HUMAN'
        ).run();

        return c.json({ success: true, artworkId });
    } catch (error: any) {
        console.error('Finalize Error:', error);
        return c.json({ error: 'Failed to save artwork', details: error.message }, 500);
    }
});

// Admin: Approve Artwork
app.patch('/api/v1/admin/approve/:id', authMiddleware, adminCheck, async (c) => {
    const artworkId = c.req.param('id');
    try {
        await c.env.STEAMCANVAS_DB.prepare("UPDATE Artworks SET status = 'APPROVED' WHERE id = ?").bind(artworkId).run();
        const artwork = await c.env.STEAMCANVAS_DB.prepare('SELECT creator_id FROM Artworks WHERE id = ?').bind(artworkId).first();
        if (artwork) {
            await c.env.STEAMCANVAS_DB.prepare("UPDATE Users SET total_sales = total_sales + 50 WHERE steam_id = ?").bind(artwork.creator_id).run();
            // Notify Creator
            await createNotification(c.env.STEAMCANVAS_DB, artwork.creator_id as string, 'system', 'Artwork Approved', 'Your artwork has been approved and is now live on the marketplace.');
        }
        return c.json({ success: true, message: 'Artwork Approved' });
    } catch (error) {
        console.error('Approval Error:', error);
        return c.json({ error: 'Approval failed' }, 500);
    }
});

// Admin: Reject Artwork
app.patch('/api/v1/admin/reject/:id', authMiddleware, adminCheck, async (c) => {
    const artworkId = c.req.param('id');
    let reason = 'No reason provided';

    try {
        const body = await c.req.json();
        if (body.reason) reason = body.reason;
    } catch (e) {
        // Body might be empty, use default
    }

    try {
        // 1. Get Creator ID for Notification
        const artwork = await c.env.STEAMCANVAS_DB.prepare('SELECT creator_id FROM Artworks WHERE id = ?').bind(artworkId).first();

        // 2. Placeholder: Internal Notification Service
        // 2. Notification
        if (artwork) {
            await createNotification(c.env.STEAMCANVAS_DB, artwork.creator_id as string, 'system', 'Artwork Rejected', `Your artwork was rejected. Reason: ${reason}`);
        }

        // 3. Update DB
        await c.env.STEAMCANVAS_DB.prepare("UPDATE Artworks SET status = 'REJECTED', rejection_reason = ? WHERE id = ?")
            .bind(reason, artworkId)
            .run();

        return c.json({ success: true, message: 'Artwork Rejected' });
    } catch (error) {
        console.error('Rejection Error:', error);
        return c.json({ error: 'Rejection failed' }, 500);
    }
});

// Admin: Inspect Artwork (Get Source Link)
app.get('/api/v1/admin/artwork/:id/inspect', authMiddleware, adminCheck, async (c) => {
    const id = c.req.param('id');

    try {
        const artwork = await c.env.STEAMCANVAS_DB.prepare('SELECT * FROM Artworks WHERE id = ?').bind(id).first();
        if (!artwork) return c.json({ error: 'Artwork not found' }, 404);

        if (!artwork.source_key) return c.json({ error: 'Source key missing' }, 404);

        // Init S3 Client
        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: c.env.R2_ACCESS_KEY_ID,
                secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
            },
        });

        // Generate Presigned URL
        const command = new GetObjectCommand({
            Bucket: c.env.R2_BUCKET_NAME,
            Key: artwork.source_key as string,
        });

        const url = await getSignedUrl(S3, command, { expiresIn: 900 }); // 15 mins

        return c.json({
            ...artwork,
            signedSourceUrl: url
        });

    } catch (e: any) {
        console.error('Inspect Error:', e);
        return c.json({ error: 'Failed to generate inspect link', details: e.message }, 500);
    }
});



// Creator: Get My Stats
app.get('/api/v1/creator/stats', authMiddleware, async (c) => {
    const user = c.get('user');
    const steamId = user.sub;

    try {
        // 1. Total Sales & Active Listings from DB
        const totalSalesResult = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT COUNT(*) as total_sales 
            FROM Inventory 
            JOIN Artworks ON Inventory.artwork_id = Artworks.id 
            WHERE Artworks.creator_id = ?
        `).bind(steamId).first();

        const activeListingsResult = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT COUNT(*) as active_listings 
            FROM Artworks 
            WHERE creator_id = ? AND status = 'APPROVED'
        `).bind(steamId).first();

        // 2. Revenue (Last 30 Days)
        // Note: Using current Artwork price. Ideally Inventory should store 'price_at_purchase'
        const revenue30dResult = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT SUM(Artworks.price) as revenue_30d
            FROM Inventory
            JOIN Artworks ON Inventory.artwork_id = Artworks.id
            WHERE Artworks.creator_id = ? 
            AND Inventory.purchased_at > datetime('now', '-30 days')
        `).bind(steamId).first();

        // 3. Store Rank (Based on total sales count compared to other users)
        // Count how many users have MORE sales than current user
        const mySales = (totalSalesResult?.total_sales as number) || 0;

        // We first need a way to count sales per user.
        // This query counts users who have sold MORE items than 'mySales'
        const rankResult = await c.env.STEAMCANVAS_DB.prepare(`
             SELECT COUNT(*) as rank_above
             FROM (
                SELECT Artworks.creator_id, COUNT(Inventory.id) as sales
                FROM Artworks
                JOIN Inventory ON Artworks.id = Inventory.artwork_id
                GROUP BY Artworks.creator_id
             ) as UserSales
             WHERE sales > ?
        `).bind(mySales).first();

        const rank = (rankResult?.rank_above as number || 0) + 1;

        // 4. Chart Data (Last 7 Days Revenue)
        const dailyRevenueResult = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT 
                strftime('%Y-%m-%d', Inventory.purchased_at) as date,
                SUM(Artworks.price) as daily_revenue
            FROM Inventory
            JOIN Artworks ON Inventory.artwork_id = Artworks.id
            WHERE Artworks.creator_id = ?
            AND Inventory.purchased_at > datetime('now', '-7 days')
            GROUP BY date
            ORDER BY date ASC
        `).bind(steamId).all();

        return c.json({
            total_sales: mySales,
            active_listings: activeListingsResult?.active_listings || 0,
            revenue_30d: revenue30dResult?.revenue_30d || 0,
            store_rank: rank,
            chart_data: dailyRevenueResult.results
        });

    } catch (error: any) {
        console.error('Stats Error:', error);
        return c.json({ error: 'Failed to fetch stats', details: error.message }, 500);
    }
});

// Creator: Get My Submissions
app.get('/api/v1/creator/submissions', authMiddleware, async (c) => {
    const user = c.get('user');
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT Artworks.*, 
            (SELECT COUNT(*) FROM Inventory WHERE Inventory.artwork_id = Artworks.id) as sales_count
            FROM Artworks 
            WHERE creator_id = ? 
            ORDER BY created_at DESC
        `).bind(user.sub).all();
        return c.json(results);
    } catch (error) {
        console.error('Fetch Submissions Error:', error);
        return c.json({ error: 'Failed to fetch submissions' }, 500);
    }
});

// Auth: Initiate Steam Login
app.get('/api/v1/auth/steam', (c) => {
    let realm = new URL(c.req.url).origin;
    const isProduction = c.req.url.includes('workers.dev');

    if (c.env.FRONTEND_URL.includes('localhost') && !isProduction) {
        realm = 'http://localhost:8787';
    }

    const returnUrl = `${realm}/api/v1/auth/steam/callback`;
    console.log(`[Auth] Initiating Steam Login. Realm: ${realm}, Return: ${returnUrl}`);
    return c.redirect(buildSteamAuthUrl(returnUrl, realm));
});

// Auth: Handle Steam Callback
app.get('/api/v1/auth/steam/callback', async (c) => {
    try {
        const url = new URL(c.req.url);
        const steamId = await verifySteamAssertion(url.searchParams);

        if (!steamId) {
            return c.json({ error: 'Invalid Steam Assertion' }, 401);
        }

        const profile = await getSteamUserSummary(steamId, c.env.STEAM_API_KEY);
        const username = profile?.personaname || `User_${steamId}`;
        const avatarUrl = profile?.avatarfull || '';

        await c.env.STEAMCANVAS_DB.prepare(`
            INSERT INTO Users (steam_id, username, avatar_url) 
            VALUES (?, ?, ?)
            ON CONFLICT(steam_id) DO UPDATE SET 
                username = excluded.username,
                avatar_url = excluded.avatar_url
        `).bind(steamId, username, avatarUrl).run();

        const token = await sign({
            sub: steamId,
            name: username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }, c.env.JWT_SECRET);

        let frontendUrl = c.env.FRONTEND_URL;
        if (c.req.url.includes('workers.dev')) {
            frontendUrl = 'https://steamcanvas.pages.dev';
        }

        return c.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
        console.error('Auth Error:', error);
        return c.json({ error: 'Authentication failed' }, 500);
    }
});

// Protected Route: Get User Profile
app.get('/api/v1/user/profile', authMiddleware, async (c) => {
    const user = c.get('user') as any; // Injected by authMiddleware
    const steamId = user.sub;

    const result = await c.env.STEAMCANVAS_DB.prepare(
        'SELECT * FROM Users WHERE steam_id = ?'
    ).bind(steamId).first();

    if (!result) {
        return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
        id: result.id,
        steamId: result.steam_id,
        username: result.username,
        avatarUrl: result.avatar_url,
        purchaseCoins: result.balance || 0,
        creatorCoins: 0, // Placeholder for future feature
        status: 'Member' // Placeholder
    });
});

// Protected Route: Get User Inventory (Owned Artwork IDs)
app.get('/api/v1/user/inventory', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const steamId = user.sub;

    try {
        const result = await c.env.STEAMCANVAS_DB.prepare(
            'SELECT artwork_id FROM Inventory WHERE user_steam_id = ?'
        ).bind(steamId).all();

        const ownedIds = result.results.map((r: any) => r.artwork_id);
        return c.json({ ownedIds });
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        return c.json({ error: 'Failed to fetch inventory' }, 500);
    }
});

// Protected Route: Get Transaction History
app.get('/api/v1/user/transactions', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT * FROM Transactions 
            WHERE user_id = (SELECT id FROM Users WHERE steam_id = ?) 
            ORDER BY created_at DESC 
            LIMIT 50
        `).bind(user.sub).all();
        return c.json(results);
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return c.json({ error: 'Failed to fetch transactions' }, 500);
    }
});

// Protected Route: Get Notifications
app.get('/api/v1/notifications', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT * FROM Notifications WHERE user_steam_id = ? ORDER BY created_at DESC LIMIT 50
        `).bind(user.sub).all();

        // Map DB fields to frontend expected format if needed, but simplistic mapping here
        const notifications = results.map((n: any) => ({
            id: n.id.toString(),
            type: n.type,
            title: n.title,
            description: n.description,
            time: n.created_at, // Frontend will format
            isUnread: !n.is_read,
            meta: n.meta_data
        }));

        return c.json(notifications);
    } catch (error) {
        return c.json({ error: 'Failed to fetch notifications' }, 500);
    }
});

// Protected Route: Mark Notification Read
app.put('/api/v1/notifications/:id/read', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const id = c.req.param('id');
    try {
        // Verify ownership
        const res = await c.env.STEAMCANVAS_DB.prepare("UPDATE Notifications SET is_read = 1 WHERE id = ? AND user_steam_id = ?").bind(id, user.sub).run();
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: 'Failed' }, 500);
    }
});

// Protected Route: Mark ALL Notifications Read
app.put('/api/v1/notifications/read-all', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    try {
        await c.env.STEAMCANVAS_DB.prepare("UPDATE Notifications SET is_read = 1 WHERE user_steam_id = ?").bind(user.sub).run();
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: 'Failed' }, 500);
    }
});

// Protected Route: Clear All Notifications
app.delete('/api/v1/notifications', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    try {
        await c.env.STEAMCANVAS_DB.prepare("DELETE FROM Notifications WHERE user_steam_id = ?").bind(user.sub).run();
        return c.json({ success: true });
    } catch (error) {
        return c.json({ error: 'Failed' }, 500);
    }
});

// Debug: Send Self Notification
app.post('/api/v1/debug/notify', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const { type, title, description, meta } = await c.req.json();
    await createNotification(c.env.STEAMCANVAS_DB, user.sub, type, title, description, meta);
    return c.json({ success: true });
});

// Protected Route: Purchase Artwork
app.post('/api/v1/purchase', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const buyerSteamId = user.sub;

    // Parse Body
    let body;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ error: 'Invalid JSON body' }, 400);
    }
    const { artworkId } = body;

    if (!artworkId) {
        return c.json({ error: 'Missing artworkId' }, 400);
    }

    // 1. Fetch Buyer (Need internal Integer ID for Transactions table)
    const buyer = await c.env.STEAMCANVAS_DB.prepare('SELECT id, balance, username FROM Users WHERE steam_id = ?').bind(buyerSteamId).first();
    if (!buyer) return c.json({ error: 'Buyer not found' }, 404);

    // 2. Fetch Artwork & Creator
    const artwork = await c.env.STEAMCANVAS_DB.prepare(`
        SELECT Artworks.*, Users.id as creator_uid 
        FROM Artworks 
        JOIN Users ON Artworks.creator_id = Users.steam_id 
        WHERE Artworks.id = ?
    `).bind(artworkId).first();

    if (!artwork) return c.json({ error: 'Artwork not found' }, 404);

    const price = artwork.price as number;
    const creatorUid = artwork.creator_uid as number;

    // 3. Check Balance
    if ((buyer.balance as number) < price) {
        return c.json({ error: 'Insufficient funds' }, 400);
    }

    // 4. Calculate Split (15% platform fee)
    const platformFee = Math.floor(price * 0.15);
    const creatorShare = price - platformFee;

    // 5. Execute Transaction (Atomic Batch)
    try {
        const batch = [
            // Deduct from Buyer
            c.env.STEAMCANVAS_DB.prepare('UPDATE Users SET balance = balance - ? WHERE id = ?').bind(price, buyer.id),

            // Credit Logic (Only if price > 0)
            ...(price > 0 ? [
                // Add to Creator
                c.env.STEAMCANVAS_DB.prepare('UPDATE Users SET balance = balance + ? WHERE id = ?').bind(creatorShare, creatorUid)
            ] : []),

            // Record Transaction (Sale)
            c.env.STEAMCANVAS_DB.prepare(`
                INSERT INTO Transactions (user_id, amount, type, status, created_at) 
                VALUES (?, ?, 'PURCHASE', 'COMPLETED', CURRENT_TIMESTAMP)
            `).bind(buyer.id, price),

            // Record Ownership (Inventory)
            c.env.STEAMCANVAS_DB.prepare(`
                INSERT INTO Inventory (user_steam_id, artwork_id) VALUES (?, ?)
            `).bind(buyerSteamId, artworkId),

            // Notify Creator
            c.env.STEAMCANVAS_DB.prepare(`
                INSERT INTO Notifications (user_steam_id, type, title, description, meta_data) 
                VALUES (?, 'sale', 'Item Sold!', ?, ?)
            `).bind(artwork.creator_id, `${buyer.username || 'Someone'} purchased your "${artwork.title}" artwork.`, `+${creatorShare} CC`)
        ];

        await c.env.STEAMCANVAS_DB.batch(batch);

        return c.json({
            success: true,
            message: 'Purchase successful',
            newBalance: (buyer.balance as number) - price
        });

    } catch (error: any) {
        // Constraint violation handled above
        console.error('Purchase Failed:', error);
        return c.json({ error: 'Transaction failed', details: error.message }, 500);
    }
});

// --- ASSET UPLOAD ENGINE ---

// Helper to check if we should use S3 or Proxy
// For this MVP, we default to Proxy to avoid AWS Credential complexity for the user.

// Protected Route: Upload Intent (Generate Upload URLs)
app.post('/api/v1/assets/upload-intent', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const body = await c.req.json();
    const { previewMetadata, sourceMetadata } = body;

    if (!previewMetadata || !sourceMetadata) {
        return c.json({ error: 'Missing metadata for preview or source' }, 400);
    }

    const timestamp = Date.now();

    // Generate Keys
    const previewKey = `previews/${user.sub}/${timestamp}_${previewMetadata.name}`;
    const sourceKey = `vault/${user.sub}/${timestamp}_${sourceMetadata.name}`;

    // Construct Proxy URLs (pointing to this Worker)
    const url = new URL(c.req.url);
    let origin = url.origin;

    // FIX: If running locally, force localhost origin to ensure the frontend can reach the upload proxy
    if (c.env.FRONTEND_URL.includes('localhost')) {
        origin = 'http://localhost:8787';
    }

    const previewUrl = `${origin}/api/v1/assets/upload?key=${encodeURIComponent(previewKey)}&type=${encodeURIComponent(previewMetadata.type)}`;
    const sourceUrl = `${origin}/api/v1/assets/upload?key=${encodeURIComponent(sourceKey)}&type=${encodeURIComponent(sourceMetadata.type)}`;

    return c.json({
        preview: { url: previewUrl, key: previewKey },
        source: { url: sourceUrl, key: sourceKey },
        uploadId: `${timestamp}`
    });
});

// Protected Route: Proxy Upload (Handle PUT from Frontend)
app.put('/api/v1/assets/upload', authMiddleware, async (c) => {
    const key = c.req.query('key');
    const type = c.req.query('type');

    if (!key) return c.json({ error: 'Missing key' }, 400);

    // Debug logging
    console.log(`[Upload] Starting upload for key: ${key}, type: ${type}`);
    console.log(`[Upload] Body size header: ${c.req.header('content-length')}`);

    try {
        await c.env.STEAMCANVAS_ASSETS.put(key, c.req.raw.body, {
            httpMetadata: {
                contentType: type || 'application/octet-stream',
            }
        });
        console.log(`[Upload] Success: ${key}`);
        return c.json({ success: true });
    } catch (error: any) {
        console.error('R2 Upload Error:', error);
        return c.json({ error: 'Upload failed', details: error.message }, 500);
    }
});

// New Route: Serve Public Assets (Images)
app.get('/api/v1/assets/public/:key{.+}', async (c) => {
    const key = c.req.param('key');
    console.log(`[Asset] Requesting key: ${key}`);

    try {
        const object = await c.env.STEAMCANVAS_ASSETS.get(key);

        if (!object) {
            console.log(`[Asset] Not found: ${key}`);
            return c.text('Not Found', 404);
        }

        console.log(`[Asset] Found. Size: ${object.size}, Etag: ${object.httpEtag}`);

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        // Force inline display for images
        if (object.httpMetadata?.contentType?.startsWith('image/')) {
            headers.set('Content-Disposition', 'inline');
        }

        return new Response(object.body, {
            headers,
        });
    } catch (error) {
        console.error('Asset Fetch Error:', error);
        return c.text('Internal Error', 500);
    }
});



// Public Route: Search & Discovery
app.get('/api/v1/artworks/search', async (c) => {
    const { q, tags, ai, sort } = c.req.query();

    let query = `
        SELECT Artworks.*, Users.username as creator_name, Users.avatar_url as creator_avatar 
        FROM Artworks 
        LEFT JOIN Users ON Artworks.creator_id = Users.steam_id 
        WHERE 1=1
    `;
    const params: any[] = [];

    if (q) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${q}%`, `%${q}%`);
    }

    if (ai === 'false') {
        query += ' AND is_ai_generated = 0';
    } else if (ai === 'true') {
        query += ' AND is_ai_generated = 1';
    }

    if (sort === 'price_asc') {
        query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
        query += ' ORDER BY price DESC';
    } else {
        query += ' ORDER BY created_at DESC';
    }

    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(query).bind(...params).all();
        return c.json(results);
    } catch (error) {
        return c.json({ error: 'Search failed' }, 500);
    }
});

// --- REPORTING SYSTEM ---

// Submit a Report
app.post('/api/v1/reports', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const { artworkId, reason, description } = await c.req.json();

    if (!artworkId || !reason) {
        return c.json({ error: 'Missing required fields' }, 400);
    }

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
        // Ensure Table Exists (Auto-Migration for Dev)
        await c.env.STEAMCANVAS_DB.prepare(`
            CREATE TABLE IF NOT EXISTS Reports (
                id TEXT PRIMARY KEY,
                reporter_id TEXT NOT NULL,
                artwork_id TEXT NOT NULL,
                reason TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'PENDING',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();

        // Insert Report
        await c.env.STEAMCANVAS_DB.prepare(`
            INSERT INTO Reports (id, reporter_id, artwork_id, reason, description)
            VALUES (?, ?, ?, ?, ?)
        `).bind(reportId, user.sub, artworkId, reason, description).run();

        return c.json({ success: true, reportId });
    } catch (error: any) {
        console.error('Report Error:', error);
        return c.json({ error: 'Failed to submit report', details: error.message }, 500);
    }
});

// Admin: Get All Reports
app.get('/api/v1/admin/reports', authMiddleware, adminCheck, async (c) => {
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT 
                Reports.*,
                Reporter.username as reporter_name,
                Reporter.avatar_url as reporter_avatar,
                Artworks.title as artwork_title,
                Artworks.preview_url as artwork_preview,
                Creator.username as creator_name,
                Creator.steam_id as creator_id
            FROM Reports
            LEFT JOIN Users as Reporter ON Reports.reporter_id = Reporter.steam_id
            LEFT JOIN Artworks ON Reports.artwork_id = Artworks.id
            LEFT JOIN Users as Creator ON Artworks.creator_id = Creator.steam_id
            ORDER BY Reports.created_at DESC
        `).all();

        return c.json(results);
    } catch (error) {
        // If table doesn't exist yet, return empty list
        if (String(error).includes('no such table')) {
            return c.json([]);
        }
        console.error('Fetch Reports Error:', error);
        return c.json({ error: 'Failed to fetch reports' }, 500);
    }
});


export default app;
