
import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import type { D1Database } from '@cloudflare/workers-types';

type Bindings = {
    STEAMCANVAS_DB: D1Database;
    JWT_SECRET: string;
};

type Variables = {
    user: any;
};

const banners = new Hono<{ Bindings: Bindings, Variables: Variables }>();

banners.get('/banners', async (c) => {
    let adsEnabled = true;
    let userId: string | null = null;

    // 1. Check Authorization (Optional)
    const authHeader = c.req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
            userId = payload.sub as string;
        } catch (e) {
            // Invalid token, treat as guest (ads enabled)
        }
    }

    // 2. Check Plan Tier if User is Logged In
    if (userId) {
        try {
            const user = await c.env.STEAMCANVAS_DB.prepare(
                'SELECT plan_tier FROM Users WHERE steam_id = ?'
            ).bind(userId).first();

            if (user && user.plan_tier && (user.plan_tier as string).toUpperCase() !== 'FREE') {
                adsEnabled = false;
            }
        } catch (e) {
            console.error('Plan check failed', e);
        }
    }

    // If already disabled by plan, return early
    if (!adsEnabled) {
        return c.json({ ads_enabled: false });
    }

    // 3. Check Global Config
    try {
        const configs = await c.env.STEAMCANVAS_DB.prepare(
            "SELECT key, value FROM platform_configs WHERE key IN ('global_ads_enabled', 'banner_injection_interval')"
        ).all();

        const configMap = new Map(configs.results.map((r: any) => [r.key, r.value]));

        if (configMap.get('global_ads_enabled') === 'false') {
            return c.json({ ads_enabled: false });
        }

        const interval = parseInt(configMap.get('banner_injection_interval') as string || '15', 10);

        // 4. Fetch Active Banners
        const bannersResult = await c.env.STEAMCANVAS_DB.prepare(
            'SELECT id, media_url, redirect_url, priority FROM partnership_banners WHERE is_active = 1 ORDER BY priority DESC'
        ).all();

        return c.json({
            ads_enabled: true,
            interval: interval,
            banners: bannersResult.results
        });

    } catch (error) {
        console.error('Failed to fetch banners/config:', error);
        return c.json({ error: 'Failed' }, 500);
    }
});


// Track Banner View
banners.post('/banners/:id/view', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.STEAMCANVAS_DB.prepare(
            'UPDATE partnership_banners SET impressions = impressions + 1 WHERE id = ?'
        ).bind(id).run();
        return c.json({ success: true });
    } catch (error) {
        console.error('Failed to track view:', error);
        return c.json({ error: 'Failed' }, 500);
    }
});

// Track Banner Click
banners.post('/banners/:id/click', async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.STEAMCANVAS_DB.prepare(
            'UPDATE partnership_banners SET clicks = clicks + 1 WHERE id = ?'
        ).bind(id).run();
        return c.json({ success: true });
    } catch (error) {
        console.error('Failed to track click:', error);
        return c.json({ error: 'Failed' }, 500);
    }
});

export default banners;
