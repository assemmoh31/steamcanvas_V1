import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: Missing token' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
        c.set('user', payload); // { sub: steamId, name: username, exp: ... }
        await next();
    } catch (err: any) {
        console.error('Middleware Auth Error:', err);
        return c.json({ error: 'Unauthorized: Invalid token', cause: err.message }, 401);
    }
});
