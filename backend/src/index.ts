import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
    STEAMCANVAS_DB: D1Database;
    STEAMCANVAS_ASSETS: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS Middleware
app.use('/*', cors({
    origin: [
        'http://localhost:5173', // Local development
        'http://localhost:3000', // Local development (alternative)
        // Add your Cloudflare Pages URL here once deployed, e.g.:
        // 'https://steamcanvas.pages.dev' 
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE', 'PUT'],
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

export default app;
