
import { Hono } from 'hono';
import Stripe from 'stripe';
import { authMiddleware } from './middleware/auth';

const app = new Hono<{ Bindings: any }>();

// 1. Define Bundles
const COIN_PACKS: Record<string, { price: number; coins: number; bonus: number; stripePriceId?: string }> = {
    STARTER: { price: 599, coins: 500, bonus: 0 },
    POPULAR: { price: 1199, coins: 1100, bonus: 100 },
    PRO: { price: 2699, coins: 2750, bonus: 250 },
    COLLECTOR: { price: 5499, coins: 6000, bonus: 1000 },
    MASTER: { price: 9999, coins: 12000, bonus: 2000 }
};

// 2. Checkout Route
app.post('/create-session', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const body = await c.req.json();
    const { pack_name } = body;

    const pack = COIN_PACKS[pack_name];
    if (!pack) {
        return c.json({ error: 'Invalid pack name' }, 400);
    }

    if (!c.env.STRIPE_SECRET_KEY) {
        return c.json({ error: 'Stripe not configured' }, 500);
    }

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27.acacia', // Use latest or compatible version
    });

    try {
        // Get internal User ID
        const dbUser = await c.env.STEAMCANVAS_DB.prepare('SELECT id FROM Users WHERE steam_id = ?').bind(user.sub).first();
        if (!dbUser) return c.json({ error: 'User not found' }, 404);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `${pack.coins} SteamCanvas Coins`,
                            description: `+${pack.bonus} Bonus Coins Included`,
                        },
                        unit_amount: pack.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${c.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${c.env.FRONTEND_URL}/wallet`,
            metadata: {
                user_id: dbUser.id,
                steam_id: user.sub,
                pack_name: pack_name,
                coins_amount: pack.coins
            },
        });

        // Store Pending Purchase
        const purchaseId = `cp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await c.env.STEAMCANVAS_DB.prepare(`
            INSERT INTO coin_purchases (id, user_id, session_id, amount_coins, amount_price, pack_name, status)
            VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
        `).bind(purchaseId, dbUser.id, session.id, pack.coins, pack.price, pack_name).run();

        return c.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Session Error:', error);
        return c.json({ error: 'Failed to create checkout session', details: error.message }, 500);
    }
});

// Helper: Fulfill Purchase (Updates DB)
async function fulfillPurchase(db: D1Database, purchase: any, customPrice?: number) {
    if (purchase.status === 'COMPLETED') return true;

    const coinsToAdd = purchase.amount_coins;
    const userId = purchase.user_id;

    try {
        const batch = [
            // 1. Update Purchase Status
            db.prepare("UPDATE coin_purchases SET status = 'COMPLETED' WHERE id = ?").bind(purchase.id),

            // 2. Add Coins to User Balance
            db.prepare("UPDATE Users SET balance = balance + ? WHERE id = ?").bind(coinsToAdd, userId),

            // 3. Create Transaction Record
            db.prepare(`
                INSERT INTO Transactions (user_id, amount, type, status, meta_data) 
                VALUES (?, ?, 'DEPOSIT', 'COMPLETED', ?)
            `).bind(userId, coinsToAdd, JSON.stringify({ payment_intent_id: purchase.payment_intent_id, purchase_id: purchase.id }))
        ];

        await db.batch(batch);
        console.log(`[Fulfillment] Successfully fulfilled purchase ${purchase.id} for user ${userId}`);
        return true;
    } catch (error) {
        console.error('[Fulfillment] Database transaction failed:', error);
        return false;
    }
}

