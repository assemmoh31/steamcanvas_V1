import { Hono } from 'hono';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = new Hono<{ Bindings: any }>();

app.get('/', async (c) => {
    const url = c.req.query('url');
    // Default to 75 as per prompt example "quality=75"
    const quality = c.req.query('quality') || '75';
    const format = c.req.query('format'); // 'original', 'webp', 'avif'
    const width = c.req.query('width');
    const height = c.req.query('height');
    const fit = c.req.query('fit') || 'scale-down'; // 'contain' or 'scale-down'

    if (!url) {
        return c.json({ error: 'Missing url parameter' }, 400);
    }

    // Construct Cloudflare Image Resizing options
    const imageOptions: any = {
        quality: parseInt(quality, 10),
        fit: fit as 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad',
    };

    // Handle Format
    if (format === 'webp') {
        imageOptions.format = 'webp';
        imageOptions.anim = true; // Ensure animation is preserved
    } else if (format === 'avif') {
        imageOptions.format = 'avif';
        imageOptions.anim = true;
    } else {
        // 'original' or 'gif' - Cloudflare usually preserves input format if not specified
        // But we can explicitly request gif if needed, though 'json' is better for metadata
        // For now, leave undefined to preserve original
    }

    // Handle Dimensions
    if (width) imageOptions.width = parseInt(width, 10);
    if (height) imageOptions.height = parseInt(height, 10);

    try {
        // Fetch with Cloudflare Image Resizing
        // Notes: 
        // 1. This fetch happens *inside* the worker.
        // 2. The `cf` object indicates to the runtime to apply transformations.
        const response = await fetch(url, {
            cf: {
                image: imageOptions
            }
        });

        // Error Handling: Check for 50 Megapixel limit or other errors
        // Cloudflare Images usually returns a header 'cf-resized' or specific error codes.
        if (!response.ok) {
            const errText = await response.text();

            // Check for specific Cloudflare error regarding pixel limits
            // This is a heuristic as the exact error message can vary
            if (response.status === 413 || errText.toLowerCase().includes('pixel count') || errText.toLowerCase().includes('limit exceeded')) {
                return c.json({ error: 'File Too Complex: Animation exceeds 50 Megapixel limit per frame or total.' }, 400);
            }

            return new Response(errText, {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Return the transformed image stream
        // We should forward appropriate headers like Content-Type
        const newHeaders = new Headers(response.headers);

        // Add a custom header to indicate it was processed
        newHeaders.set('X-Gif-Optimizer', 'processed');

        return new Response(response.body, {
            headers: newHeaders
        });

    } catch (e: any) {
        console.error('GIF Optimization Error:', e);
        return c.json({ error: 'Optimization processing failed', details: e.message }, 500);
    }
});

// Upload Proxy Route: Receives file directly and puts to R2
// Bypasses browser CORS issues with presigned URLs
app.post('/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'] as File;

        if (!file) {
            return c.json({ error: 'No file uploaded' }, 400);
        }

        const filename = file.name || `unknown_${Date.now()}`;
        // Use a temp directory
        const key = `temp/gif-optimizer/${crypto.randomUUID()}-${filename}`;

        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: c.env.R2_ACCESS_KEY_ID,
                secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
            },
        });

        // Convert File to ArrayBuffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to R2
        await S3.send(new PutObjectCommand({
            Bucket: c.env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type || 'application/octet-stream',
        }));

        // Generate Access URL (for the worker/optimizer to fetch source)
        const getCommand = new GetObjectCommand({
            Bucket: c.env.R2_BUCKET_NAME,
            Key: key,
        });
        const accessUrl = await getSignedUrl(S3, getCommand, { expiresIn: 3600 * 24 }); // 24 hours

        return c.json({
            success: true,
            accessUrl,
            key
        });

    } catch (e: any) {
        console.error('Upload Proxy Error:', e);
        return c.json({ error: 'Failed to upload file', details: e.message }, 500);
    }
});

export default app;
