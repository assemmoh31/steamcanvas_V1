
import { Hono } from 'hono';
import { adminCheck, authMiddleware } from '../middleware/auth';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

type Bindings = {
    STEAMCANVAS_DB: D1Database;
    STEAMCANVAS_ASSETS: R2Bucket; // Though not strictly needed here unless we validate keys
};

type Variables = {
    user: any;
};

const adminBanners = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// List all banners
adminBanners.get('/banners', authMiddleware, adminCheck, async (c) => {
    try {
        const { results } = await c.env.STEAMCANVAS_DB.prepare(
            'SELECT * FROM partnership_banners ORDER BY priority DESC, created_at DESC'
        ).all();

        const bannersWithStats = results.map((b: any) => {
            const impressions = b.impressions || 0;
            const clicks = b.clicks || 0;
            const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
            return { ...b, ctr };
        });

        return c.json(bannersWithStats);
    } catch (error) {
        console.error('Failed to fetch banners:', error);
        return c.json({ error: 'Failed to fetch banners' }, 500);
    }
});

// Create a banner
adminBanners.post('/banners', authMiddleware, adminCheck, async (c) => {
    try {
        const body = await c.req.json();
        const { media_url, redirect_url, priority, is_active } = body;

        if (!media_url) {
            return c.json({ error: 'Missing media_url' }, 400);
        }

        const result = await c.env.STEAMCANVAS_DB.prepare(
            'INSERT INTO partnership_banners (media_url, redirect_url, priority, is_active) VALUES (?, ?, ?, ?)'
        ).bind(
            media_url,
            redirect_url || null,
            priority || 0,
            is_active !== undefined ? (is_active ? 1 : 0) : 1
        ).run();

        return c.json({ success: true, id: result.meta.last_row_id });
    } catch (error) {
        console.error('Create banner failed:', error);
        return c.json({ error: 'Failed to create banner' }, 500);
    }
});

// Update banner
adminBanners.patch('/banners/:id', authMiddleware, adminCheck, async (c) => {
    const id = c.req.param('id');
    try {
        const body = await c.req.json();
        const { media_url, redirect_url, priority, is_active } = body;

        // Build dynamic query
        const updates: string[] = [];
        const values: any[] = [];

        if (media_url !== undefined) { updates.push('media_url = ?'); values.push(media_url); }
        if (redirect_url !== undefined) { updates.push('redirect_url = ?'); values.push(redirect_url); }
        if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
        if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active ? 1 : 0); }

        if (updates.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        values.push(id);

        await c.env.STEAMCANVAS_DB.prepare(
            `UPDATE partnership_banners SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('Update banner failed:', error);
        return c.json({ error: 'Failed to update banner' }, 500);
    }
});

// Delete banner
adminBanners.delete('/banners/:id', authMiddleware, adminCheck, async (c) => {
    const id = c.req.param('id');
    try {
        await c.env.STEAMCANVAS_DB.prepare('DELETE FROM partnership_banners WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error) {
        console.error('Delete banner failed:', error);
        return c.json({ error: 'Failed to delete banner' }, 500);
    }
});

// Update Global Config
adminBanners.patch('/config', authMiddleware, adminCheck, async (c) => {
    try {
        const body = await c.req.json();
        const { global_ads_enabled, banner_injection_interval } = body;

        const batch = [];

        if (global_ads_enabled !== undefined) {
            batch.push(
                c.env.STEAMCANVAS_DB.prepare(
                    "INSERT INTO platform_configs (key, value) VALUES ('global_ads_enabled', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
                ).bind(String(global_ads_enabled))
            );
        }

        if (banner_injection_interval !== undefined) {
            batch.push(
                c.env.STEAMCANVAS_DB.prepare(
                    "INSERT INTO platform_configs (key, value) VALUES ('banner_injection_interval', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
                ).bind(String(banner_injection_interval))
            );
        }

        if (batch.length > 0) {
            await c.env.STEAMCANVAS_DB.batch(batch);
        }

        return c.json({ success: true });
    } catch (error) {
        console.error('Update config failed:', error);
        return c.json({ error: 'Failed to update config' }, 500);
    }
});

export default adminBanners;