// 4. Verify Session (Fallback for Webhooks)
app.get('/verify-session', async (c) => {
    const sessionId = c.req.query('session_id');
    if (!sessionId) return c.json({ error: 'Missing session_id' }, 400);

    // 1. Check DB first
    const purchase = await c.env.STEAMCANVAS_DB.prepare('SELECT * FROM coin_purchases WHERE session_id = ?').bind(sessionId).first();

    if (!purchase) return c.json({ error: 'Purchase record not found' }, 404);
    if (purchase.status === 'COMPLETED') return c.json({ success: true, status: 'COMPLETED' });

    // 2. If PENDING, check with Stripe directly
    if (!c.env.STRIPE_SECRET_KEY) return c.json({ error: 'Stripe config missing' }, 500);
    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
            // Update purchase record with payment intent if missing (important for refunds!)
            if (!purchase.payment_intent_id && session.payment_intent) {
                await c.env.STEAMCANVAS_DB.prepare("UPDATE coin_purchases SET payment_intent_id = ? WHERE id = ?")
                    .bind(session.payment_intent, purchase.id).run();
                purchase.payment_intent_id = session.payment_intent; // Update local obj for fulfill
            }

            const success = await fulfillPurchase(c.env.STEAMCANVAS_DB, purchase);
            if (success) {
                return c.json({ success: true, status: 'COMPLETED', fulfilled_now: true });
            } else {
                return c.json({ error: 'Fulfillment failed' }, 500);
            }
        } else {
            return c.json({ success: false, status: session.payment_status });
        }
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 5. Refund Endpoint
app.post('/refund', authMiddleware, async (c) => {
    const user = c.get('user') as any;
    const body = await c.req.json();
    const { transactionId } = body;

    // 1. Fetch Transaction & User
    const transaction = await c.env.STEAMCANVAS_DB.prepare(`
        SELECT * FROM Transactions WHERE id = ?
    `).bind(transactionId).first();

    if (!transaction) return c.json({ error: 'Transaction not found' }, 404);

    // Verify Ownership (Need to fetch user internal ID first)
    const dbUser = await c.env.STEAMCANVAS_DB.prepare('SELECT id, balance FROM Users WHERE steam_id = ?').bind(user.sub).first();
    if (!dbUser || dbUser.id !== transaction.user_id) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    // 2. Eligibility Checks
    if (transaction.type !== 'DEPOSIT' || transaction.status !== 'COMPLETED') {
        return c.json({ error: 'Not eligible for refund' }, 400);
    }

    const txDate = new Date(transaction.created_at as string);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 14) {
        return c.json({ error: 'Refund period expired (14 days)' }, 400);
    }

    // 3. Balance Check (Ensure unused coins)
    if ((dbUser.balance as number) < (transaction.amount as number)) {
        return c.json({ error: 'Coins from this bundle have been used' }, 400);
    }

    // 4. Process Refund with Stripe
    const meta = JSON.parse((transaction.meta_data as string) || '{}');
    let paymentIntentId = meta.payment_intent_id;

    if (!paymentIntentId) {
        // Fallback: Try to find via coin_purchases if PI not in meta
        // We look for a completed coin_purchase for this user with the same amount
        console.log(`[Refund] Metadata missing PI. Searching coin_purchases for user ${dbUser.id} amount ${transaction.amount}`);

        const purchases = await c.env.STEAMCANVAS_DB.prepare(`
            SELECT * FROM coin_purchases 
            WHERE user_id = ? AND amount_coins = ? AND status = 'COMPLETED'
            ORDER BY created_at DESC
        `).bind(dbUser.id, transaction.amount).all();

        // Find the one closest in time (naive check: just take the most recent one that matches reasonably?)
        // Better: check if we can get PI from it.

        for (const p of purchases.results) {
            if (p.payment_intent_id) {
                paymentIntentId = p.payment_intent_id;
                meta.purchase_id = p.id;
                break;
            }
            // If no PI stored, we have session_id. Fetch from Stripe.
            if (p.session_id) {
                try {
                    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' });
                    const session = await stripe.checkout.sessions.retrieve(p.session_id as string);
                    if (session.payment_intent) {
                        paymentIntentId = session.payment_intent as string;
                        meta.purchase_id = p.id;

                        // Fix: Backfill DB
                        await c.env.STEAMCANVAS_DB.prepare("UPDATE coin_purchases SET payment_intent_id = ? WHERE id = ?")
                            .bind(paymentIntentId, p.id).run();
                        break;
                    }
                } catch (e) {
                    console.error(`[Refund] Failed to retrieve session ${p.session_id}`, e);
                }
            }
        }
    }

    if (!paymentIntentId) {
        return c.json({ error: 'Payment record missing and recovery failed' }, 500);
    }

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' });

    try {
        await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: 'requested_by_customer'
        });

        // 5. Update DB (Deduct Coins, Mark Refunded)
        const batch = [
            c.env.STEAMCANVAS_DB.prepare("UPDATE Users SET balance = balance - ? WHERE id = ?").bind(transaction.amount, dbUser.id),
            c.env.STEAMCANVAS_DB.prepare("UPDATE Transactions SET status = 'REFUNDED' WHERE id = ?").bind(transactionId),
            // Also update original coin_purchase if linked
            meta.purchase_id ? c.env.STEAMCANVAS_DB.prepare("UPDATE coin_purchases SET status = 'REFUNDED' WHERE id = ?").bind(meta.purchase_id) : null
        ].filter(Boolean); // Remove nulls

        await c.env.STEAMCANVAS_DB.batch(batch as any);

        return c.json({ success: true, message: 'Refund processed' });

    } catch (error: any) {
        console.error('Stripe Refund Error:', error);

        // Handle "Charge already refunded" case seamlessly
        if (error.message && error.message.includes('has already been refunded')) {
            console.log('[Refund] Charge was already refunded at Stripe. Syncing DB status.');

            const batch = [
                c.env.STEAMCANVAS_DB.prepare("UPDATE Transactions SET status = 'REFUNDED' WHERE id = ?").bind(transactionId),
                // Note: We don't deduct balance again if it was already "refunded" externally, 
                // BUT we don't know if we deducted balance yet. 
                // Safest is to NOT deduct balance here to avoid double deduction if it was done manually? 
                // OR, if it's "already refunded", maybe we should assume we missed the DB update and verify balance?
                // For now, let's just mark the status so the button goes away. 
                // If the user still has the coins, that's a separate "free money" edge case to solve via audit.
                meta.purchase_id ? c.env.STEAMCANVAS_DB.prepare("UPDATE coin_purchases SET status = 'REFUNDED' WHERE id = ?").bind(meta.purchase_id) : null
            ].filter(Boolean);

            await c.env.STEAMCANVAS_DB.batch(batch as any);
            return c.json({ success: true, message: 'Refund status synced (already processed)' });
        }

        return c.json({ error: 'Refund failed with provider', details: error.message }, 500);
    }
});

// 3. Webhook Handler
app.post('/webhook', async (c) => {
    const signature = c.req.header('stripe-signature');
    const body = await c.req.text();

    if (!c.env.STRIPE_WEBHOOK_SECRET || !c.env.STRIPE_SECRET_KEY) {
        console.error('Missing Stripe Config');
        return c.text('Configuration Error', 500);
    }

    const stripe = new Stripe(c.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-01-27.acacia',
    });

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature as string, c.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return c.text(`Webhook Error: ${err.message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;

        console.log(`[Webhook] Processing successful checkout: ${sessionId}`);

        // We can trust metadata, or look up via session_id in our DB.
        // Let's use our DB to be sure.
        const purchase = await c.env.STEAMCANVAS_DB.prepare('SELECT * FROM coin_purchases WHERE session_id = ?').bind(sessionId).first();

        if (!purchase) {
            console.error(`[Webhook] Purchase not found for session: ${sessionId}`);
            return c.text('Purchase Not Found', 404);
        }

        if (purchase.status === 'COMPLETED') {
            console.log(`[Webhook] Purchase already completed: ${sessionId}`);
            return c.json({ received: true });
        }

        await fulfillPurchase(c.env.STEAMCANVAS_DB, purchase);
    }

    return c.json({ received: true });
});

export default app;
